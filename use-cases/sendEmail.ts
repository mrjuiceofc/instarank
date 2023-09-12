import * as nodemailer from 'nodemailer';
import { SendEmailDTO } from './dto';
import { BaseError } from '../errors';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
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
    const templatePath = path.resolve(
      process.cwd(),
      'mail',
      'hbs',
      `${template}.hbs`
    );
    const templateFileContent = fs.readFileSync(templatePath);
    const parseTemplate = handlebars.compile(templateFileContent.toString());
    html = parseTemplate(variables);
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
    console.log(error);
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
