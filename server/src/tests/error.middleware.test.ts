import {Request,Response,NextFunction} from 'express';
import { errorMiddleware } from '../middleware/error.middleware';


describe("error middleware",()=>{
    let mockReq:Partial<Request>;
    let mockRes:Partial<Response>;
    let mockNext:NextFunction;
    beforeEach(()=>{
        mockReq={};
        mockRes={
            status:jest.fn().mockReturnThis(),
            json:jest.fn(),
        };
        mockNext=jest.fn();
    });


    it("it should return 500",async()=>{
        const err:any={
            message:"something went wrong",
        };
        await errorMiddleware(err,mockReq as Request,mockRes as Response,mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            success:false,
            error:"something went wrong",
        });
    })
    it("it should handle casterror and return 404 if not found",async()=>{
        const err:any={
            name:"CastError",
            message:"Invalid Id",
        };
        await errorMiddleware(err,mockReq as Request,mockRes as Response,mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            success:false,
            error:"Resource not found",
        });
    });
    it("it should handle duplicate field and return 404 it duplicate field value find",async()=>{
        const err:any={
            code:11000,
            message:"Duplicate field value entered",
        };
        await errorMiddleware(err,mockReq as Request,mockRes as Response,mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success:false,
            error:"Duplicate field value entered"
        })
    });
    it("it should return validation error with a status code of 400",async()=>{
        const err:any={
            name:"ValidationError",
            errors:{
                email:{message:"email is required"},
                name:{message:"name is required"},
            },
        };
        await errorMiddleware(err,mockReq as Request,mockRes as Response,mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success:false,
            error:"email is required,name is required",
        })
    });
    it("it should handle unexpected error inside middleware",async()=>{
        const err:any={
            name:"ValidationError",
            errors:null,
        };
        await errorMiddleware(err,mockReq as Request,mockRes as Response,mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            success:false,
            error:"Server error",
        })
    })
})