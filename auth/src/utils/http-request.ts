import axios from "axios"
import getConfig from "./config"
import { ApiError } from "../error/base-custom-error"
import { logger } from "./logger"

const config = getConfig()

export class RequestUserService {
    async CreateUser (token: string){
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
    };

    async GetUser (authId: string){
        const url = `${config.userService}/${authId}`;
        try{
            const { data } = await axios.get(url);
            if(!data){
                throw new ApiError("Cant't make request from user service!");
            }
            return data
        }catch(error: unknown){
            logger.error("Unable to fetch data Error GetUser() method !",error);
            throw  error
        }
    }
}