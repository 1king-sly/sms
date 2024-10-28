import { NextResponse } from 'next/server';
import { hash } from "bcryptjs";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      address,
      contact,
      initials,
      adminName,
      adminEmail,
    } = body;

    const hashedPassword = await hash(password, 10);
    const hashedAdminPassword = await hash(adminEmail, 10); // Using admin email as default password

    const school = await prisma.school.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        contact,
        initials,
        superAdminId: session.user.id,
        schoolAdmin: {
          create: {
            name: adminName,
            email: adminEmail,
            password: hashedAdminPassword,
          },
        },
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error("[SCHOOLS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schools = await prisma.school.findMany({
      include: {
        schoolAdmin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error("[SCHOOLS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}