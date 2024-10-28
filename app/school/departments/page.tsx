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
import { authOptions } from '@/utils/authOptions';
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchSchoolDepartments } from "@/lib/actions";

export default async function DepartmentsPage() {
 
  // const departments = await fetchSchoolDepartments()

  const departments = [
    {
      id: "dept-1",
      name: "Science Department",
      schoolId: "school-123",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-06-01"),
      admins: [{ id: "admin-1", name: "John Doe" }, { id: "admin-2", name: "Jane Smith" }],
    },
    {
      id: "dept-2",
      name: "Mathematics Department",
      schoolId: "school-123",
      createdAt: new Date("2023-02-01"),
      updatedAt: new Date("2023-06-15"),
      admins: [{ id: "admin-3", name: "Alice Johnson" }],
    },
    {
      id: "dept-3",
      name: "Literature Department",
      schoolId: "school-456",
      createdAt: new Date("2023-03-01"),
      updatedAt: new Date("2023-07-01"),
      admins: [{ id: "admin-4", name: "Michael Brown" }],
    },
    {
      id: "dept-1",
      name: "Science Department",
      schoolId: "school-123",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-06-01"),
      admins: [{ id: "admin-1", name: "John Doe" }, { id: "admin-2", name: "Jane Smith" }],
    },
    {
      id: "dept-2",
      name: "Mathematics Department",
      schoolId: "school-123",
      createdAt: new Date("2023-02-01"),
      updatedAt: new Date("2023-06-15"),
      admins: [{ id: "admin-3", name: "Alice Johnson" }],
    },
    {
      id: "dept-3",
      name: "Literature Department",
      schoolId: "school-456",
      createdAt: new Date("2023-03-01"),
      updatedAt: new Date("2023-07-01"),
      admins: [{ id: "admin-4", name: "Michael Brown" }],
    },
    {
      id: "dept-1",
      name: "Science Department",
      schoolId: "school-123",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-06-01"),
      admins: [{ id: "admin-1", name: "John Doe" }, { id: "admin-2", name: "Jane Smith" }],
    },
    {
      id: "dept-2",
      name: "Mathematics Department",
      schoolId: "school-123",
      createdAt: new Date("2023-02-01"),
      updatedAt: new Date("2023-06-15"),
      admins: [{ id: "admin-3", name: "Alice Johnson" }],
    },
    {
      id: "dept-3",
      name: "Literature Department",
      schoolId: "school-456",
      createdAt: new Date("2023-03-01"),
      updatedAt: new Date("2023-07-01"),
      admins: [{ id: "admin-4", name: "Michael Brown" }],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departments</h1>
        <Button asChild>
          <Link href="/school/departments/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>
            Manage your school departments and their administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={departments} />
        </CardContent>
      </Card>
    </div>
  );
}


