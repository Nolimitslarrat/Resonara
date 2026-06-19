import "dotenv/config";
import { prisma } from "../../../src/lib/prisma";

async function main() {
  console.log("Starting test-assign query...");
  const reviewer = await prisma.user.findFirst({
    where: { role: "REVIEWER" }
  });
  const editor = await prisma.user.findFirst({
    where: { role: "EDITOR" }
  });
  const manuscript = await prisma.manuscript.findFirst();

  if (!reviewer || !editor || !manuscript) {
    console.error("Missing data in database. Reviewer:", reviewer, "Editor:", editor, "Manuscript:", manuscript);
    return;
  }

  console.log(`Using reviewer ID: ${reviewer.id}, Editor ID: ${editor.id}, Manuscript ID: ${manuscript.id}`);

  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    console.log("Step 1: Creating ReviewerAssignment...");
    const assignment = await prisma.reviewerAssignment.create({
      data: {
        manuscriptId: manuscript.id,
        reviewerId: reviewer.id,
        dueDate,
        status: "PENDING"
      }
    });
    console.log("Created assignment:", assignment);

    console.log("Step 2: Updating Manuscript...");
    const updatedManuscript = await prisma.manuscript.update({
      where: { id: manuscript.id },
      data: {
        status: "UNDER_REVIEW",
        activityLogs: {
          create: {
            userId: editor.id,
            action: "REVIEWER_ASSIGNED",
            entity: "MANUSCRIPT",
            metadata: { reviewerId: reviewer.id }
          }
        }
      }
    });
    console.log("Updated manuscript successfully.");

    console.log("Step 3: Creating notification...");
    const notification = await prisma.notification.create({
      data: {
        userId: reviewer.id,
        type: "REVIEW_INVITED",
        title: "New Review Invitation",
        message: `You have been invited to review a manuscript. Please accept or decline the invitation.`,
        link: `/dashboard/reviewer`
      }
    });
    console.log("Created notification:", notification);

  } catch (error) {
    console.error("ERROR encountered during assignment operations:", error);
  }
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
