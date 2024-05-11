import { NextFunction, Router , Request , Response } from "express";
import { PATH_CRUD } from "../path-defs";
import { CrudController } from "../../controllers/crud.controller";
import StatusCode from "../../utils/http-status-code";

const CrudRoute:Router = Router();

CrudRoute.get(PATH_CRUD.getUser, async (req: Request, res: Response ,_next: NextFunction) =>{
    const authId = req.params.authId;
    try{
        const controller = new CrudController();
        const user = await controller.GetUser(authId);

        res.status(StatusCode.OK).json({
            message: "Get success",
            data: user
        })
    }catch(error: unknown){
        _next(error)
    }
});

export default CrudRoute