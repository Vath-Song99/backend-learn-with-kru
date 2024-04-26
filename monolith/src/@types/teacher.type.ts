import mongoose from "mongoose";

export interface Teacher{
    first_name: string;
    last_name: string;
    phone_number: string;
    subject: string;
    is_degree: boolean;
    university: string;
    year_experience: number;
    type_degree: string;
    specialization: string;
    bio: string;
    teacher_experience: string;
    motivate: string;
    date_available: object;
    price: number;
    certificate: string;
    class_id: mongoose.ObjectId;
    video: string
}