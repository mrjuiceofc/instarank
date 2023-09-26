import React from 'react';
import { CompletedOrderTemplate } from './templates/CompletedOrder';
import { PasswordResetTemplate } from './templates/PasswordReset';
import { NotifyAdminBug } from './templates/NotifyAdminBug';

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
    NotifyAdminBug: {
      componentFunction: NotifyAdminBug,
      props: {
        message: 'Erro xxx',
      },
    },
  };
}
