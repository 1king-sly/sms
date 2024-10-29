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
import { getServerSession } from "next-auth";
import { DataTable } from "../departments/data-table";
import { columns } from "./columns";

export default async function StudentsPage() {
  // const session = await getServerSession(authOptions);
  
  // const schoolAdmin = await db.schoolAdmin.findUnique({
  //   where: { email: session?.user?.email },
  // });

  // const students = await db.student.findMany({
  //   where: {
  //     schoolId: schoolAdmin?.schoolId,
  //   },
  //   include: {
  //     stream: {
  //       include: {
  //         class: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  const students = [
    {
      id: "ckw1d9pqy0001qldfe23c3e1z",
      name: "John Doe",
      admissionNo: "AD001",
      email: "john.doe@example.com",
      password: "hashed_password_123", // replace with actual hashed password
      schoolId: "ckw1d9p12345aqlrste45bfgh",
      school: {
        id: "ckw1d9p12345aqlrste45bfgh",
        name: "Greenwood High School",
      },
      role:'STUDENT',
      streamId: "ckw1d9pqy0987zxcvjkl12345",
      stream: {
        id: "ckw1d9pqy0987zxcvjkl12345",
        name: "Stream A",
        class: {
          id: "ckw1d9pqy0000abcde67890fg",
          name: "Class 10",
        },
      },
      createdAt: new Date("2023-09-10T08:00:00Z"),
      updatedAt: new Date("2023-09-10T08:00:00Z"),
    },
    {
      id: "ckw1d9pqy0002hgfdew89bvf2",
      name: "Jane Smith",
      admissionNo: "AD002",
      email: "jane.smith@example.com",
      password: "hashed_password_456",
      schoolId: "ckw1d9p12345aqlrste45bfgh",
      school: {
        id: "ckw1d9p12345aqlrste45bfgh",
        name: "Greenwood High School",
      },
      role:'STUDENT',

      streamId: "ckw1d9pqy0987zxcvjkl12345",
      stream: {
        id: "ckw1d9pqy0987zxcvjkl12345",
        name: "Stream B",
        class: {
          id: "ckw1d9pqy0000abcde67890fg",
          name: "Class 9",
        },
      },
      createdAt: new Date("2022-01-15T10:30:00Z"),
      updatedAt: new Date("2022-01-15T10:30:00Z"),
    },
  ];
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button asChild>
          <Link href="/school/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            Manage your school students and their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={students} />
        </CardContent>
      </Card>
    </div>
  );
}