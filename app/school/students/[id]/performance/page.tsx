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
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { ResultSlip } from "./components/result-slip";
import { PerformanceGraphs } from "./components/performance-graphs";
import { GradeDistribution } from "./components/grade-distribution";
import { ClassStreamAnalysis } from "./components/class-stream-analysis";

type Grade = "A" | "B+" | "B";
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
  historicalData: Array<{ name: string; average: number }>;
  subjectPerformance: { subject: string; performance: number }[];
  predictions: { subject: string; predictedGrade: string }[];
  exams: {
    id: string;
    name: string;
    classTeacher: string;
    principal: string;
  }[];
  gradeDistribution: Record<string, number>;
  streamData: { streamName: string; averageScore: number }[];
  classData: { className: string; averageScore: number }[];
}

export default function StudentPerformancePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const student = {
    name: "John Doe",
    admissionNo: "A12345",
    photo: "/images/photo.jpg",
    stream: {
      class: { name: "10" },
      name: "A",
    },
  };

  const schoolData = {
    name: "Moi Forces Academy",
    address: "Likonki, Mombasa",
    contact: "+254720041750",
    logo: "/images/logo.jpeg",
  };

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
      historicalData: [
        { name: "Term 1", average: 75 },
        { name: "Term 2", average: 80 },
      ],
      subjectPerformance: [
        { subject: "Math", performance: 85 },
        { subject: "English", performance: 78 },
      ],
      predictions: [
        { subject: "Math", predictedGrade: "A" },
        { subject: "English", predictedGrade: "B+" },
      ],
      exams: [
        {
          id: "1",
          name: "Math Opener",
          classTeacher: "Mr. Smith",
          principal: "Dr. Brown",
        },
      ],
      gradeDistribution: { A: 5, "B+": 10, B: 15 },
      streamData: [
        { streamName: "Stream 1", averageScore: 78 },
        { streamName: "Stream 2", averageScore: 80 },
      ],
      classData: [
        { className: "Class 1", averageScore: 82 },
        { className: "Class 2", averageScore: 79 },
      ],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentRes, performanceRes] = await Promise.all([
          fetch(`/api/school/students/${params.id}`),
          fetch(`/api/school/students/${params.id}/performance`),
        ]);

        const studentData = await studentRes.json();
        const performanceData = await performanceRes.json();

        setData({
          student: studentData,
          performance: performanceData,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Generate color for each grade
  const getColorForGrade = (grade: Grade) => {
    const colors: Record<Grade, string> = {
      A: "#4caf50",
      "B+": "#2196f3",
      B: "#ff9800",
    };
    return colors[grade] || "#000000";
  };

  const formattedGradeData = Object.entries(
    performances[0].gradeDistribution
  ).map(([grade, count]) => ({
    grade: grade as Grade,
    count,
    color: getColorForGrade(grade as Grade),
  }));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Performance Report - ${student.name}`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Admission No: ${student.admissionNo}`, 14, 25);

    const tableData = performances.map((p) => [
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
      performances.map((p) => ({
        "Exam Name": p.examName,
        Term: p.term,
        Year: p.academicYear,
        "Average Marks": p.averageMarks,
        Grade: p.grade,
        Rank: `${p.rank}/${p.totalStudents}`,
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

  const chartData = performances.map((p) => ({
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Exam Results</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Class Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <PerformanceGraphs
              historicalData={performances[0].historicalData}
              subjectPerformance={performances[0].subjectPerformance}
              predictions={performances[0].predictions}
            />
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid gap-6">
            <ResultSlip
              student={{
                name: "John Doe",
                admissionNo: "123",
                photo: "/images/photo.jpg",
                stream: { class: { name: "10A" }, name: "Science" },
              }}
              exam={{
                name: "Mid Term",
                term: "1",
                academicYear: "2024",
                subjects: [ 
                  { name: "Math", marks: 85, grade: "A",teacher:{
                  name:'Byrone'
                },remarks:'Good work' }
                ,
                  { name: "English", marks: 78, grade: "B+",teacher:{
                    name:'Byrone'
                  },remarks:'Good work'  },
                  { name: "Science", marks: 92, grade: "A+",teacher:{
                    name:'Byrone'
                  },remarks:'Good work' },
                ],
                meanGrade: "B",
                meanMarks: 75,
                rank: 5,
                totalStudents: 30,
              }}
              school={{
                name: "ABC High School",
                address: "123 School St.",
                contact: "123-456-7890",
                logo: "/images/logo.jpeg",
              }}
              classTeacher={{ name: "Ms. Smith", remarks: "Good job!" }}
              principal={{
                name: "Mr. Johnson",
                remarks: "Keep up the good work!",
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-6">
          <GradeDistribution 
      gradeData={formattedGradeData} // Updated prop name
      totalStudents={performances[0].totalStudents} // Add totalStudents from performance data
    />

          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <ClassStreamAnalysis
            streamData={performances[0].streamData}
            classData={performances[0].classData}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
          <CardDescription>Average performance over exams.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
