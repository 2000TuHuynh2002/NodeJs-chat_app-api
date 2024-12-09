import { Server, Socket } from "socket.io";

export const socket = (server: any) => {
  const io = new Server(server)
  
  type User = {
    userId: string | null;
    socketId: string | null;
    userInfo: any;
  };
  
  let users: User[] = [];
  
  const addUser = (userId: string, socketId: string, userInfo: any) => {
    const checkUser = users.some((user) => user.userId === userId);
    if (!checkUser) {
      users.push({ userId, socketId, userInfo: null });
    }
  };
  
  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const findFriend = (userId: string) => {
    return users.find((user) => user.userId === userId);
  };
  
  const logoutUser = (userId: string) => {
    users = users.filter((user) => user.userId !== userId);
  };
  
  io.on("connection", (socket: Socket) => {
    console.log("Socket is connecting...");
    socket.on("addUser", (userId: string, userInfo: any) => {
      addUser(userId, socket.id, userInfo);
      io.emit("getUsers", users);
  
      const us = users.filter((user) => user.userId !== userId);
      const con = "new_user_add";
  
      for (var i = 0; i < us.length; i++) {
        socket.to(us[i].socketId || "").emit("new_user_add", con);
      }
    });
  
    socket.on("sendMessage", (data: any) => {
      const user = findFriend(data.reseverId);
  
      if (user !== undefined) {
        socket.to(user.socketId || "").emit("getMessage", data);
      }
    });
  
    socket.on("messageSeen", (msg: any) => {
      const user = findFriend(msg.senderId);
      if (user !== undefined) {
        socket.to(user.socketId || "").emit("msgSeenResponse", msg);
      }
    });
  
    socket.on("delivaredMessage", (msg: any) => {
      const user = findFriend(msg.senderId);
      if (user !== undefined) {
        socket.to(user.socketId || "").emit("msgDelivaredResponse", msg);
      }
    });
    socket.on("seen", (data: any) => {
      const user = findFriend(data.senderId);
      if (user !== undefined) {
        socket.to(user.socketId || "").emit("seenSuccess", data);
      }
    });
  
    socket.on("typingMessage", (data: any) => {
      const user = findFriend(data.reseverId);
      if (user !== undefined) {
        socket.to(user.socketId || "").emit("typingMessageGet", {
          senderId: data.senderId,
          reseverId: data.reseverId,
          msg: data.msg,
        });
      }
    });
  
    socket.on("logout", (userId: string) => {
      logoutUser(userId);
    });
  
    socket.on("disconnect", () => {
      console.log("user is disconnect... ");
      removeUser(socket.id);
      io.emit("getUser", users);
    });
  });
}
