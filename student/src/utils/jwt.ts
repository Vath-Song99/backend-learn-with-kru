import jwt, { JwtPayload } from "jsonwebtoken";
import fs from 'fs'
import path from "path";
import getConfig from "./config";
import { BaseCustomError } from "../error/base-custom-error";
import StatusCode from "./http-status-code";
const privateKeyPath = path.join(__dirname, "../../private_key.pem");
// Read the private key from the file
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

export const decodedToken = async (token: string) => {
  try {
    const data = await jwt.decode(token)as JwtPayload;
    return data.payload;
  } catch (error: unknown) {
    throw error;
  }
};

const config = getConfig()

export const generateSignature = async ({_id}: {_id: string}): Promise<string> => {
  const payloadData = {
    id: _id,
    role: "student"
  }
  try {
    return await jwt.sign({payload: payloadData}, privateKey, {
      expiresIn: config.jwtExpiresIn!,
      algorithm: 'RS256'
    });
  } catch (error: unknown) {
    throw new BaseCustomError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      StatusCode.NOT_ACCEPTABLE
    );
  }
};