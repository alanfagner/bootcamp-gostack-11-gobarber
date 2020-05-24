import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import { celebrate, Segments, Joi } from 'celebrate';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const userAvatarController = new UserAvatarController();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
