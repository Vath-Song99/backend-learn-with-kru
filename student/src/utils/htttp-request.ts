import axios from "axios";
import { logger } from "./logger";
import getConfig from "./config";
import { PATH_USER } from "../routes/path-defs";
import { ApiError } from "../error/base-custom-error";

export const  getUserById = async(userId: string) => {
  const url = `${getConfig().userService}${PATH_USER.GET}/${userId}`;
  console.log(url)
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch data from user service: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      logger.error("Axios Error in createUser() method:", error.message); 
      if (error.response) {
        logger.error("Response data:", error.response.data); 
        logger.error("Response status:", error.response.status); 
        logger.error("Response headers:", error.response.headers);
      }
      throw new ApiError("Error communicating with user service.");
    } else {
      logger.error("Unknown Error in createUser() method:", error);
      throw error;
    }
  }
}
