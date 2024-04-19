import { Request, Response, NextFunction} from 'express'
import { ApiError, BaseCustomError } from '../utils/base-custom-error'


export const errorHandler = async (error: Error, req: Request, res: Response, _next: NextFunction) =>{
    if(error instanceof BaseCustomError){
    const status = error.statusCode;
        res.status(status).json({
            statusCode: status,
            message: error.message,
        })
    }
    _next()
}