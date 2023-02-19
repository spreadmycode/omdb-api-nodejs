import express from "express";

import { filmsRouter } from "./films";

export const services = express.Router();

services.use("/films", filmsRouter);
