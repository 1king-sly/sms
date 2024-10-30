import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SCHOOL_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exam = await prisma.exam.update({
      where: {
        id: params.id,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("[EXAM_PUBLISH_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}