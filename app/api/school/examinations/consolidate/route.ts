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
    const { name, examIds, academicYear } = body;

    // Create consolidated exam
    const consolidatedExam = await prisma.exam.create({
      data: {
        name,
        type: "CONSOLIDATED",
        term: 0, // Not applicable for consolidated exams
        academicYear,
        startDate: new Date(),
        endDate: new Date(),
        isConsolidated: true,
        schoolId: schoolAdmin.schoolId,
      },
    });

    // Calculate and create consolidated results
    const examResults = await prisma.examResult.findMany({
      where: {
        examId: {
          in: examIds,
        },
      },
      include: {
        student: true,
        subject: true,
      },
    });

    // Group results by student and subject
    const consolidatedResults = examResults.reduce((acc: { [x: string]: {
      studentId: any;
      subjectId: any; marks: any[]; 
}; }, result: { studentId: any; subjectId: any; marks: any; }) => {
      const key = `${result.studentId}-${result.subjectId}`;
      if (!acc[key]) {
        acc[key] = {
          studentId: result.studentId,
          subjectId: result.subjectId,
          marks: [],
        };
      }
      acc[key].marks.push(result.marks);
      return acc;
    }, {} as Record<string, { studentId: string; subjectId: string; marks: number[] }>);

    // Create consolidated results
    for (const key in consolidatedResults) {
      const result = consolidatedResults[key];
      const averageMark = result.marks.reduce((a: any, b: any) => a + b, 0) / result.marks.length;
      
      await prisma.examResult.create({
        data: {
          examId: consolidatedExam.id,
          studentId: result.studentId,
          subjectId: result.subjectId,
          marks: averageMark,
          grade: calculateGrade(averageMark),
          remarks: generateRemarks(averageMark),
          teacherId: session.user.id,
        },
      });
    }

    return NextResponse.json(consolidatedExam);
  } catch (error) {
    console.error("[CONSOLIDATE_EXAM_POST]", error);
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