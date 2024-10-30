import { NextResponse } from "next/response";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Get all teachers and their assignment status for this subject
    const teachers = await db.teacher.findMany({
      where: {
        schoolId: schoolAdmin.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        subjects: {
          where: {
            subjectId: params.id,
          },
        },
      },
    });

    const formattedTeachers = teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      isAssigned: teacher.subjects.length > 0,
    }));

    return NextResponse.json(formattedTeachers);
  } catch (error) {
    console.error("[SUBJECT_TEACHERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SCHOOL_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { teacherIds } = body;

    // Remove all existing assignments
    await db.teacherSubject.deleteMany({
      where: {
        subjectId: params.id,
      },
    });

    // Create new assignments
    await db.teacherSubject.createMany({
      data: teacherIds.map((teacherId: string) => ({
        teacherId,
        subjectId: params.id,
      })),
    });

    return new NextResponse("Teachers assigned successfully", { status: 200 });
  } catch (error) {
    console.error("[SUBJECT_TEACHERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}