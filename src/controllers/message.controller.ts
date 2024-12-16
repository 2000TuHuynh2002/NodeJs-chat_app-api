import { Request, Response } from "express";

import { MessageModel as message } from "../models/message.model";
import { RoomModel as Room } from "../models/room.model";

class MessageController {
  static getRecentMessages = async (req: Request, res: Response) => {
try {    
  const userId = req.body.userId;
    const getRecentMessages = await Room.getRecentMessages(userId);
    if (!getRecentMessages) {
      return res.status(404).json({ message: "No recent messages found" });
    }

    res.status(200).json({
      message: "Recent messages found",
      recentMessages: getRecentMessages,
    });
    console.log(getRecentMessages);}
    catch (err: any) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

  static getMessage = async (req: Request, res: Response) => {};

  static sendMessage = async (req: Request, res: Response) => {};

  static sendImage = async (req: Request, res: Response) => {};

  static delivaredMessage = async (req: Request, res: Response) => {};

  static seenMessage = async (req: Request, res: Response) => {};
}

export { MessageController };
