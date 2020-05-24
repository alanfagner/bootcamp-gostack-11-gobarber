import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import EthrerealMailProvider from '@shared/container/providers/MailProvider/implementations/EthrerealMailProvider';
import SesMailProvider from '@shared/container/providers/MailProvider/implementations/SesMailProvider';

const providers = {
  ethereal: container.resolve(EthrerealMailProvider),
  ses: container.resolve(SesMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
