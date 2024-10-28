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
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function DepartmentsPage() {
  const session = await getServerSession(authOptions);
  
  const schoolAdmin = await db.schoolAdmin.findUnique({
    where: { email: session?.user?.email },
  });

  const departments = await db.department.findMany({
    where: {
      schoolId: schoolAdmin?.schoolId,
    },
    include: {
      admins: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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