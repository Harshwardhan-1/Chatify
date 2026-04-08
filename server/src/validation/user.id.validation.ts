import z from 'zod';
export  const checkUserId=z.object({
   currentUserId:z.string().nonempty('current User id cannot be empty'),
});