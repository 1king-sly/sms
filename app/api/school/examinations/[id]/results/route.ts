import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "TEACHER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subjectId, results } = body;

    // Verify teacher is assigned to this subject
    const teacherSubject = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: session.user.id,
        subjectId,
      },
    });

    if (!teacherSubject) {
      return new NextResponse("Teacher not assigned to this subject", { status: 403 });
    }

    // Create exam results
    const examResults = await Promise.all(
      results.map(async (result: { studentId: string; marks: number }) => {
        return prisma.examResult.create({
          data: {
            examId: params.id,
            studentId: result.studentId,
            subjectId,
            marks: result.marks,
            grade: calculateGrade(result.marks),
            remarks: generateRemarks(result.marks),
            teacherId: session.user.id,
          },
        });
      })
    );

    return NextResponse.json(examResults);
  } catch (error) {
    console.error("[EXAM_RESULTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const results = await prisma.examResult.findMany({
      where: {
        examId: params.id,
      },
      include: {
        student: true,
        subject: true,
        teacher: true,
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("[EXAM_RESULTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function calculateGrade(marks: number): string {
  if (marks >= 80) return "A";
  if (marks >= 75) return "A-";
  if (marks >= 70) return "B+";
  if (marks >= 65) return "B";
  if (marks >= 60) return "B-";
  if (marks >= 55) return "C+";
  if (marks >= 50) return "C";
  if (marks >= 45) return "C-";
  if (marks >= 40) return "D+";
  if (marks >= 35) return "D";
  if (marks >= 30) return "D-";
  return "E";
}

function generateRemarks(marks: number): string {
  if (marks >= 80) return "Excellent";
  if (marks >= 70) return "Very Good";
  if (marks >= 60) return "Good";
  if (marks >= 50) return "Fair";
  if (marks >= 40) return "Below Average";
  return "Poor";
}