import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SCHOOL_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolAdmin = await prisma.schoolAdmin.findUnique({
      where: { email: session.user.email },
    });

    if (!schoolAdmin) {
      return new NextResponse("School admin not found", { status: 404 });
    }

    const body = await req.json();
    const { name, email, idNumber, photo } = body;

    // Use email as initial password
    const hashedPassword = await hash(email, 10);

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        idNumber,
        photo,
        schoolId: schoolAdmin.schoolId,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("[TEACHERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SCHOOL_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolAdmin = await prisma.schoolAdmin.findUnique({
      where: { email: session.user.email },
    });

    if (!schoolAdmin) {
      return new NextResponse("School admin not found", { status: 404 });
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        schoolId: schoolAdmin.schoolId,
      },
      include: {
        departments: {
          include: {
            department: true,
          },
        },
        subjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("[TEACHERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}