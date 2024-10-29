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

import { DataTable } from "../departments/data-table";
import { columns } from "./columns";
import { fetchSchoolSubjects } from "@/lib/actions";

export default async function SubjectsPage() {
 
  // const subjects = await fetchSchoolSubjects()


  const subjects = [
    {
      id: "ckw1d9pqy1111qldfe23c3e1z",
      name: "Mathematics",
      initials: "MATH",
      category: "Core",
      schoolId: "ckw1d9p12345aqlrste45bfgh",
      school: {
        id: "ckw1d9p12345aqlrste45bfgh",
        name: "Greenwood High School",
      },
      teachers: [
        {
          teacher: {
            id: "ckw1d9p45678bvlmnopqrtyz",
            name: "Mr. John Doe",
          },
        },
        {
          teacher: {
            id: "ckw1d9p45678yzxcvbnmljkl",
            name: "Ms. Jane Smith",
          },
        },
      ],
      createdAt: new Date("2023-09-10T08:00:00Z"),
      updatedAt: new Date("2023-09-10T08:00:00Z"),
    },
    {
      id: "ckw1d9pqy2222qldfe23c3e1z",
      name: "English Literature",
      initials: "ENG",
      category: "Humanities",
      schoolId: "ckw1d9p12345aqlrste45bfgh",
      school: {
        id: "ckw1d9p12345aqlrste45bfgh",
        name: "Greenwood High School",
      },
      teachers: [
        {
          teacher: {
            id: "ckw1d9p45678hijklmnopqrt",
            name: "Ms. Emma Green",
          },
        },
      ],
      createdAt: new Date("2022-01-15T10:30:00Z"),
      updatedAt: new Date("2022-01-15T10:30:00Z"),
    },
  ];
  
  


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <Button asChild>
          <Link href="/school/subjects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
          <CardDescription>
            Manage your school subjects and their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}