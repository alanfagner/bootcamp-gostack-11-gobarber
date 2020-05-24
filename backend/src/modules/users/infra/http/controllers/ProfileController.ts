import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userID = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute(userID);

    delete user.password;

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, oldPassword } = request.body;

    const userID = request.user.id;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      userID,
      name,
      email,
      password,
      oldPassword,
    });

    return response.json(classToClass(user));
  }
}
