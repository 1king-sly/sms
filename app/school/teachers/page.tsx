import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function TeachersPage() {
  // const session = await getServerSession(authOptions);
  
  // const schoolAdmin = await db.schoolAdmin.findUnique({
  //   where: { email: session?.user?.email },
  // });

  // const teachers = await db.teacher.findMany({
  //   where: {
  //     schoolId: schoolAdmin?.schoolId,
  //   },
  //   include: {
  //     departments: {
  //       include: {
  //         department: true,
  //       },
  //     },
  //     subjects: {
  //       include: {
  //         subject: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });


  const teachers = [
    {
      id: "ckw1d9p45678bvlmnopqrtyz",
      name: "Mr. John Doe",
      email: "johndoe@example.com",
      password: "hashed_password",
      idNumber: "T12345",
      photo: null,
      role:'TEACHER',

      schoolId: "ckw1d9p12345aqlrste45bfgh",
      school: {
        id: "ckw1d9p12345aqlrste45bfgh",
        name: "Greenwood High School",
      },
      departments: [
        {
          department: {
            id: "ckw1d9p78910xyzqwerty567",
            name: "Science",
          },
        },
      ],
      subjects: [
        {
          subject: {
            id: "ckw1d9pqy1111qldfe23c3e1z",
            name: "Mathematics",
          },
        },
        {
          subject: {
            id: "ckw1d9pqy2222qldfe23c3e1z",
            name: "Physics",
          },
        },
      ],
      classTeacher: null,
      createdAt: new Date("2022-09-01T08:00:00Z"),
      updatedAt: new Date("2023-09-01T08:00:00Z"),
    },
    {
      id: "ckw1d9p45678yzxcvbnmljkl",
      name: "Ms. Jane Smith",
      email: "janesmith@example.com",
      password: "hashed_password",
      idNumber: "T67890",
      photo: "janesmith.jpg",
      role:'TEACHER',

      schoolId: "ckw1d9p12345aqlrste45bfgh",
      school: {
        id: "ckw1d9p12345aqlrste45bfgh",
        name: "Greenwood High School",
      },
      departments: [
        {
          department: {
            id: "ckw1d9p78911ghijklmn789",
            name: "Humanities",
          },
        },
      ],
      subjects: [
        {
          subject: {
            id: "ckw1d9pqy3333qldfe23c3e1z",
            name: "English Literature",
          },
        },
      ],
      classTeacher: {
        id: "ckw1d9p456789stream0001",
        name: "10th Grade - A",
      },
      createdAt: new Date("2021-03-15T10:00:00Z"),
      updatedAt: new Date("2023-06-20T10:00:00Z"),
    },
  ];
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button asChild>
          <Link href="/school/teachers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>
            Manage your school teachers and their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={teachers} />
        </CardContent>
      </Card>
    </div>
  );
}