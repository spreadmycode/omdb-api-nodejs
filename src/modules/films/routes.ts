import express from "express";
import { auth } from "../../middleware";
import { getFilms, spreadSheet } from "./controllers";

export const filmsRouter = express.Router();

filmsRouter.route("/").post(auth, getFilms);
filmsRouter.route("/spreadsheet").post(auth, spreadSheet);
