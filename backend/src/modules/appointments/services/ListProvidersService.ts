import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(userID: string): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      exceptUserID: userID,
    });

    return users;
  }
}

export default ListProvidersService;
