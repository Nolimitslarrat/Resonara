import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "admin@nexschoolar.com";
    const plainPassword = "password123";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists, update password and role just in case
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });
      return NextResponse.json({ message: "Admin user already exists. Password and role updated successfully." });
    }

    // Create the admin user
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    return NextResponse.json({ 
      message: "Admin user created successfully!",
      user: {
        email: admin.email,
        role: admin.role,
      }
    });

  } catch (error: any) {
    console.error("Error seeding admin:", error);
    return NextResponse.json({ error: "Failed to seed admin", details: error.message }, { status: 500 });
  }
}
