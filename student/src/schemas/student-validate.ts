import { z } from "zod"

export const StudentSchemas = z.object({
  schoolName: z.string().min(2).max(50),
  education: z.string().min(2).max(50),
  grade: z.number(),
  studentCard: z.string()
});