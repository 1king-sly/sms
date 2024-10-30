import { NextResponse } from "next/response";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SCHOOL_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolAdmin = await db.schoolAdmin.findUnique({
      where: { email: session.user.email },
    });

    if (!schoolAdmin) {
      return new NextResponse("School admin not found", { status: 404 });
    }

    const body = await req.json();
    const { name, email, admissionNo, streamId } = body;

    // Use admission number as initial password
    const hashedPassword = await hash(admissionNo, 10);

    const student = await db.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        admissionNo,
        schoolId: schoolAdmin.schoolId,
        streamId,
      },
      include: {
        stream: {
          include: {
            class: true,
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SCHOOL_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolAdmin = await db.schoolAdmin.findUnique({
      where: { email: session.user.email },
    });

    if (!schoolAdmin) {
      return new NextResponse("School admin not found", { status: 404 });
    }

    const students = await db.student.findMany({
      where: {
        schoolId: schoolAdmin.schoolId,
      },
      include: {
        stream: {
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}