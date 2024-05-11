import {  NextFunction, Router, Request ,Response } from "express";
import { PATH_STUDENT } from "../path-defs";
import { StudentController } from "../../controllers/student.controller";
import { studentValidate } from "../../middlewares/student-validate";
import { StudentSchemas } from "../../schemas/student-validate";
import StatusCode from "../../utils/http-status-code";


const Route = Router()

Route.post (PATH_STUDENT.SIGNUP, studentValidate(StudentSchemas) , async (req: Request , res: Response, _next: NextFunction) =>{
    const token = req.headers.authorization?.split(' ')[1]
    const requestBody = req.body;
    try{

        const controller = new StudentController();
        const newStudent = await controller.Signup(requestBody, token as string);

        res.status(StatusCode.CREATED).json({
            message: "success",
            student: newStudent
        })
    }catch(error: unknown){
        _next(error)
    }
})

export default Route