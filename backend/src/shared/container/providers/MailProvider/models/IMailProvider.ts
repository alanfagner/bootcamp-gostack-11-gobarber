import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

export default interface IMailProvider {
  sendMail(sendEmailDTO: ISendMailDTO): Promise<void>;
}
