import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import mailConfig from '@config/mail';
import aws from 'aws-sdk';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SesMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    const html = await this.mailTemplateProvider.parse(templateData);

    await this.client.sendMail({
      from: {
        name: name,
        address: email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });
  }
}
