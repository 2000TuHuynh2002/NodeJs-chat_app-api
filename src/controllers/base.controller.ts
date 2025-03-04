import { Request, Response } from "express";

class BaseController {
  // [GET] /
  static home = (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to Tu-Huynh's homeground" });
  };

  // [GET] /up
  static up = (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" });
  };
}

export { BaseController };
