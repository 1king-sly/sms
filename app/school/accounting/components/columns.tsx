"use client";

import { Row, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Expense = {
  date: string;
  category: string;
  description: string;
  amount: number;
  status: string;
};

export const columns = {
  expenses: [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: Row<Expense> }) => formatCurrency(row.getValue("amount")),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Expense> }) => (
        <Button variant="outline" size="sm">
          View Details
        </Button>
      ),
    },
  ],
  reports: [
    {
      accessorKey: "name",
      header: "Report Name",
    },
    {
      accessorKey: "period",
      header: "Period",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Expense> }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button variant="outline" size="sm">
            Download
          </Button>
        </div>
      ),
    },
  ],
} as const;