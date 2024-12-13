import { Request, Response } from "express";
const { createHash } = require("crypto");

import { RoomModel as Room } from "../models/room.model";
import { UserModel as User } from "../models/user.model";

class RoomController {
  // [POST] /room/create
  static create = async (req: Request, res: Response) => {
    const { username01, username02 } = req.body;
    const user01 = await User.findByUsername(username01);
    const user02 = await User.findByUsername(username02);

    if (!user01 || !user02) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    const user_id_list = [user01.id, user02.id].sort();
    
    const room_id = createHash("sha256")
      .update(user_id_list.join(""))
      .digest("hex");

    await Room.create({
      room_id: room_id,
      membersCount: 2,
      members: {
        connect: user_id_list.map((id) => ({ id })),
      },
    });

    res.status(201).json({ 
      messaage: "Room created successfully",
      room: room_id 
    });
  };

  // [GET] /room/:id
  static getById = async (req: Request, res: Response) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ 
      messaage: "Room found",
      room_id: room.room_id 
    });
  };
}

export { RoomController };
