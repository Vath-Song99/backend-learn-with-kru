import mongoose from "mongoose";

const userSchemas = new mongoose.Schema({
  authId: {
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
  picture: {
    type: String
  }
});


export const UserModel = mongoose.model('users',userSchemas)