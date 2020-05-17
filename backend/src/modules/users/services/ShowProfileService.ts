import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(userID: string): Promise<User> {
    const user = await this.usersRepository.findByID(userID);

    if (!user) {
      throw new AppError('User does not exists');
    }

    return user;
  }
}

export default ShowProfileService;
