import {Router} from 'express';
export const userlastMessage=Router();
import { isUserLoggedIn } from '../middleware/auth.middleware';
import { userAllConversion } from '../Controllers/lastmessage.controller';

userlastMessage.get("/userAllConversion",isUserLoggedIn,userAllConversion);