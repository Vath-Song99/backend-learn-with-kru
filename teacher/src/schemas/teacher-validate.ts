import { z } from "zod";

export const teacherSchemas = z.object({
  first_name: z.string().min(2).max(25),
  last_name: z.string().min(2).max(25),
  phone_number: z
    .string()
    .min(8)
    .regex(/^\+?(?:855|0)\d{8}$/),
  subject: z.string(),
  province: z.string(),
  university: z.string().min(2).max(120),
  year_experience: z.number(),
  type_degree: z.string(),
  bio: z.string().min(40).max(120),
  motivate: z.string().min(25).max(100),
  date_available: z.object({
    day: z.string(),
    time: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
  price: z.number(),
  certificate: z.string(),
  class_id: z.string(),
  video: z.string(),
});
