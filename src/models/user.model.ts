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
    }
  }
});

class UserModel {
  static fetchAll() {
    return prisma.user.findMany();
  }

  static findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  
  static findByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  static findByUsernameWithPassword(username: string) {
    return prisma.user.findUnique({
      omit: {
        password: false,
      },
      where: {
        username: username,
      },
    });
  }

  static findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  static createUser(user: Prisma.userCreateInput) {
    return prisma.user.create({
      data: user,
    });
  }
}

export { UserModel };
