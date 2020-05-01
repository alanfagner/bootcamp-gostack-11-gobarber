import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';

import User from '../models/User';
interface Request {
  userID: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ userID, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(userID);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFieldExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFieldExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
