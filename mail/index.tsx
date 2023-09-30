import React from 'react';
import { CompletedOrderTemplate } from './templates/CompletedOrder';
import { PasswordResetTemplate } from './templates/PasswordReset';
import { NotifyAdminBug } from './templates/NotifyAdminBug';
import { PaidUser } from './templates/PaidUser';
import { ErrorOrder } from './templates/ErrorOrder';

export default function App() {
  return {
    PasswordReset: {
      componentFunction: PasswordResetTemplate,
      props: {
        url: 'https://example.com?code=123456',
      },
    },
    CompletedOrder: {
      componentFunction: CompletedOrderTemplate,
      props: {
        username: 'example',
        actionUrl: 'https://example.com/orders/123456',
        amount: '1000',
        remains: '10',
      },
    },
    ErrorOrder: {
      componentFunction: ErrorOrder,
      props: {
        username: 'example',
        actionUrl: 'https://example.com',
        amount: '1000',
      },
    },
    NotifyAdminBug: {
      componentFunction: NotifyAdminBug,
      props: {
        message: 'Erro xxx',
      },
    },
    PaidUser: {
      componentFunction: PaidUser,
      props: {
        planName: 'Premium',
        actionUrl: 'https://example.com/upgrade',
        amount: '10.000',
      },
    },
  };
}
