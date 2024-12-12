import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class MessageModel {
  static getLastMessage = (conversationId: string) => {
    return prisma.message.findMany({
      where: {
        id: conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });
  };

  static create = (message: Prisma.messageCreateInput) => {
    return prisma.message.create({
      data: message,
    });
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
}

export { MessageModel };
