import { NextResponse } from "next/response";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all exam results for the student
    const examResults = await db.examResult.findMany({
      where: {
        studentId: params.id,
      },
      include: {
        exam: true,
        subject: true,
      },
      orderBy: [
        { exam: { academicYear: "asc" } },
        { exam: { term: "asc" } },
      ],
    });

    // Group results by exam
    const examGroups = examResults.reduce((acc, result) => {
      if (!acc[result.examId]) {
        acc[result.examId] = {
          examId: result.examId,
          examName: result.exam.name,
          term: result.exam.term,
          academicYear: result.exam.academicYear,
          subjects: [],
          totalMarks: 0,
          subjectCount: 0,
        };
      }

      acc[result.examId].subjects.push({
        name: result.subject.name,
        marks: result.marks,
        grade: result.grade,
      });

      acc[result.examId].totalMarks += result.marks;
      acc[result.examId].subjectCount += 1;

      return acc;
    }, {} as Record<string, any>);

    // Calculate averages and get rankings
    const performances = await Promise.all(
      Object.values(examGroups).map(async (group: any) => {
        const averageMarks = group.totalMarks / group.subjectCount;

        // Get all students' averages for this exam for ranking
        const allResults = await db.examResult.groupBy({
          by: ["studentId"],
          where: {
            examId: group.examId,
          },
          _avg: {
            marks: true,
          },
        });

        // Sort averages to determine rank
        const sortedAverages = allResults
          .map(r => r._avg.marks || 0)
          .sort((a, b) => b - a);
        
        const rank = sortedAverages.indexOf(averageMarks) + 1;

        return {
          examId: group.examId,
          examName: group.examName,
          term: group.term,
          academicYear: group.academicYear,
          subjects: group.subjects,
          averageMarks,
          grade: calculateGrade(averageMarks),
          rank,
          totalStudents: sortedAverages.length,
        };
      })
    );

    return NextResponse.json(performances);
  } catch (error) {
    console.error("[STUDENT_PERFORMANCE_GET]", error);
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