"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Department } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Department & { admins: any[] }>[] = [
  {
    accessorKey: "name",
    header: "Department Name",
  },
  {
    accessorKey: "admins",
    header: "Admins",
    cell: ({ row }) => {
      const admins = row.original.admins;
      return <div>{admins.length || 0} admin(s)</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const department = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/school/departments/${department.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/departments/${department.id}/admins`}>
                Manage Admins
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/departments/${department.id}/edit`}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];