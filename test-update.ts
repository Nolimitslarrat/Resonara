import { prisma } from "./src/lib/prisma";

async function main() {
  const id = "cmozbs2r5000an0i2ksukk6g9";
  
  try {
    const journal = await prisma.journal.update({
      where: { id },
      data: {
        title: "Journal of Artificial Intelligence Research",
        issnPrint: "1234-5678",
        issnOnline: "8765-4321",
        abbreviation: "JAIR",
        frequency: "2 Issue Per Year",
        reviewType: "Peer-reviewed Journal",
        isActive: true,
      },
    });
    console.log("Success:", journal.id);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main().finally(() => prisma.$disconnect());
