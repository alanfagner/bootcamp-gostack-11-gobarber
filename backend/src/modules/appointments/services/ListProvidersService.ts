import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(userID: string): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${userID}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        exceptUserID: userID,
      });

      await this.cacheProvider.save(`providers-list:${userID}`, users);
    }

    return users;
  }
}

export default ListProvidersService;
