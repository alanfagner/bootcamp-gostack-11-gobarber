import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';
export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { filename } = request.file;
    const { id } = request.user;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userID: id,
      avatarFilename: filename,
    });

    return response.json(classToClass(user));
  }
}
