import bcrypt from "bcrypt";
import { ApiError, BaseCustomError } from "./base-custom-error";
import StatusCode from "./http-status-code";
import jwt from 'jsonwebtoken';

const salt = 10;

export const generatePassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new ApiError("Unable to generate password");
  }
};

export const generateSignature = async ({payload}: {payload: string | object}): Promise<string> => {

  try {
    const token = jwt.sign(payload, process.env.SECRET_KEY as string);  
    return  token
  } catch (error: unknown | string) {
    throw new BaseCustomError(
      error as string,
      StatusCode.NOT_ACCEPTABLE
    );
  }
};
