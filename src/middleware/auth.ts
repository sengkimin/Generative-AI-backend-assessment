import { TokenPayload } from '../common/types/user';
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { RoleEnum, RoleType } from '../common';
import dotenv from "dotenv";
dotenv.config(); 

// Middleware to protect routes and check roles
const protectRoute = (roles: RoleType[] = [RoleEnum[2]]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    //  API Key
    const apiKeyRequest = req.headers["x-api-key"] as string;
    if (apiKeyRequest !== process.env.API_KEY) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    // Check if Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied, invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      req.user = decoded;

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next(); // Move to the next middleware or the route handler
    } catch (err) {
      console.error("JWT Error:", err);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default protectRoute;

