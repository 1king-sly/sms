import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const CORE_SUBJECTS = [
  { name: "Mathematics", initials: "MATH", category: "SCIENCES", isCore: true },
  { name: "English", initials: "ENG", category: "LANGUAGES", isCore: true },
  { name: "Kiswahili", initials: "KIS", category: "LANGUAGES", isCore: true },
  { name: "Biology", initials: "BIO", category: "SCIENCES", isCore: true },
  { name: "Chemistry", initials: "CHEM", category: "SCIENCES", isCore: true },
  { name: "Physics", initials: "PHY", category: "SCIENCES", isCore: true },
  { name: "History", initials: "HIST", category: "HUMANITIES", isCore: true },
  { name: "Geography", initials: "GEO", category: "HUMANITIES", isCore: true },
];

const CLASS_NAMES = ["Form 1", "Form 2", "Form 3", "Form 4", "Graduated"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schoolId } = body;

    // Get current year
    const currentYear = new Date().getFullYear();

    // Create academic year
    const academicYear = await prisma.academicYear.create({
      data: {
        year: currentYear,
        startDate: new Date(currentYear, 0, 1), // January 1st
        endDate: new Date(currentYear, 11, 31), // December 31st
        School: {
          connect: [{ id: schoolId }] 
        }
      }
    });

    // Create core subjects
    await prisma.subject.createMany({
      data: CORE_SUBJECTS.map(subject => ({
        ...subject,
        schoolId
      }))
    });

    // Create classes with streams
    for (const className of CLASS_NAMES) {
      const isGraduated = className === "Graduated";
      
      const classData = await prisma.class.create({
        data: {
          name: className,
          academicYear: currentYear,
          schoolId,
          isGraduated,
          streams: {
            create: [
              { name: "East" },
              { name: "West" },
              { name: "North" },
              { name: "South" }
            ]
          }
        }
      });
    }

    return NextResponse.json({ message: "School setup completed successfully" });
  } catch (error) {
    console.error("[SCHOOL_SETUP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}