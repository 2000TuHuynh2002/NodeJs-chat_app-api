import express from "express";

import { MessageController } from "../controllers/message.controller";

const messageRouter = express.Router();

messageRouter.get("/recent", MessageController.getRecentMessages);
messageRouter.get("/get-messages-by-room-id/:roomId", MessageController.getMessagesByRoomId);

messageRouter.post("/send-message", MessageController.sendMessage);
messageRouter.post("/send-image", MessageController.sendImage);

messageRouter.post("/delivered-message", MessageController.deliveredMessage);
messageRouter.post("/seen-message", MessageController.seenMessage);

export { messageRouter };
 