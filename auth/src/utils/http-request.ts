import axios from "axios";
import getConfig from "./config";
import { ApiError } from "../error/base-custom-error";
import { logger } from "./logger";
import { UserService } from "../services/@types/auth-service";
import { PATH_SERVICE } from "../routes/path-defs";

const config = getConfig();

export class RequestUserService {
  async CreateUser({
    authId,
    firstname,
    lastname,
    email,
    picture,
  }: UserService) {
    const url = `${config.userService}${PATH_SERVICE.USER.CREATE_USER}`;
    try {
      const requestData = { authId, firstname, lastname, email, picture };
      const jsonData = JSON.stringify(requestData);

      const { data } = await axios.post(url, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!data) {
        throw new ApiError("User service did not return data.");
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error("Axios Error in createUser() method:", error.message); // Log Axios error message
        if (error.response) {
          logger.error("Response data:", error.response.data); // Log response data if available
          logger.error("Response status:", error.response.status); // Log response status if available
          logger.error("Response headers:", error.response.headers); // Log response headers if available
        }
        throw new ApiError("Error communicating with user service.");
      } else {
        logger.error("Unknown Error in createUser() method:", error); // Log other types of errors
        throw error;
      }
    }
  }

  async GetUser(authId: string) {
    const url = `${config.userService}${PATH_SERVICE.USER.GET_USER}/${authId}`;

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
        logger.error("Axios Error in GetUser() method:", error.message); // Log Axios error message
        if (error.response) {
          logger.error("Response data:", error.response.data); // Log response data if available
          logger.error("Response status:", error.response.status); // Log response status if available
          logger.error("Response headers:", error.response.headers); // Log response headers if available
        }
        throw new ApiError("Error communicating with user service.");
      } else {
        logger.error("Unknown Error in GetUser() method:", error); // Log other types of errors
        throw error;
      }
    }
  }
}
