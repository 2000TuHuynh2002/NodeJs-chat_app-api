import express from "express";

import { MessageController } from "../controllers/message.controller";

const messageRouter = express.Router();

messageRouter.get("/last-message/:id", MessageController.getLastMessage);
messageRouter.get("/get-message/:id", MessageController.getMessage);

messageRouter.post("/send-message", MessageController.sendMessage);
messageRouter.post("/send-image", MessageController.sendImage);

messageRouter.post("/delivared-message", MessageController.delivaredMessage);
messageRouter.post("/seen-message", MessageController.seenMessage);

export { messageRouter };
