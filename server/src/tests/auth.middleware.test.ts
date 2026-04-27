import request from 'supertest';
import jwt from 'jsonwebtoken';
import { addUserModel } from '../models/userModel';
import { isAdminLoggedIn, isUserLoggedIn } from '../middleware/auth.middleware';
import { addUser } from '../Controllers/auth.controller';
jest.mock('jsonwebtoken');
jest.mock("../models/userModel");


describe("Auth Middleware",()=>{
    let req:any;
    let res:any;
    let next:any;

    beforeEach(()=>{    
        req={cookies:{}};
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()                          
        }
        next=jest.fn();
    });

    describe("isUserLoggedIn",()=>{
        it("it should return 401 if no token found",async()=>{
            await isUserLoggedIn(req,res,next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success:false,
                message:"token not found",
            })
        });
        it("it should return user not found with a status code of 401",async()=>{
                req.cookies.token="validtoken";
            (jwt.verify as jest.Mock).mockResolvedValue({email:"test@gmail.com"});
            (addUserModel.findOne as jest.Mock).mockReturnValue({
                select:jest.fn().mockResolvedValue(null)
            });
            await isUserLoggedIn(req,res,next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success:false,
                message:"User not found",
            })
        })
        it("it should allow next to call",async()=>{
            req.cookies.token="fake_token";
            (jwt.verify as jest.Mock).mockResolvedValue({email:"test@gmail.com"});
            const mockUser="test@gmail.com";
            (addUserModel.findOne as jest.Mock).mockReturnValue({
                select:jest.fn().mockResolvedValue(mockUser)
            })
           await isUserLoggedIn(req,res,next);
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        })
    })





    describe("isAdminLoggedIn",()=>{
        it("it should return 401 token not found",async()=>{
            await isAdminLoggedIn(req,res,next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success:false,
                message:"token not found",
            })
        });
        it("it should return 403 for non admin user",async()=>{
            req.cookies.token="fake_token";
            (jwt.verify as jest.Mock).mockReturnValue({email:"test@gmail.com",role:"user"});
            await isAdminLoggedIn(req,res,next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                success:false,
                message:"access denied"
            })
        })
        it("it should return 401 when user not found",async()=>{
            req.cookies.token="fake_token";
            (jwt.verify as jest.Mock).mockReturnValue({email:"test@gmail.com",role:"admin"});
            (addUserModel.findOne as jest.Mock).mockReturnValue({
                select:jest.fn().mockResolvedValue(null)
            });
            await isAdminLoggedIn(req,res,next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success:false,
                message:"user not found",
            })
        })
        it("it should allow next to call",async()=>{
            req.cookies.token="fake_token";
            (jwt.verify as jest.Mock).mockReturnValue({email:"test@gmail.com",role:"admin"});
            const mock="test@gmail.com";
            (addUserModel.findOne as jest.Mock).mockReturnValue({
                select:jest.fn().mockResolvedValue(mock)
            })
           await isAdminLoggedIn(req,res,next);
           expect(next).toHaveBeenCalledWith();
           expect(req.user).toEqual(mock);
        })
    })
})