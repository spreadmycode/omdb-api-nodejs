import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../const";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    if (token.includes("Bearer")) {
      const regex = /Bearer (.+)/i;
      token = req.headers["authorization"].match(regex)?.[1];
    } else {
      return res.status(403).json({
        message: "Authorization token is invalid or it is not provided.",
      });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded: any) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return res
            .status(401)
            .send({ message: "Unauthorized! Access Token was expired!" });
        } else {
          res.status(401).json({ message: "Unauthorized!" });
        }
      } else {
        req.headers.userId = decoded.userId;
        next();
      }
    });
  } catch (e) {
    console.log(e);

    return res.status(404).json({
      message: "User not found",
    });
  }
};
