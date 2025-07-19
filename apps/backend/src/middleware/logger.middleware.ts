import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const start = Date.now();
    const correlationId = req.headers['x-correlation-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add correlation ID to request for tracing
    req['correlationId'] = correlationId;

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const contentLength = res.get('content-length') || 0;
      
      const logData = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        contentLength: `${contentLength}b`,
        userAgent,
        ip,
        correlationId,
        timestamp: new Date().toISOString(),
      };

      const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms ${contentLength}b - ${ip}`;

      if (statusCode >= 400) {
        this.logger.error(logMessage, logData);
      } else if (statusCode >= 300) {
        this.logger.warn(logMessage, logData);
      } else {
        this.logger.log(logMessage, logData);
      }
    });

    res.on('error', (error) => {
      this.logger.error(`Request error: ${error.message}`, {
        method,
        url: originalUrl,
        error: error.stack,
        correlationId,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
