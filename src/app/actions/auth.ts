"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const affiliation = formData.get("affiliation") as string;
  const role = formData.get("role") as Role;

  if (!name || !email || !password || !role) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        affiliation,
        role,
        isActive: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register user" };
  }
}
