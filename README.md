# OMDB API Backend

## Prerequisite

- Install packages

```
$ npm install
```

- Prepare `.env` (copy template and fill in the follwing values)

```
NODE_ENV=<development | production>
PORT=<Port number | 8000>

API_KEY=<Your OMDB API Key>
ACCESS_TOKEN=<Any secret string>

GOOGLE_SHEET_ID=<Google Sheet Id>
GOOGLE_SERVICE_ACCOUNT_JSON_PATH=<Google Service Account JSON file path (local)>
```

- Run development mode

```
$ npm run dev
```

## Security

To add a simple security to prevent Anonymous access to this API, implemented `ACCESS_TOKEN` authorization.
This token is secret key which will be embeded in request header as `Bearer <ACCESS_TOKEN>` format.
For any access without this authorization token, it will be rejected.

## API Overview

### 1. `/api/films`

Method: `POST`

Payload:

```
{
    title: string, // Search param default: "Fast & Furious"
}
```

Response:

```
{
    data: [
        {
            Image: string;
            Title: string;
            Year: string;
            Director: string;
        }
    ]
}
```

Overview:

```
Make the list of "Fast & Furious" or searched movies in JSON format and response all data.
```

### 2. `/api/films/spreadsheet`

Method: `POST`

Payload:

```
{
    title1: string, // Search first films: default "Pirates of the Caribbean"
    title2: string, // Search second films: default "Star-Wars"
    actor: string,  // Find actor in title1 films: default "Paul Walker"
}
```

Response:

```
{
    data: [
        {
            Image: string;
            Title: string;
            Year: string;
            Director: string;
            Actors: Array<string>;
        }
    ]
}
```

Google Sheet Format:

```
Title: string
Produced before 2015: boolean
Paul in actors: boolean
Common Actors: string
```

Overview:

```
Retrieve the list of searched movies.
Store the info of the specific movie in an online Google Spread Sheet.
```

Please check this [Sheet](https://docs.google.com/spreadsheets/d/1lB_EqckkzdEfyLK6osJwstFv2L63aDziXIBxnlaKx-U/).
