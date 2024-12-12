import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

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
