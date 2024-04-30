import { z } from "zod";

export const teacherSchemas = z.object({
  first_name: z.string().min(3).max(25),
  last_name: z.string().min(3).max(25),
  phone_number: z.string().regex(/^\+?(?:855|0)\d{8}$/),
  subject: z.string(),
  is_degree: z.boolean(),
  university: z.string(),
  year_experience: z.number(),
  type_degree: z.string(),
  specialization: z.string(),
  bio: z.string(),
  teacher_experience: z.string(),
  motivate: z.string(),
  date_available: z.object({
    day: z.string(),
    time: z.object({
      start: z.date(),
      end: z.date(),
    }),
  }),
  price: z.number(),
  certificate: z.string(),
  class_id: z.string(),
  video: z.string(),
});
