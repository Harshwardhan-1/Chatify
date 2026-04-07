import {Router} from 'express';
const userRoutes=Router();
import { addUser,oldUsers,recieveOtp,resendOtp,me,userInfo,currentUser } from '../Controllers/auth.controller';
import { isUserLoggedIn } from '../middleware/auth.middleware';

userRoutes.post('/addUser',addUser);
userRoutes.post('/oldUser',oldUsers);
userRoutes.post('/checkOtp',isUserLoggedIn,recieveOtp);
userRoutes.get('/resend',isUserLoggedIn,resendOtp);
userRoutes.get('/me',isUserLoggedIn,me);
userRoutes.get('/userInfo',isUserLoggedIn,userInfo);
userRoutes.get('/currentUser',isUserLoggedIn,currentUser);

export default userRoutes;      