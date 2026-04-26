import request from 'supertest';
import app from '../app';

describe("/",()=>{
    it("it should display hext message",async()=>{
        const res=await request(app)
        .get("/")
        expect(res.status).toBe(200);
        expect(res.text).toBe("hii harsh here");
    })
    it("it should check test",async()=>{
        const res=await request(app)
        .get("/test")
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success:true,
            message:"test successfull",
        })
    })
})