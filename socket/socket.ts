import { Server, Socket } from "socket.io";

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

    socket.on("sendMessage", (receiverId, message) => {
      io.to(receiverId).emit("receiveMessage", message);
    });
  });
};
