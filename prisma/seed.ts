import "dotenv/config";
import { Role, ManuscriptStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding NexScholar database...");

  // Hash password
  const password = await bcrypt.hash("password123", 12);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: "admin@nexschoolar.com" },
    update: {},
    create: {
      name: "Dr. Admin User",
      email: "admin@nexschoolar.com",
      password,
      role: "SUPER_ADMIN",
      affiliation: "NexScholar Platform",
      bio: "Platform super administrator.",
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@nexschoolar.com" },
    update: {},
    create: {
      name: "Dr. Rebecca Osei",
      email: "editor@nexschoolar.com",
      password,
      role: "MANAGING_EDITOR",
      affiliation: "University of Science",
      orcid: "0000-0001-1234-5678",
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "reviewer@nexschoolar.com" },
    update: {},
    create: {
      name: "Prof. James Chen",
      email: "reviewer@nexschoolar.com",
      password,
      role: "REVIEWER",
      affiliation: "MIT",
      orcid: "0000-0002-5678-9012",
      expertise: ["Machine Learning", "Computer Vision", "NLP"],
    },
  });

  const author = await prisma.user.upsert({
    where: { email: "author@nexschoolar.com" },
    update: {},
    create: {
      name: "Dr. Amara Nwosu",
      email: "author@nexschoolar.com",
      password,
      role: "AUTHOR",
      affiliation: "University of Lagos",
      orcid: "0000-0003-9012-3456",
    },
  });

  const production = await prisma.user.upsert({
    where: { email: "production@nexschoolar.com" },
    update: {},
    create: {
      name: "Sarah Mitchell",
      email: "production@nexschoolar.com",
      password,
      role: "PRODUCTION",
      affiliation: "NexScholar Editorial",
    },
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "computer-science" }, update: {}, create: { name: "Computer Science", slug: "computer-science", description: "AI, ML, algorithms, systems" } }),
    prisma.category.upsert({ where: { slug: "life-sciences" }, update: {}, create: { name: "Life Sciences", slug: "life-sciences", description: "Biology, medicine, genetics" } }),
    prisma.category.upsert({ where: { slug: "physics" }, update: {}, create: { name: "Physics", slug: "physics", description: "Quantum, astrophysics, condensed matter" } }),
    prisma.category.upsert({ where: { slug: "social-sciences" }, update: {}, create: { name: "Social Sciences", slug: "social-sciences", description: "Psychology, economics, sociology" } }),
    prisma.category.upsert({ where: { slug: "engineering" }, update: {}, create: { name: "Engineering", slug: "engineering", description: "Civil, mechanical, electrical, chemical" } }),
  ]);

  // Journals
  const journal1 = await prisma.journal.upsert({
    where: { slug: "journal-of-artificial-intelligence" },
    update: {},
    create: {
      title: "Journal of Artificial Intelligence Research",
      slug: "journal-of-artificial-intelligence",
      issnPrint: "1234-5678",
      issnOnline: "8765-4321",
      description: "Leading peer-reviewed journal covering all aspects of artificial intelligence and machine learning research.",
      scope: "Machine learning, deep learning, NLP, computer vision, robotics, AI ethics, and related areas.",
      isActive: true,
      reviewType: "DOUBLE_BLIND",
      editorInChiefId: editor.id,
      categories: { connect: [{ id: categories[0].id }] },
    },
  });

  const journal2 = await prisma.journal.upsert({
    where: { slug: "biomedical-research-quarterly" },
    update: {},
    create: {
      title: "Biomedical Research Quarterly",
      slug: "biomedical-research-quarterly",
      issnPrint: "2345-6789",
      issnOnline: "9876-5432",
      description: "International journal of biomedical research, clinical studies, and translational medicine.",
      scope: "Molecular biology, genetics, clinical trials, pharmacology, and medical technology.",
      isActive: true,
      reviewType: "DOUBLE_BLIND",
      editorInChiefId: editor.id,
      categories: { connect: [{ id: categories[1].id }] },
    },
  });

  // Manuscripts with various statuses
  const manuscriptData = [
    { title: "Transformer Architectures for Low-Resource NLP Tasks", status: "UNDER_REVIEW" as ManuscriptStatus, journalId: journal1.id },
    { title: "A Novel Approach to Federated Learning in Healthcare", status: "SUBMITTED" as ManuscriptStatus, journalId: journal1.id },
    { title: "CRISPR-Cas9 Gene Editing in Rare Genetic Disorders", status: "ACCEPTED" as ManuscriptStatus, journalId: journal2.id },
    { title: "Deep Reinforcement Learning for Autonomous Navigation", status: "MINOR_REVISION" as ManuscriptStatus, journalId: journal1.id },
    { title: "Quantum Computing Applications in Drug Discovery", status: "PUBLISHED" as ManuscriptStatus, journalId: journal2.id },
  ];

  for (const data of manuscriptData) {
    await prisma.manuscript.create({
      data: {
        title: data.title,
        abstract: `This paper presents a comprehensive study on ${data.title.toLowerCase()}. The research methodology involves systematic analysis and experimental validation using state-of-the-art techniques. Our results demonstrate significant improvements over existing baseline methods.`,
        keywords: ["research", "methodology", "analysis", "experimental"],
        status: data.status,
        authorId: author.id,
        journalId: data.journalId,
        categoryId: categories[0].id,
        submittedAt: new Date(),
      },
    }).catch(() => {}); // Skip if already exists
  }

  // Activity logs
  await prisma.activityLog.createMany({
    data: [
      { userId: author.id, action: "Submitted", entity: "Manuscript", metadata: { title: "Transformer Architectures for Low-Resource NLP Tasks" } },
      { userId: editor.id, action: "Assigned reviewer", entity: "ReviewerAssignment", metadata: { reviewer: "Prof. James Chen" } },
      { userId: reviewer.id, action: "Accepted review", entity: "ReviewerAssignment", metadata: {} },
      { userId: admin.id, action: "Created", entity: "Journal", metadata: { title: "Journal of Artificial Intelligence Research" } },
      { userId: editor.id, action: "Made decision", entity: "EditorialDecision", metadata: { decision: "ACCEPTED" } },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed complete!");
  console.log("\n📧 Demo accounts (password: password123):");
  console.log("  admin@nexschoolar.com     → Super Admin");
  console.log("  editor@nexschoolar.com    → Managing Editor");
  console.log("  reviewer@nexschoolar.com  → Reviewer");
  console.log("  author@nexschoolar.com    → Author");
  console.log("  production@nexschoolar.com → Production");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
