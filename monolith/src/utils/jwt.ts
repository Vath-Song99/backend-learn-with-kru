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

export const generateSignature = async (payload: object): Promise<string> => {
  try {
    return await jwt.sign(payload, process.env.APP_SECRET as string, {
      expiresIn: "30d",
    });
  } catch (error) {
    throw new BaseCustomError(
      "Unable to generate signature from jwt",
      StatusCode.NOT_ACCEPTABLE
    );
  }
};


export const validatePassword = async ({
  enteredPassword,
  savedPassword,
}: {
  enteredPassword: string;
  savedPassword: string;
}) => {
  try {
    const isPasswordCorrect = await bcrypt.compare(
      enteredPassword,
      savedPassword
    );
    return isPasswordCorrect;
  } catch (error) {
    throw error;
  }
};