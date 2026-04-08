import {Router} from 'express';
const userRoutes=Router();
import { addUser,oldUsers,recieveOtp,resendOtp,me,userInfo,currentUser,getCurrentUserId,allreceiver } from '../Controllers/auth.controller';
import { isUserLoggedIn } from '../middleware/auth.middleware';

userRoutes.post('/addUser',addUser);
userRoutes.post('/oldUser',oldUsers);
userRoutes.post('/checkOtp',isUserLoggedIn,recieveOtp);
userRoutes.get('/resend',isUserLoggedIn,resendOtp);
userRoutes.get('/me',isUserLoggedIn,me);
userRoutes.get('/userInfo',isUserLoggedIn,userInfo);
userRoutes.get('/currentUser',isUserLoggedIn,currentUser);
userRoutes.get('/getCurrentUserId',isUserLoggedIn,getCurrentUserId);
userRoutes.get('/receiver',isUserLoggedIn,allreceiver);
export default userRoutes;      