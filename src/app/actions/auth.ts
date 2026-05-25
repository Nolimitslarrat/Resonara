"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { Role } from "@prisma/client";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const affiliation = formData.get("affiliation") as string;
  const role = formData.get("role") as Role;
  const designation = formData.get("designation") as string;
  const orcid = formData.get("orcid") as string;
  const bio = formData.get("bio") as string;
  const expertiseRaw = formData.get("expertise") as string;
  const expertise = expertiseRaw
    ? expertiseRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!name || !email || !password || !role) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        affiliation: affiliation || null,
        role,
        designation: designation || null,
        orcid: orcid || null,
        bio: bio || null,
        expertise,
        isActive: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register user" };
  }
}
