import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import { HttpStatusCode, OMDB_URL } from "../../const";
import { SpreadSheet } from "../../models/spreadsheet.model";
import { addRowToSheet, checkActorInList, getCommonActors } from "./service";

export const getFilmsByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { title, page } = req.body;
  if (!title) {
    title = "Fast %26 Furious";
  }
  try {
    const response = await fetch(`${OMDB_URL}&s=${title}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(HttpStatusCode.SUCCESS).json({
        data,
      });
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Failed to fetch films.",
      });
    }
  } catch (error: any) {
    if (error.message) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: error.message,
      });
    }
    return res.sendStatus(HttpStatusCode.INTERNAL_SERVER);
  }
};

export const spreadSheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { title1, title2, actor } = req.body;
  if (!title1) {
    title1 = "Pirates of the Caribbean";
  }
  if (!title2) {
    title2 = "Star-Wars";
  }
  if (!actor) {
    actor = "Paul Walker";
  }
  try {
    const response1 = await fetch(`${OMDB_URL}&t=${title1}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response2 = await fetch(`${OMDB_URL}&t=${title2}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response1.ok && response2.ok) {
      const data1 = await response1.json();
      const data2 = await response2.json();

      const wasProducedBefore2015 = Number(data1.Year) < 2015;
      const actors1 = data1.Actors.split(",").map((value: string) => {
        return value.trim();
      });
      const actors2 = data2.Actors.split(",").map((value: string) => {
        return value.trim();
      });
      const wasPaulInActors = checkActorInList(actor, actors1);
      const commonActors = getCommonActors(actors1, actors2);

      const spreadSheetData: SpreadSheet = {
        wasProducedBefore2015,
        wasPaulInActors,
        commonActors,
      };

      addRowToSheet(spreadSheetData);

      return res.status(HttpStatusCode.SUCCESS).json({
        data: spreadSheetData,
      });
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Failed to fetch films.",
      });
    }
  } catch (error: any) {
    if (error.message) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: error.message,
      });
    }
    return res.sendStatus(HttpStatusCode.INTERNAL_SERVER);
  }
};
