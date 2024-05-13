import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../error/base-custom-error";
import { logger } from "./logger";


export const decodedToken = async (token: string) => {
  try {
    const data = (await jwt.decode(token)) as JwtPayload;
    return data.payload;
  } catch (error: unknown) {
    logger.error("Unable to decode in decodeToken() method !", error);
    throw new ApiError("Can't Decode token!");
  }
};

