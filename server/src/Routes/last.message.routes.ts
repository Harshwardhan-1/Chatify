import {Router} from 'express';
export const userLastMessages=Router();
import { isUserLoggedIn } from '../middleware/auth.middleware';
import { lastMessage } from '../Controllers/last.message.controller';


userLastMessages.get('/lastMessage',isUserLoggedIn,lastMessage);