import mongoose from "mongoose";

const studentSchemas = new mongoose.Schema({
  userId: {
    type: String
  },
  firstname:{
    type: String,
    min: 2,
    max: 25
  },
  lastname: {
    type: String,
    min: 2,
    max: 25
  },
  email: {
    type: String,
    min: 2,
  },
  school_name: {
    type: String,
    min: 2,
    max: 50,
    require: true,
  },
  education: {
    type: String,
    min: 2,
    require: true,
    max: 50,
  },
  grade: {
    require: true,
    type: Number,
  },
  student_card: {
    type: String,
  },
});


export const StudentModel = mongoose.model('students',studentSchemas)