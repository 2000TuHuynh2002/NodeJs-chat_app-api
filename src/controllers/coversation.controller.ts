import { Request, Response } from "express";

import { RoomModel as Room } from "../models/room.model";

class RoomController {
  // [POST] /room/create
  static create = async (req: Request, res: Response) => {};

  // [GET] /conversation/:id
  static get = async (req: Request, res: Response) => {};
}

export { RoomController };
