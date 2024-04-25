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
})

export const authModel = mongoose.model("auths", authSchemas);