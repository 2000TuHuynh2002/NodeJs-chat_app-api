import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class MessageModel {
  static create = (data: any) => {
    return prisma.message.create({
      data: data,
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
