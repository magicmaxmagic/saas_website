import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }

  // Customer Management
  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email,
      name,
    });
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
  }

  async updateCustomer(
    customerId: string,
    data: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    return await this.stripe.customers.update(customerId, data);
  }

  // Payment Methods
  async createPaymentMethod(
    type: 'card',
    card: Stripe.PaymentMethodCreateParams.Card1,
    customerId?: string,
  ): Promise<Stripe.PaymentMethod> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type,
      card,
    });

    if (customerId) {
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });
    }

    return paymentMethod;
  }

  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return paymentMethods.data;
  }

  // Subscriptions
  async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId?: string,
  ): Promise<Stripe.Subscription> {
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    };

    if (paymentMethodId) {
      subscriptionData.default_payment_method = paymentMethodId;
    }

    return await this.stripe.subscriptions.create(subscriptionData);
  }

  async updateSubscription(
    subscriptionId: string,
    data: Stripe.SubscriptionUpdateParams,
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, data);
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  // Payment Intents
  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
    customerId?: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }

  // Checkout Sessions
  async createCheckoutSession(
    customerId: string,
    priceIds: string[],
    successUrl: string,
    cancelUrl: string,
    mode: 'payment' | 'subscription' = 'subscription',
  ): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: priceIds.map(priceId => ({
        price: priceId,
        quantity: 1,
      })),
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
  }

  // Invoices
  async getInvoices(customerId: string, limit = 10): Promise<Stripe.Invoice[]> {
    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      limit,
    });
    return invoices.data;
  }

  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.retrieve(invoiceId);
  }

  // Products and Prices
  async createProduct(name: string, description?: string): Promise<Stripe.Product> {
    return await this.stripe.products.create({
      name,
      description,
    });
  }

  async createPrice(
    productId: string,
    unitAmount: number,
    currency: string = 'eur',
    recurring?: Stripe.PriceCreateParams.Recurring,
  ): Promise<Stripe.Price> {
    return await this.stripe.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency,
      recurring,
    });
  }

  async listPrices(productId?: string): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({
      product: productId,
      active: true,
    });
    return prices.data;
  }

  // Webhooks
  constructEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  // Utilities
  getStripeInstance(): Stripe {
    return this.stripe;
  }
}
