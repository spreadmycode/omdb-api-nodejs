import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import { HttpStatusCode, OMDB_URL } from "../../const";
import { Movie } from "../../models/movie.modal";
import { SpreadSheet } from "../../models/spreadsheet.model";
import {
  addRowToSheet,
  checkActorInList,
  getCommonActors,
  getMovieDetail,
  getMovieIds,
} from "./service";

export const getFilmsBySearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { title } = req.body;
  if (!title) {
    title = "Fast %26 Furious";
  }
  try {
    let page = 1;
    let PAGE_SIZE = 100;
    let moviePromises: Array<Promise<Movie>> = [];
    do {
      const data = await getMovieIds(title, page);
      moviePromises.push(
        ...data.ids.map((id) => {
          return getMovieDetail(id);
        })
      );
      PAGE_SIZE = data.pageCount;
      page++;
    } while (page < PAGE_SIZE);

    const data = await Promise.all(moviePromises);
    return res.status(HttpStatusCode.SUCCESS).json({
      data,
    });
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
    // Fetch all detail from first movies list
    let page = 1;
    let PAGE_SIZE = 100;
    let moviePromises: Array<Promise<Movie>> = [];
    do {
      const data = await getMovieIds(title1, page);
      moviePromises.push(
        ...data.ids.map((id) => {
          return getMovieDetail(id, true);
        })
      );
      PAGE_SIZE = data.pageCount;
      page++;
    } while (page < PAGE_SIZE);
    const data1 = await Promise.all(moviePromises);

    // Fetch all actors from second movies list
    page = 1;
    PAGE_SIZE = 100;
    moviePromises = [];
    do {
      const data = await getMovieIds(title1, page);
      moviePromises.push(
        ...data.ids.map((id) => {
          return getMovieDetail(id, true);
        })
      );
      PAGE_SIZE = data.pageCount;
      page++;
    } while (page < PAGE_SIZE);
    const data2 = await Promise.all(moviePromises);

    const actors2: Array<string> = [];
    for (let movie of data2) {
      for (let actorName of movie.Actors) {
        if (!actors2.includes(actorName)) {
          actors2.push(actorName);
        }
      }
    }

    for (let movie of data1) {
      const spreadSheet: SpreadSheet = {
        Title: movie.Title,
        WasProducedBefore2015: Number(movie.Year) < 2015,
        WasActorIn: checkActorInList(actor, movie.Actors),
        CommonActors: getCommonActors(movie.Actors, actors2),
      };
      await addRowToSheet(spreadSheet);
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      data: data1,
    });
  } catch (error: any) {
    if (error.message) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: error.message,
      });
    }
    return res.sendStatus(HttpStatusCode.INTERNAL_SERVER);
  }
};
