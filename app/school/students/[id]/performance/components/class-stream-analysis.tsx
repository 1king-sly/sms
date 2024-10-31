"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClassStreamAnalysisProps {
  streamData: any[];
  classData: any[];
}

export function ClassStreamAnalysis({ streamData, classData }: ClassStreamAnalysisProps) {
  return (
    <Tabs defaultValue="stream">
      <TabsList>
        <TabsTrigger value="stream">Stream Performance</TabsTrigger>
        <TabsTrigger value="class">Class Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="stream">
        <Card>
          <CardHeader>
            <CardTitle>Stream Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streamData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="streamAverage" name="Stream Average" fill="#8884d8" />
                  <Bar dataKey="studentMarks" name="Student Marks" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="class">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stream" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" name="Stream Average" fill="#8884d8" />
                  <Bar dataKey="highest" name="Highest Score" fill="#82ca9d" />
                  <Bar dataKey="lowest" name="Lowest Score" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}