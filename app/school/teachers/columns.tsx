"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Teacher } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeacherWithRelations extends Teacher {
  departments: {
    department: {
      name: string;
    };
  }[];
  subjects: {
    subject: {
      name: string;
    };
  }[];
}

export const columns: ColumnDef<TeacherWithRelations>[] = [
  {
    accessorKey: "photo",
    header: "",
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <Avatar>
          <AvatarImage src={teacher.photo || ""} />
          <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "idNumber",
    header: "ID Number",
  },
  {
    accessorKey: "departments",
    header: "Departments",
    cell: ({ row }) => {
      const departments = row.original.departments;
      return (
        <div className="flex flex-wrap gap-1">
          {departments.map((dept, index) => (
            <Badge key={index} variant="secondary">
              {dept.department.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => {
      const subjects = row.original.subjects;
      return (
        <div className="flex flex-wrap gap-1">
          {subjects.map((subj, index) => (
            <Badge key={index} variant="outline">
              {subj.subject.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacher = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/school/teachers/${teacher.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/teachers/${teacher.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/teachers/${teacher.id}/subjects`}>
                Manage Subjects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/teachers/${teacher.id}/departments`}>
                Manage Departments
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];