import { Router } from 'express';
import actions from './actions';

const postRouter = Router();

postRouter.post('/posts', actions.createPost);

export default postRouter;