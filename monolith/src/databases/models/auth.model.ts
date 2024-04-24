import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

const authSchemas = new mongoose.Schema({
    firstname:{
        type: String,
        min: 3,
        max: 25,
        require: true
    },
    lastname:{
        type: String,
        min: 3,
        max: 25,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        min: 8,
        max: 35,
        require: true
    },
    is_verified: {
        type: Boolean,
        default: false,
      },
    googleId: {
        type: String,
    },
    profile: {
        type: String
    }
})

export const authModel = mongoose.model("auths", authSchemas);