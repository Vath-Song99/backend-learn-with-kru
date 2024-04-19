import mongoose, { Schema } from "mongoose";

const authSchemas = new mongoose.Schema({
    username:{
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
    }
})

export const authModel = mongoose.model("auth", authSchemas);