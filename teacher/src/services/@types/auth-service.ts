import { Teacher } from "../../@types/teacher.type";


export interface TeacherService extends Teacher {
    userId: string
}
export interface CreateTeacherRes {
    TeacherRepo: TeacherService,
    token: string
}