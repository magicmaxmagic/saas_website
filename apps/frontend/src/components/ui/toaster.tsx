'use client';

import { useState } from 'react';

export function Toaster() {
  const [toasts, setToasts] = useState<any[]>([]);

  return (
    <div className="fixed top-0 right-0 z-50 w-full max-w-sm p-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto mb-4 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="p-4">
            <div className="text-sm font-medium text-gray-900">
              {toast.title}
            </div>
            {toast.description && (
              <div className="mt-1 text-sm text-gray-500">
                {toast.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
