import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN, HttpStatusCode } from "../const";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    if (token.includes("Bearer")) {
      const regex = /Bearer (.+)/i;
      token = req.headers["authorization"].match(regex)?.[1];
    } else {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Authorization token is invalid or it is not provided.",
      });
    }

    if (token == ACCESS_TOKEN) {
      next();
    } else {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Authorization token is invalid or it is not provided.",
      });
    }
  } catch (e) {
    console.log(e);

    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      message: "Internal server error.",
    });
  }
};
