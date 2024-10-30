"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Exam } from "@prisma/client";
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

export const columns: ColumnDef<Exam>[] = [
  {
    accessorKey: "name",
    header: "Exam Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.original.type.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "term",
    header: "Term",
  },
  {
    accessorKey: "academicYear",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const exam = row.original;
      return (
        <Badge variant={exam.isPublished ? "success" : "warning"}>
          {exam.isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exam = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/school/examinations/${exam.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/school/examinations/${exam.id}/results`}>
                View Results
              </Link>
            </DropdownMenuItem>
            {!exam.isPublished && (
              <DropdownMenuItem asChild>
                <Link href={`/school/examinations/${exam.id}/results/upload`}>
                  Upload Results
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];