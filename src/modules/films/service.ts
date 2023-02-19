import { google } from "googleapis";
import { JWT } from "google-auth-library";
import fetch from "node-fetch";
import {
  GOOGLE_SERVICE_ACCOUNT_JSON_PATH,
  GOOGLE_SHEET_ID,
  OMDB_URL,
} from "../../const";
import { Movie } from "../../models/movie.modal";

export const checkActorInList = (name: string, actors: Array<string>) => {
  let exists = false;
  for (let actor of actors) {
    if (actor.toLocaleLowerCase().includes(name.toLocaleLowerCase())) {
      exists = true;
      break;
    }
  }
  return exists;
};

export const getCommonActors = (
  actors1: Array<string>,
  actors2: Array<string>
) => {
  const commonValues: string[] = [];
  for (const value of actors1) {
    if (actors2.includes(value) && !commonValues.includes(value)) {
      commonValues.push(value);
    }
  }
  return commonValues.join(", ");
};

export const getMovieIds = (search: string, page: number) => {
  return new Promise<{ ids: Array<string>; pageCount: number }>(
    (resolve, reject) => {
      try {
        fetch(`${OMDB_URL}&s=${search}&page=${page}&type=movie`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((value) => {
            value
              .json()
              .then((data) => {
                resolve({
                  ids: data.Search.map((item: any) => {
                    return item.imdbID;
                  }),
                  pageCount: data.totalResults / 10 + 1,
                });
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      } catch (e) {
        console.log(e);
      }
    }
  );
};

export const getMovieDetail = (id: string, fetchActors: boolean = false) => {
  return new Promise<Movie>((resolve, reject) => {
    try {
      fetch(`${OMDB_URL}&i=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((value) => {
          value
            .json()
            .then((data) => {
              const movie = {
                Title: data.Title,
                Director: data.Director,
                Image: data.Poster,
                Year: data.Year,
              } as Movie;
              if (fetchActors) {
                movie.Actors = data.Actors.split(",").map((value: string) => {
                  return value.trim();
                });
              }
              resolve(movie);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (e) {
      console.log(e);
    }
  });
};

export const addRowToSheet = async (data: any) => {
  const auth = new JWT({
    keyFile: GOOGLE_SERVICE_ACCOUNT_JSON_PATH,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = `A1:A6`;
  const valueInputOption = "RAW";
  const requestBody = {
    values: [Object.values(data)],
  };
  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range,
    valueInputOption,
    requestBody,
  });
};
