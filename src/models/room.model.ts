import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class RoomModel {
  static async create(data: Prisma.roomCreateInput) {
    return prisma.room.create({ data });
  }

  static async findById(id: string) {
    return prisma.room.findUnique({
      where: {
        room_id: id,
      },
    });
  }
}

export { RoomModel };
