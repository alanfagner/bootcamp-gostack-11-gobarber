import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const sessionService = new CreateSessionService();

  const { user, token } = await sessionService.execute({ email, password });

  return response.json({ user, token });
});

export default sessionsRouter;
