import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import { logger } from "./logger";
import getConfig from "./config";
import StatusCode from "./http-status-code";
import path from "path";
import fs from "fs";
// Read the private key from the file

const privateKeyPath = path.join(__dirname, "../../private_key.pem");
// Read the private key from the file
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export const decodedToken = async (token: string) => {
  try {
    const data = (await jwt.decode(token)) as JwtPayload;
    return data.payload;
  } catch (error: unknown) {
    logger.error("Unable to decode in decodeToken() method !", error);
    throw new ApiError("Can't Decode token!");
  }
};

const config = getConfig();

export const generateSignature = async ({
  _id,
}: {
  _id: string;
}): Promise<string> => {
  const payloadData = {
    id: _id,
    role: "teacher",
  };
  try {
    return await jwt.sign({ payload: payloadData }, privateKey, {
      expiresIn: config.jwtExpiresIn!,
      algorithm: "RS256",
    });
  } catch (error: unknown) {
    throw new BaseCustomError(
      error instanceof Error ? error.message : "Unknown error occurred",
      StatusCode.NOT_ACCEPTABLE
    );
  }
};
