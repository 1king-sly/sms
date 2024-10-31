"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerformanceGraphsProps {
  historicalData: any[];
  subjectPerformance: any[];
  predictions: any[];
}

export function PerformanceGraphs({ historicalData, subjectPerformance, predictions }: PerformanceGraphsProps) {
  return (
    <Tabs defaultValue="trend">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="trend">Performance Trend</TabsTrigger>
        <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
        <TabsTrigger value="comparison">Class Comparison</TabsTrigger>
        <TabsTrigger value="prediction">Performance Prediction</TabsTrigger>
      </TabsList>

      <TabsContent value="trend">
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="examName" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="marks"
                    stroke="#8884d8"
                    name="Average Marks"
                  />
                  <Line
                    type="monotone"
                    dataKey="classAverage"
                    stroke="#82ca9d"
                    name="Class Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subjects">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={subjectPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Student Marks"
                    dataKey="marks"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Class Average"
                    dataKey="classAverage"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="comparison">
        <Card>
          <CardHeader>
            <CardTitle>Class Rank Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="examName" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="marks" name="Student Marks" fill="#8884d8" />
                  <Bar dataKey="classAverage" name="Class Average" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="prediction">
        <Card>
          <CardHeader>
            <CardTitle>Performance Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="examName" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actualMarks"
                    stroke="#8884d8"
                    name="Actual Marks"
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedMarks"
                    stroke="#82ca9d"
                    name="Predicted Marks"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}