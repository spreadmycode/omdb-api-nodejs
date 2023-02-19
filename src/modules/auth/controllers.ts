import { NextFunction, Request, Response } from "express";

export const getMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ message: "Hello World!" });
  } catch (error: any) {
    if (error.message) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.sendStatus(500);
  }
};
