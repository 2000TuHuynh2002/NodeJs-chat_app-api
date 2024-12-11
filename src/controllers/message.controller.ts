import { Request, Response, NextFunction } from "express";

import { MessageModel as message } from "../models/message.model";

class MessageController {
  static getLastMessage = async (req: Request, res: Response) => {
    try {
      const converastionId = req.params.id;
      const lastMessage = await message.getLastMessage(converastionId);
      res.status(200).json(lastMessage);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  static getMessage = async (req: Request, res: Response) => {};

  static sendMessage = async (req: Request, res: Response) => {};

  static sendImage = async (req: Request, res: Response) => {};

  static delivaredMessage = async (req: Request, res: Response) => {};

  static seenMessage = async (req: Request, res: Response) => {};
}

export { MessageController };
