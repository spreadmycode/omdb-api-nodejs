import express from "express";
import { auth } from "../../middleware";
import { getFilmsBySearch, spreadSheet } from "./controllers";

export const filmsRouter = express.Router();

filmsRouter.route("/").post(auth, getFilmsBySearch);
filmsRouter.route("/spreadsheet").post(auth, spreadSheet);
