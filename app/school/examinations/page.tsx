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

export default async function ExaminationsPage() {
 

  const exams = [
    {
      id: "exam1",
      name: "Term 1 Exam 2024",
      type: "OPENER",
      term: 1,
      academicYear: 2024,
      schoolId: "school1",
      startDate: new Date("2024-02-15"),
      endDate: new Date("2024-02-20"),
      isPublished: true,
      isConsolidated: false,
    },
    {
      id: "exam2",
      name: "Mid-Term Exam 2024",
      type: "MID_TERM",
      term: 1,
      academicYear: 2024,
      schoolId: "school1",
      startDate: new Date("2024-03-10"),
      endDate: new Date("2024-03-15"),
      isPublished: false,
      isConsolidated: false,
    },
    {
      id: "exam3",
      name: "End Term Exam 2024",
      type: "END_TERM",
      term: 1,
      academicYear: 2024,
      schoolId: "school1",
      startDate: new Date("2024-05-05"),
      endDate: new Date("2024-05-10"),
      isPublished: true,
      isConsolidated: true,
    },
    {
      id: "exam4",
      name: "Mock Exam 2024",
      type: "MOCK",
      term: 2,
      academicYear: 2024,
      schoolId: "school1",
      startDate: new Date("2024-07-12"),
      endDate: new Date("2024-07-17"),
      isPublished: true,
      isConsolidated: false,
    },
  ];
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Examinations</h1>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/school/examinations/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/school/examinations/consolidate">
              <Plus className="mr-2 h-4 w-4" />
              Create Consolidated Exam
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Examinations</CardTitle>
          <CardDescription>
            Manage and monitor all examinations in your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={exams} />
        </CardContent>
      </Card>
    </div>
  );
}