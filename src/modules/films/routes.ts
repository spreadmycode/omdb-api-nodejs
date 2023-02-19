import express from "express";
import { auth } from "../../middleware";
import { getFilmsByTitle, spreadSheet } from "./controllers";

export const filmsRouter = express.Router();

filmsRouter.route("/").post(auth, getFilmsByTitle);
filmsRouter.route("/spreadsheet").post(auth, spreadSheet);
