export enum HttpStatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
export const API_KEY = process.env.API_KEY;
export const OMDB_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
export const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
export const GOOGLE_SERVICE_ACCOUNT_JSON_PATH =
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH;
