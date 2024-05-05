import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


type CustomRequest = Request & { token?: string };

// Express middleware to extract token from incoming requests
export const extractTokenMiddleware = async (
  req: Request,
  _res: Response,
  _next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract the token from the Authorization header
      const token = authHeader.split(" ")[1];

      // Now you can use the token for authentication or authorization
      // Validate the token, check permissions, etc.
      // Example: validateToken(token);
      const decodedToken = jwt.decode(token);
      // Pass the token to the next middleware or route handler if needed
      (req as CustomRequest).token = token;
      console.log(decodedToken);
      _next();
    }
  } catch (error: unknown) {
    throw error;
  }
};
