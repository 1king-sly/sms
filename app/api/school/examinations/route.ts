import { NextResponse } from "next/server";
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
    const { name, type, term, startDate, endDate, academicYear } = body;

    const exam = await prisma.exam.create({
      data: {
        name,
        type,
        term,
        academicYear,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schoolId: schoolAdmin.schoolId,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("[EXAMINATIONS_POST]", error);
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

    const exams = await prisma.exam.findMany({
      where: {
        schoolId: schoolAdmin.schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("[EXAMINATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}