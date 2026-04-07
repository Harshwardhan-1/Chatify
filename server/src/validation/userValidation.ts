import z from 'zod';
export const userSchema=z.object({
    name:z.string().min(3,'name must be atleast 3 characters'),
    userName:z.string().min(3,'username must be atleast 3 characters'),
    email:z.string().email('invalid email format').nonempty('email field cannot be empty'),
    password:z.string().min(3,'password must be atleast 3 characters'),
});




export const userLoginSchema=z.object({
    email:z.string().email('invalid email format').nonempty('email is required'),
    password:z.string(),
})