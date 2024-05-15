import mongoose from "mongoose";
import { Teacher } from "../../@types/teacher.type";

const teacherSchemas = new mongoose.Schema({
  userId: {
    type: String
  },
  first_name: {
    type: String,
    min: 2,
    max: 25,
    require: true,
  },
  last_name: {
    type: String,
    min: 2,
    max: 25,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  phone_number: {
    type: String,
    require: true,
  },
  province:{
    type: String,
    require: true
  },
  university:{
    type: String,
    min: 50,
    max: 120,
    require: true
  },
  year_experience: {
    require: true,
    type: Number,
  },
  type_degree: {
    require: true,
    type: String,
  },
  bio: {
    type: String,
    min: 50,
    max: 120,
    require: true
  },
  teacher_experience: {
    require: true,
    type: String,
  },
  motivation: {
    require: true,
    type: String,
    min: 25,
    max: 100,
  },
  date_available: {
    require: true,
    type: Object,
  },
  price: {
    type: Number,
    require: true
  },
  video: {
    type: String,
    require: true
  },
  Degree: {
    type: String,
    require: true
  }
});

export const teacherModel = mongoose.model<Teacher>("teachers", teacherSchemas);
