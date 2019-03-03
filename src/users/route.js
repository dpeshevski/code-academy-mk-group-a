import { Router } from 'express';
import actions from './actions';

const userRoute = Router();

userRoute.get('/users', actions.getUsersWithInclude);
userRoute.post('/users', actions.registerUser);
userRoute.get('/listingUsers', actions.listAllUsers);
// userRoute.get('/users/:id', actions.get);
// userRoute.get('/users/:id', actions.getUsersWithInclude);
// userRoute.post('/users', actions.create);
// userRoute.delete('/users/:id', actions.del);
// userRoute.put('/users/:id', actions.update);

export default userRoute;
