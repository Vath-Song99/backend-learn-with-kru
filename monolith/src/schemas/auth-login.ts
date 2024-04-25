import { z } from 'zod'
const authLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
});

export type UserValidateZodType = z.infer<typeof authLoginSchema>
export {authLoginSchema}