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
        unique: true,
    },
    password: {
        type: String,
        min: 8,
        max: 35,
    },
    is_verified: {
        type: Boolean,
        default: false,
      },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String
    },
    profile_picture: {
        type: String
    }
})

export const authModel = mongoose.model("auths", authSchemas);