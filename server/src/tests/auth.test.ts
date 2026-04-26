import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app';
import { addUserModel } from '../models/userModel';
import { addUser } from '../Controllers/auth.controller';

jest.mock("../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");


describe("POST /api/v1/addUser",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    })
    it("it should register user successfully with a status code of 201",async()=>{
        (addUserModel.findOne as jest.Mock).mockResolvedValue(null);
        (bcrypt.genSalt as jest.Mock).mockResolvedValue("***");
        (bcrypt.hash as jest.Mock).mockResolvedValue("12***");
        (addUserModel.create as jest.Mock).mockResolvedValue({
            name:"test",
            userName:"test",
            email:"test@gmail.com",
            password:"1234",
        });
        (jwt.sign as jest.Mock).mockReturnValue("fake_token");
        const res=await request(app)
        .post("/api/v1/addUser")
        .send({
            name:"test",
            userName:"test",
            email:"harshwardhan@gmail.com",
            password:"1234",
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            success:true,
            message:"user created successfully",
        });
    });
     it("it should give parsed error with a status code of 400",async()=>{
            const res=await request(app)
            .post("/api/v1/addUser")
            .send({
                name:"test",
                userName:"test",
                email:"test",
                password:"1234",
            });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success:false,
                message:"invalid email format",
            })
     })
     it("it should return user already exist with a status code of 409",async()=>{
        (addUserModel.findOne as jest.Mock).mockReturnValue("test@gmail.com");
        const res=await request(app)
        .post("/api/v1/addUser")
        .send({
            name:"test",
            userName:"test@gmail.com",
            email:"test@gmail.com",
            password:"1234",
        });
        expect(res.status).toBe(409);
        expect(res.body).toEqual({
            success:false,
            message:"user already exist",
        })
     })
})









describe.only("POST /api/v1/oldUser",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    })
    it("it should return user find successfully with a status code of 200",async()=>{
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (addUserModel.findOne as jest.Mock).mockResolvedValue({
            email:"test@gmail.com",
            password:"123**",
        });
        (jwt.sign as jest.Mock).mockReturnValue("fake_token");
        const res=await request(app)
        .post("/api/v1/oldUser")
        .send({
            email:"test@gmail.com",
            password:"123**",
        })
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success:true,
            message:"successfully found user",
        })
    });
    it("it should return parsed error with a status code of 400",async()=>{
        const res=await request(app)
        .post("/api/v1/oldUser")
        .send({
            email:"test@gmail.com",
            password:"",
        });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success:false,
            message:"password is required",
        })
    });
    it("it should return user not found with a status code of 400",async()=>{
        (addUserModel.findOne as jest.Mock).mockResolvedValue(null);
        const res=await request(app)
        .post("/api/v1/oldUser")
        .send({
            email:"test@gmail.com",
            password:"1234",
        });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success:false,
            message:"user not exist",
        });
    })
    it("it should return password is required with a status code of 400",async()=>{
        (addUserModel.findOne as jest.Mock).mockResolvedValue({
            email:"test@gmail.com",
        })
        const res=await request(app)
        .post("/api/v1/oldUser")
        .send({
            email:"test@gmail.com",
            password:"123",
        });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success:false,
            message:"password is required",
        })
    });
    it.only("it should return password dont match with a status code of 400",async()=>{
        (addUserModel.findOne as jest.Mock).mockResolvedValue({
            email:"test@gmail.com",
            password:"123",
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        const res=await request(app)
        .post("/api/v1/oldUser")
        .send({
            email:"test@gmail.com",
            password:"123",
        });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success:false,
            message:"password doesn't match",
        });
    })
})











describe.only("POST /api/v1/logout",()=>{
    it("it should logout user and return status code of 200",async()=>{
       (jwt.verify as jest.Mock).mockReturnValue({email:"test@gmail.com"});
       (addUserModel.findOne as jest.Mock).mockResolvedValue({
        _id:"123",
        email:"test@gmail.com",
        role:"user",   
    });
    const res=await request(app)
    .get("/api/v1/logout")
    .set("Cookie",["token=fake_token"]);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("logout successfully");
    expect(res.body.success).toBe(true);
    const cookies=res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("token=");
    });
    it("it should return token not found with a status code of 401",async()=>{
        (jwt.verify as jest.Mock).mockResolvedValue({_id:"123",email:"test@gmail.com",role:"user"});
        (addUserModel.find as jest.Mock).mockResolvedValue({
          email:"test@gmail.com",  
        });
        const res=await request(app)
        .get("/api/v1/logout")
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            success:false,
            message:"token not found",
        })
    })
    it("it should return user not found with a status code of 401",async()=>{
        (jwt.verify as jest.Mock).mockResolvedValue({email:"test@gmail.com"});
        (addUserModel.findOne as jest.Mock).mockResolvedValue(null);
        const res=await request(app)
        .get("/api/v1/logout")
        .set("Cookie",["token=fake_token"]);
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            success:false,
            message:"User not found",
        });
    })
})