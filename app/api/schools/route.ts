// Update the existing POST method in the schools API route

import prisma from "@/lib/db";
import { authOptions } from '@/utils/authOptions';
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      address,
      contact,
      initials,
      adminName,
      adminEmail,
    } = body;

    const hashedPassword = await hash(password, 10);
    const hashedAdminPassword = await hash(adminEmail, 10);

    // Create school with admin
    const school = await prisma.school.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        contact,
        initials,
        superAdminId: session.user.id,
        schoolAdmin: {
          create: {
            name: adminName,
            email: adminEmail,
            password: hashedAdminPassword,
          },
        },
      },
    });

    // Set up school with default data
    await fetch("/api/school/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId: school.id }),
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error("[SCHOOLS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}