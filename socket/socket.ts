import { Server, Socket } from "socket.io";
import { UserModel } from "../src/models/user.model";
import { RoomModel } from "../src/models/room.model";

export const socket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("[*] Socket is connecting...");

    socket.on("userID", async (userId: string) => {
      console.log("[*] User ID is ", userId);
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("[*] User is disconnect... ");
    });

    socket.on("sendMessage", async (message) => {
      if (!message.recipientId) {
        console.error("Message Recipient information is missing");
        return;
      }

      const friend = await UserModel.findById(message.senderId);
      if (!friend) {
        console.error(`User with ID ${message.senderId} not found`);
        return;
      }

      const userId_list = [message.senderId, message.recipientId].sort();
      const room = await RoomModel.checkRoomExists(userId_list);
      console.log("Room: ", room?.id);
      message.roomId = room?.id;
      message.status = "SENT";
      message.createdAt = new Date().toISOString();
      message.updatedAt = new Date().toISOString();
      message.memberId = userId_list;
      message.sender = {
        id: friend.id,
        email: friend.email,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
      };
      io.to(message.recipientId).emit("receiveMessage", message);
      console.log("[*] Message sent successfully");
    });
  });
};
