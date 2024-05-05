import bcrypt from "bcrypt";
import StatusCode from "./http-status-code";
import jwt from 'jsonwebtoken';
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import getConfig from "./config";
import path from "path";
import fs from 'fs'

const salt = 10;

const privateKeyPath = path.join(__dirname, "../../private_key.pem");
// Read the private key from the file
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  
export const generatePassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new ApiError("Unable to generate password");
  }
};

export const generateSignature = async ({payload}: {payload: string}): Promise<string> => {

  try {
    return await jwt.sign({payload: payload}, privateKey, {
      expiresIn: getConfig().jwtExpiresIn!,
      algorithm: 'RS256'
    });
  } catch (error: unknown) {
    throw new BaseCustomError(
      error instanceof Error ? error.message : 'Unknown error occurred',
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