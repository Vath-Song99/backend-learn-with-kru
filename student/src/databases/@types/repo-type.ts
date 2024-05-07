import { Student } from "../../@types/student.type";


export interface StudentRepo extends Student{
    authId: string;
    firstname: string;
    lastname: string;
    email: string;
}