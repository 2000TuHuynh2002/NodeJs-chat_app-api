require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User {
  static fetchAll() {
    return prisma.users.findMany();
  }

  static findByUsername(username: String) {
    return prisma.users.findUnique({
      where: {
        username: username,
      },
    });
  }

  static findByEmail(email: String) {
    return prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }

  static createUser(user: Object) {
    return prisma.users.create({
      data: user,
    });
  }
}

module.exports = User;
