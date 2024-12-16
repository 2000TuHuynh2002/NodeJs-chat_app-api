import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  // Read the JSON data from the file
  const seedData = JSON.parse(fs.readFileSync("./src/seeds/user.json", "utf8"));

  await prisma.user.deleteMany();
  seedData.forEach(async (user: any) => {
    await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        
        firstName: user.firstName,
        lastName: user.lastName,

        roles: user.roles,
        blockedBy: user.blockedBy,
        
        dayOfBirth: user.dayOfBirth,
        phoneNumber: user.phoneNumber,
      },
    });
  });
  console.log("[*] Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
