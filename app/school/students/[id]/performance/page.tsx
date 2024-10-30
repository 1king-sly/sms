"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";import * as XLSX from "xlsx";



interface Performance {
  examId: string;
  examName: string;
  term: number;
  academicYear: number;
  subjects: {
    name: string;
    marks: number;
    grade: string;
  }[];
  averageMarks: number;
  grade: string;
  rank: number;
  totalStudents: number;
}

export default function StudentPerformancePage() {
  const params = useParams();
  // const [student, setStudent] = useState<any>(null);
  // const [performances, setPerformances] = useState<Performance[]>([]);
  // const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState({
    name: "John Doe",
    admissionNo: "A12345",
  });
  
  const [performances, setPerformances] = useState<Performance[]>([
    {
      examId: "exam1",
      examName: "Maths Opener",
      term: 1,
      academicYear: 2024,
      subjects: [
        { name: "Math", marks: 85, grade: "A" },
        { name: "English", marks: 78, grade: "B+" },
        { name: "Science", marks: 92, grade: "A+" },
      ],
      averageMarks: 85,
      grade: "A",
      rank: 1,
      totalStudents: 30,
    },
    {
      examId: "exam2",
      examName: "English Mid Term",
      term: 1,
      academicYear: 2024,
      subjects: [
        { name: "Math", marks: 88, grade: "A" },
        { name: "English", marks: 81, grade: "A-" },
        { name: "Science", marks: 76, grade: "B+" },
      ],
      averageMarks: 81.67,
      grade: "A-",
      rank: 3,
      totalStudents: 30,
    },
    {
      examId: "exam3",
      examName: "Science End Term",
      term: 1,
      academicYear: 2024,
      subjects: [
        { name: "Math", marks: 90, grade: "A+" },
        { name: "English", marks: 74, grade: "B" },
        { name: "Science", marks: 80, grade: "B+" },
      ],
      averageMarks: 81.33,
      grade: "A-",
      rank: 2,
      totalStudents: 30,
    },
  ]);
  
  const [loading, setLoading] = useState(false); // Set loading to false since no API call is needed
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [studentRes, performanceRes] = await Promise.all([
  //         fetch(`/api/school/students/${params.id}`),
  //         fetch(`/api/school/students/${params.id}/performance`),
  //       ]);

  //       const studentData = await studentRes.json();
  //       const performanceData = await performanceRes.json();

  //       setStudent(studentData);
  //       setPerformances(performanceData);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [params.id]);

  const generatePDF = () => {

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text(`Performance Report - ${student.name}`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Admission No: ${student.admissionNo}`, 14, 25);
    
    // Add performance table
    const tableData = performances.map(p => [
      p.examName,
      `Term ${p.term}`,
      p.academicYear.toString(),
      p.averageMarks.toFixed(2),
      p.grade,
      `${p.rank}/${p.totalStudents}`,
    ]);

    autoTable(doc, {
      head: [["Exam", "Term", "Year", "Average", "Grade", "Rank"]],
      body: tableData,
      startY: 35,
    });

    doc.save(`${student.name}_performance.pdf`);
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      performances.map(p => ({
        "Exam Name": p.examName,
        "Term": p.term,
        "Year": p.academicYear,
        "Average Marks": p.averageMarks,
        "Grade": p.grade,
        "Rank": `${p.rank}/${p.totalStudents}`,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance");
    XLSX.writeFile(wb, `${student.name}_performance.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = performances.map(p => ({
    name: p.examName,
    average: p.averageMarks,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">
            Admission No: {student.admissionNo}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={generateExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exams">Exam Results</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Average marks across all examinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#8884d8"
                      name="Average Marks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Examination Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {performances.map((performance) => (
                  <div key={performance.examId} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {performance.examName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Term {performance.term}, {performance.academicYear}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {performance.averageMarks.toFixed(2)}%
                        </p>
                        <p className="text-sm">
                          Rank: {performance.rank}/{performance.totalStudents}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {performance.subjects.map((subject) => (
                        <Card key={subject.name}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{subject.name}</p>
                              <div className="text-right">
                                <p className="text-lg font-semibold">
                                  {subject.marks}%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Grade: {subject.grade}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
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
              {/* Add subject-wise analysis here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}