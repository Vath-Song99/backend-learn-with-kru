import { z } from 'zod'
const userValidateSchema = z.object({
    username: z.string().min(3).max(25),
    email: z.string().email(),
    password: z.string().min(3).max(35)
});

export type UserValidateZodType = z.infer<typeof userValidateSchema>
export {userValidateSchema}