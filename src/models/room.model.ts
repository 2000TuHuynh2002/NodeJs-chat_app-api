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
          every: { id: { in: memberIdList } },
        },
      },
      include: {
        _count: {
          select: {
            messages: true
          }
        }
      }
    });
  }

  static async getRecentRoom(userId: string, page: number = 1) {
    return prisma.room
      .findMany({
        where: {
          members: {
            some: { id: userId },
          },
          messages: {
            some: {} // This ensures rooms have at least one message
          }
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          messages: {
            take: 30,
            orderBy: {
              createdAt: "desc",
            },
          },
          members: {
            where: {
              id: {
                not: userId,
              },
            },
          },
        },
      })
      .then((rooms) => {
        return rooms.map((room: any) => {
          room.friend = room.members[0];
          delete room.members;
          return room;
        });
      });
  }
}

export { RoomModel };
