import { Router } from 'express';
import actions from './actions';

const commentRoute = Router();

commentRoute.post('/comments', actions.addComment);

export default commentRoute;