import { Request, Response, NextFunction } from "express";

import { MessageModel as message } from "../models/message.model";

class MessageController {
  static getLastMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const converastionId = req.params.id;
      const lastMessage = await message.getLastMessage(converastionId);
      res.status(200).json(lastMessage);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  static getMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  static sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  static sendImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  static delivaredMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  static seenMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};
}

export { MessageController };
