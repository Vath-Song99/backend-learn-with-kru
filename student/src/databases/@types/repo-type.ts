import { Student } from "../../@types/student.type";


export interface StudentRepo extends Student{
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
}