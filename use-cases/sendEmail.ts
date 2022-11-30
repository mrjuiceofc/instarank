import * as JSXMail from 'jsx-mail';
import * as nodemailer from 'nodemailer';
import { SendEmailDTO } from './users/dto';

// jsx mail keep dependencies
import '@jsx-mail/components';
import 'react';
import 'styled-components';
import { BaseError } from '../errors';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVER,
  host: process.env.SMTP_HOST,
  secure: false,
  secureConnection: false,
  tls: {
    ciphers: 'SSLv3',
  },
  requireTLS: true,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  template,
  variables,
  requestId,
  to,
  subject,
}: SendEmailDTO) {
  let html: string;
  try {
    html = await JSXMail.render(template, variables);
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao renderizar template de e-mail',
      errorLocationCode: 'sendEmail.ts:sendEmail:JSXMail.render',
      requestId,
      statusCode: 500,
    });
  }

  const mailOptions = {
    from: `"Instarank" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao enviar e-mail',
      errorLocationCode: 'sendEmail.ts:sendEmail:transporter.sendMail',
      requestId,
      statusCode: 500,
    });
  }

  return {
    message: 'E-mail enviado com sucesso',
  };
}
