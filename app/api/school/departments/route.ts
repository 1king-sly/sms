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
    const { name, adminEmails } = body;

    const department = await db.department.create({
      data: {
        name,
        schoolId: schoolAdmin.schoolId,
        admins: {
          create: adminEmails.map((email: string) => ({
            name: "Department Admin", // You might want to accept names as well
            email,
            password: hash(email, 10), // Using email as default password
          })),
        },
      },
      include: {
        admins: true,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("[DEPARTMENTS_POST]", error);
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

    const departments = await db.department.findMany({
      where: {
        schoolId: schoolAdmin.schoolId,
      },
      include: {
        admins: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("[DEPARTMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}