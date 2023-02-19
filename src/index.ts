import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { services } from "./modules";

const app = express();

// Middlewares
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static("public"));

// Mount REST on /api
app.use("/api", services);
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("Hi there!");
});

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`Express app listening on localhost:${port}`)
);
