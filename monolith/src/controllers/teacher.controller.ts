import { SuccessResponse } from "tsoa";
import StatusCode from "../utils/http-status-code";
import { TeacherServices } from "../services/teacher-services";
import { Paginate } from "../@types/paginate.type";


export class TeacherController{
    
    constructor(){

    }
    @SuccessResponse(StatusCode.OK, "OK")
    public async TeacherList (options : Paginate){
        try{
            const service = new TeacherServices();
            const newTeacher = await service.TeacherList(options)

            return newTeacher
        }catch(error: unknown){
            throw error
        }
    }
}