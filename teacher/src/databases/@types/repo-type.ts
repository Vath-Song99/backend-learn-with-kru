import { ObjectId } from "mongodb";
import { Teacher } from "../../@types/teacher.type";

export interface PaginateRepo {
    pageSize: number;
    skip: number;
}

export interface TeacherRepo extends Teacher{
    _id?: ObjectId;
    userId: string
}

