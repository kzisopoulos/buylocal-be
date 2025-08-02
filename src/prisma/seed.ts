import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 10; i++) {
    await prisma.listing.create({
      data: {
        name: `Listing ${i}`,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
