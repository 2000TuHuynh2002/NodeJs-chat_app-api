import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      blockedBy: true,

      dayOfBirth: true,
      phoneNumber: true,

      roomsId: true,

      createdAt: true,
      updatedAt: true,
    },
  },
});

class RoomModel {
  static async create(data: any) {
    return prisma.room.create({ data });
  }

  static async findById(id: string) {
    return prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: {
          take: 30,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  static async checkRoomExists(memberIdList: string[]) {
    return prisma.room.findFirst({
      where: {
        members: {
          every: { id: { in: memberIdList } }
        }
      },
    });
  }

  static async getRecentMessages(userId: string, page: number = 1) {
    const pageSize = 20;
    return prisma.room.findMany({
      where: {
        members: {
          some: { id: userId },
        },
      },
      include: {
        messages: {
          take: 30,
          orderBy: {
            createdAt: "desc",
          },
        },
        members: {
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });
  }
}

export { RoomModel };
