import axios from "axios"
import getConfig from "./config"
import { ApiError } from "../error/base-custom-error"
import { logger } from "./logger"

const config = getConfig()
export const createUser = async (token: string) =>{
    const url = `${config.userService}?token=${token}`
    try{
     const {data} = await axios.post(url);
     if(!data){
        throw new ApiError("Can't make request from user service!")
     }
     return data
    }catch(error: unknown){
        logger.error("Unable to fetch data Error createUser() method !",error);
        throw  error
    }
}