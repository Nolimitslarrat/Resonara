import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://resonarapublishers.com";

  // Public static routes
  const staticRoutes = [
    "",
    "/authors",
    "/reviewers",
    "/editors",
    "/journals",
    "/articles",
    "/guidelines",
    "/special-issues",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch dynamic journals
  const journals = await prisma.journal.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const journalRoutes = journals.map((journal) => ({
    url: `${baseUrl}/journals/${journal.slug}`,
    lastModified: journal.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Fetch published articles (assuming published status or similar)
  const articles = await prisma.manuscript.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, updatedAt: true },
  });

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.id}`,
    lastModified: article.updatedAt,
    changeFrequency: "never" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...journalRoutes, ...articleRoutes];
}
