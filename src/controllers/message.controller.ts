import { Request, Response } from "express";

import { MessageModel as Message } from "../models/message.model";
import { RoomModel as Room } from "../models/room.model";

class MessageController {
  static getRecentMessages = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const recentRoom = await Room.getRecentRoom(userId);
      if (!recentRoom) {
        return res.status(404).json({ message: "No recent messages found" });
      }

      res.status(200).json({
        message: "Recent messages found",
        data: recentRoom,
      });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

  static getMessagesByRoomId = async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const size = req.query.size ? parseInt(req.query.size as string, 10) : 20;
      
      if (!roomId) {
        return res.status(400).json({ message: "Room ID is required" });
      }

      const messages = await Message.findByRoomId(roomId, page, size);
      if (!messages) {
        return res.status(404).json({ message: "No messages found", data: [] });
      }

      res.status(200).json({ message: "Messages found", data: messages });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

  static sendMessage = async (req: Request, res: Response) => {
    try {
      const { senderId, recipientId, content, roomId } = req.body;

      const data = {
        senderId: senderId,
        recipientId: recipientId,
        content: content,
        roomId: roomId,
      };

      const sendMessage = await Message.create(data);
      if (!sendMessage) {
        return res.status(400).json({ message: "Message not sent" });
      }

      res.status(200).json({ message: "Message sent", sendMessage });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  static sendImage = async (req: Request, res: Response) => {};

  static deliveredMessage = async (req: Request, res: Response) => {};

  static seenMessage = async (req: Request, res: Response) => {};
}

export { MessageController };
