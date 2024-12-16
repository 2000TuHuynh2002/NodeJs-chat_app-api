import { Request, Response } from "express";

import { RoomModel as Room } from "../models/room.model";
import { UserModel as User } from "../models/user.model";

class RoomController {
  // [POST] /room/create
  static create = async (req: Request, res: Response) => {
    const { username01, username02 } = req.body;

    if (!username01 || !username02) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (username01 === username02) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user01 = await User.findByUsername(username01);
    const user02 = await User.findByUsername(username02);

    if (!user01 || !user02) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    const userId_list = [user01.id, user02.id].sort();
    console.log(userId_list);
    const check = await Room.checkRoomExists(userId_list);
    console.log(check);
    if (check) {
      return res.status(400).json({ 
        message: "Room already exists",
        roomId: check.id 
      });
    }

    const room = await Room.create({
      membersCount: 2,
      members: {
        connect: userId_list.map(id => ({ id }))
      },
    });

    res.status(201).json({ 
      messaage: "Room created successfully",
      room: room.id,
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
      roomId: room.id
    });
  };
}

export { RoomController };
