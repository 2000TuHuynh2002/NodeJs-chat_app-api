import { Request, Response } from "express";

import { MessageModel as Message } from "../models/message.model";
import { MessageModel as Message } from "../models/message.model";
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

  static sendMessage = async (req: Request, res: Response) => {
    try {
      const { senderId, recipientId, message, roomId } = req.body;

      const data = {
        senderId: senderId,
        recipientId: recipientId,
        content: message,
        roomId: roomId,
      }

      const sendMessage = await Message.create(data);
      if (!sendMessage) {
        return res.status(400).json({ message: "Message not sent" });
      }

      res.status(200).json({ message: "Message sent", sendMessage });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

  static sendImage = async (req: Request, res: Response) => {};

  static deliveredMessage = async (req: Request, res: Response) => {};

  static seenMessage = async (req: Request, res: Response) => {};
}

export { MessageController };
