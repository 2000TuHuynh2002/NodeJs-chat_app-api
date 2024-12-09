require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserModel {
  static fetchAll() {
    return prisma.user.findMany();
  }

  static findById(id: Number) {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  
  static findByUsername(username: String) {
    return prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  static findByEmail(email: String) {
    return prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  static createUser(user: Object) {
    return prisma.user.create({
      data: user,
    });
  }
}

module.exports = UserModel;
