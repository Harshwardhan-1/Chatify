import z from 'zod';
import { minLength,maxLength } from 'zod';
export const checkUserOtpSchema=z.object({
otpnumber:z.string().min(6,'enter proper 6 digit otp number').nonempty('otp filled cannot be empty'),
})