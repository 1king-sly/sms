"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function FeeStructure() {
  const [feeStructure, setFeeStructure] = useState({
    tuition: 35000,
    boarding: 25000,
    meals: 15000,
    activities: 5000,
    development: 10000,
  });

  const handleUpdate = (category: string, value: string) => {
    setFeeStructure((prev) => ({
      ...prev,
      [category]: parseFloat(value) || 0,
    }));
  };

  const totalFees = Object.values(feeStructure).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Structure Management</CardTitle>
        <CardDescription>
          Configure and update school fee structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Category</TableHead>
                <TableHead>Amount (KES)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(feeStructure).map(([category, amount]) => (
                <TableRow key={category}>
                  <TableCell className="capitalize">{category}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => handleUpdate(category, e.target.value)}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(totalFees)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel Changes</Button>
            <Button>Save Fee Structure</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}