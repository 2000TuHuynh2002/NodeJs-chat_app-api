import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class MessageModel {
  static create = async (data: any) => {
    const message = await prisma.message.create({
      data: data,
    });

    await prisma.room.update({
      where: {
        id: data.roomId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  };

  static seen = (messageId: string) => {
    return prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        status: "SEEN",
      },
    });
  };

  static findByRoomId = (
    roomId: string,
    page: number = 1,
    size: number = 20
  ) => {
    const skip = (page - 1) * size;
    return prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: size,
    });
  };
}

export { MessageModel };
