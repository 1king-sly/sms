"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GradeDistributionProps {
  gradeData: {
    grade: string;
    count: number;
    color: string;
  }[];
  totalStudents: number;
}

export function GradeDistribution({ gradeData, totalStudents }: GradeDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gradeData}
                dataKey="count"
                nameKey="grade"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} students`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {gradeData.map((grade) => (
            <div key={grade.grade} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: grade.color }}
              />
              <span>
                {grade.grade}: {grade.count} ({((grade.count / totalStudents) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}