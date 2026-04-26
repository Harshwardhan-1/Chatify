import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app';
import { addUserModel } from '../models/userModel';
import { userPresenceModel } from '../models/userPresence.model';

jest.mock("../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("POST /api/v1/addUser",()=>{
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
     it.only("it should return user already exist with a status code of 409",async()=>{
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