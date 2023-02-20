import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../const";
import { Movie } from "../../models/movie.modal";
import { SpreadSheet } from "../../models/spreadsheet.model";
import {
  addRowToSheet,
  checkActorInList,
  getCommonActors,
  getMovieDetail,
  getMovieIds,
} from "./service";

const searchMoviePromises = async (
  search: string,
  withActors: boolean = false
) => {
  let page = 1;
  let PAGE_SIZE = 100;
  let moviePromises: Array<Promise<Movie>> = [];

  // Make promise array for fetching each movie detail
  do {
    const data = await getMovieIds(search, page);
    moviePromises.push(
      ...data.ids.map((id) => {
        return getMovieDetail(id, withActors);
      })
    );
    PAGE_SIZE = data.pageCount;
    page++;
  } while (page < PAGE_SIZE);

  return moviePromises;
};

export const getFilms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { title } = req.body;
  if (!title) {
    title = "Fast %26 Furious";
  }

  try {
    const moviePromises = await searchMoviePromises(title);
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
    let moviePromises = await searchMoviePromises(title1, true);
    const data1 = await Promise.all(moviePromises);

    // Fetch all actors from second movies list
    moviePromises = await searchMoviePromises(title2, true);
    const data2 = await Promise.all(moviePromises);
    const actors2: Array<string> = [];
    for (let movie of data2) {
      for (let actorName of movie.Actors) {
        if (!actors2.includes(actorName)) {
          actors2.push(actorName);
        }
      }
    }

    // Get all actors' name list
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
