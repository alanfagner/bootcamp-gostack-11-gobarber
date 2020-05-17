import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContant {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContant;
  from?: IMailContant;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
