import { Request, Response, NextFunction } from "express";

class ErrorController {
  // [GET] /{unknown_pages}
  static get404 = (req: Request, res: Response) => {
    res.status(404).json({ message: "URL Not found" });
  };
}

export { ErrorController };
