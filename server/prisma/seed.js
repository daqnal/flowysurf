import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const creatorId = process.env.CREATOR_USER_ID;

// MAY NOT WORK
// Must match the Prisma schema

const charts = [
  {
    name: "2110 Project",
    description: "idk lol",
    ownerId: creatorId,
  },
  {
    name: "2050 Project",
    description: "math",
    ownerId: creatorId,
  },
  {
    name: "binga bunga",
    description: "gunga",
    ownerId: creatorId,
  },
];

const main = async () => {
  console.log("Seeding charts...");

  for (const chart of charts) {
    await prisma.chart.create({
      data: chart,
    });
    console.log("Created chart: " + chart);
  }

  console.log("Seeding completed.");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
