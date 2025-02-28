import express from "express";
import bootstrap from "./src/app.controller.js";
import "./src/utils/cron/cron.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;

bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
