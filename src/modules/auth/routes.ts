import express from "express";
import { auth } from "../../middleware";
import { getMessage } from "./controllers";

export const authRouter = express.Router();

authRouter.route("/message").get(auth, getMessage);
