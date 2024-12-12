import express, { Express } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import { CorsMiddleware } from "./middlewares/cors.middleware";
import { socket } from "../socket/socket";
import { appRouter } from "./routes/app.route";

require("dotenv").config();

const app: Express = express();
const morgan = require("morgan");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(CorsMiddleware.coreOptions));
app.use(morgan("combined"));

appRouter(app);

const httpServer = createServer(app);
socket(httpServer);

httpServer.listen(port, () => {
  console.log(`[*] Server is running on port ${port}`);
});
