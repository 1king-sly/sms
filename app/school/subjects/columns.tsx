"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Subject } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SubjectWithRelations extends Subject {
  teachers: {
    teacher: {
      name: string;
    };
  }[];
}

export const columns: ColumnDef<SubjectWithRelations>[] = [
  {
    accessorKey: "name",
    header: "Subject Name",
  },
  {
    accessorKey: "initials",
    header: "Initials",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.original.category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "teachers",
    header: "Teachers",
    cell: ({ row }) => {
      const teachers = row.original.teachers;
      return (
        <div className="flex flex-wrap gap-1">
          {teachers.map((t, index) => (
            <Badge key={index} variant="outline">
              {t.teacher.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subject = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/school/subjects/${subject.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/subjects/${subject.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/subjects/${subject.id}/teachers`}>
                Assign Teachers
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];