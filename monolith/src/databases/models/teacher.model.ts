import mongoose from "mongoose";
import { Teacher } from "../../@types/teacher.type";

const teacherSchemas = new mongoose.Schema({
  first_name: {
    type: String,
    min: 3,
    max: 25,
    require: true,
  },
  last_name: {
    type: String,
    min: 3,
    max: 25,
    require: true,
  },
  phone_number: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  is_degree: {
    require: true,
    type: Boolean,
  },
  year_experience: {
    require: true,
    type: Number,
  },
  type_degree: {
    require: true,
    type: String,
  },
  specialization: {
    require: true,
    type: String,
  },
  bio: {
    type: String,
  },
  teacher_experience: {
    require: true,
    type: String,
  },
  motivation: {
    require: true,
    type: String,
  },
  date_available: {
    require: true,
    type: Object,
  },
});

export const teacherModel = mongoose.model<Teacher>("teachers", teacherSchemas);
