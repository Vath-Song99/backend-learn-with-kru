import { Request, Response, NextFunction} from 'express'
import { BaseCustomError } from '../error/base-custom-error';


export const errorHandler = async (error: Error, _req: Request, res: Response, _next: NextFunction) =>{
    if(error instanceof BaseCustomError){
    const status = error.statusCode;
        res.status(status).json({
            success: false,
            errors: {
                message: error.message,
                code: status
              }
        })
    }
    _next()
}