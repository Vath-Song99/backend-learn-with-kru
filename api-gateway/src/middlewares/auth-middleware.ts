import { NextFunction, Request, Response } from "express";
import APIError from "../errors/api-error";
import { StatusCode } from "../utils/consts";
import { logger } from "../utils/logger";
import { verify, JwtPayload } from "jsonwebtoken";
import { publicKey } from "../server";

async function verifyUser(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!req.session?.jwt) {
      logger.error(
        "Token is not available. Gateway Service verifyUser() method error"
      );
      throw new APIError(
        "Please login to access this resource.",
        StatusCode.Unauthorized
      );
    }

    // Verify JWT token
    const decodedToken = verify(req.session.jwt, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    // Extract user information from the decoded token
    const userRole = decodedToken.role;

    // Check if the user has the required permissions (role)
    if (userRole !== "user") {
      // Change "admin" to the required role for the route
      logger.error("User does not have permission to access this resource.");
      throw new APIError(
        "You do not have permission to access this resource.",
        StatusCode.Forbidden
      );
    }

    // User is authorized, proceed to the next middleware or route handler
    next();
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
}

export { verifyUser };
