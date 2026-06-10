"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { hash } from "bcryptjs";

const ASSIGNABLE_ROLES: Role[] = ["SUPER_ADMIN", "AUTHOR", "EDITOR", "REVIEWER"];

export async function inviteUser(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as Role;
  const password = formData.get("password") as string;
  const affiliation = formData.get("affiliation") as string;
  const designation = formData.get("designation") as string;
  const institutionalProfile = formData.get("institutionalProfile") as string;
  const apidProfile = formData.get("apidProfile") as string;

  if (!name || !email || !role || !password) {
    return { success: false, error: "Name, email, role, and password are required." };
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    return { success: false, error: "Invalid role selected." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  if (session.user.role !== "SUPER_ADMIN" && role === "SUPER_ADMIN") {
    return { success: false, error: "Only Super Admins can create other Super Admins." };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        affiliation: affiliation || null,
        designation: designation || null,
        institutionalProfile: institutionalProfile || null,
        apidProfile: apidProfile || null,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/journals");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user." };
  }
}

export async function updateUserRole(userId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const role = formData.get("role") as Role;

  if (!role) {
    return { success: false, error: "Role is required." };
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    return { success: false, error: "Invalid role selected." };
  }

  if (userId === session.user.id) {
    return { success: false, error: "You cannot change your own role." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update user role." };
  }
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const affiliation = formData.get("affiliation") as string;
  const bio = formData.get("bio") as string;
  const orcid = formData.get("orcid") as string;
  const designation = formData.get("designation") as string;
  const institutionalProfile = formData.get("institutionalProfile") as string;
  const apidProfile = formData.get("apidProfile") as string;

  if (!name) {
    return { success: false, error: "Name is required." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        affiliation: affiliation || null,
        bio: bio || null,
        orcid: orcid || null,
        designation: designation || null,
        institutionalProfile: institutionalProfile || null,
        apidProfile: apidProfile || null,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile settings:", error);
    return { success: false, error: "Failed to update profile." };
  }
}

export async function updateUserAdmin(userId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const affiliation = formData.get("affiliation") as string;
  const bio = formData.get("bio") as string;
  const orcid = formData.get("orcid") as string;
  const designation = formData.get("designation") as string;
  const institutionalProfile = formData.get("institutionalProfile") as string;
  const apidProfile = formData.get("apidProfile") as string;

  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        affiliation: affiliation || null,
        bio: bio || null,
        orcid: orcid || null,
        designation: designation || null,
        institutionalProfile: institutionalProfile || null,
        apidProfile: apidProfile || null,
      },
    });

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/journals");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user by admin:", error);
    return { success: false, error: "Failed to update user details." };
  }
}

export async function softDeleteUser(userId: string) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  if (userId === session.user.id) {
    return { success: false, error: "You cannot delete your own account." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to soft delete user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

export async function adminResetPassword(userId: string, newPassword?: string) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  try {
    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, newPassword };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error: "Failed to reset password." };
  }
}

import { compare } from "bcryptjs";

export async function changeUserPassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { success: false, error: "Current and new password are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return { success: false, error: "User not found or has no password." };
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Incorrect current password." };
    }

    const hashedPassword = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { success: false, error: "Failed to change password." };
  }
}
