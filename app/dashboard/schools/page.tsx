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
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function SchoolsPage() {
  // const schools = await db.school.findMany({
  //   include: {
  //     schoolAdmin: true,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  const schools = [
    {
      id: '1',
      name: 'Moi Forces Academy',
      email: 'mfamombasa@gmail.com',
      address: 'Mombasa',
      contact: '0720041750',
      initials: 'MFA',
      logo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      superAdminId: '1',
      password: 'password',
    },
    {
      id: '2',
      name: 'Moi Forces Girls Academy',
      email: 'mfagirlsmombasa@gmail.com',
      address: 'Mombasa',
      contact: '0720041750',
      initials: 'MFAG',
      logo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      superAdminId: '1',
      password: 'password',
    },
    {
      id: '1',
      name: 'Moi Forces Academy - Lanet',
      email: 'mfalanet@gmail.com',
      address: 'Lanet',
      contact: '0720041750',
      initials: 'MFAL',
      logo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      superAdminId: '1',
      password: 'password',
    }
  ];
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schools</h1>
        <Button asChild>
          <Link href="/dashboard/schools/new">
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schools</CardTitle>
          <CardDescription>
            Manage and monitor all schools in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={schools} />
        </CardContent>
      </Card>
    </div>
  );
}