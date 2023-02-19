import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { GOOGLE_SERVICE_ACCOUNT_JSON_PATH, GOOGLE_SHEET_ID } from "../../const";

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
    if (
      actors2.includes(value.toLocaleLowerCase()) &&
      !commonValues.includes(value.toLocaleLowerCase())
    ) {
      commonValues.push(value);
    }
  }
  return commonValues.join(", ");
};

export const addRowToSheet = (data: any) => {
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
    values: [
      Object.keys(data).map((key) => {
        return `${key}: ${data[key]}`;
      }),
    ],
  };
  sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range,
    valueInputOption,
    requestBody,
  });
};
