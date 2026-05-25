import { prisma } from "c:/Users/Speci/OneDrive/Desktop/nexschoolar/src/lib/prisma";

async function run() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, name: true }
  });
  console.log("Users in DB:", JSON.stringify(users, null, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
