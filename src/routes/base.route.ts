import express from "express";

import { BaseController } from "../controllers/base.controller";

const baseRouter = express.Router();

baseRouter.get("/up", BaseController.up);
baseRouter.get("/", BaseController.home);

export { baseRouter };
