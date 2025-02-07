import express from "express";

import { RoomController } from "../controllers/room.controller";

const roomRouter = express.Router();

roomRouter.get("/:id", RoomController.getById);
roomRouter.post("/create", RoomController.create);

export { roomRouter };
