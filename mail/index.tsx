import React from 'react';
import { PasswordResetTemplate } from './templates/PasswordReset';

export default function App() {
  return {
    PasswordReset: {
      componentFunction: PasswordResetTemplate,
      props: {
        url: 'https://example.com?code=123456',
      },
    },
  };
}
