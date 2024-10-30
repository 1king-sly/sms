"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  name: string;
  admissionNo: string;
  marks?: number;
}

interface Subject {
  id: string;
  name: string;
}

export default function UploadMarksPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  // const [students, setStudents] = useState<Student[]>([]);
  // const [subject, setSubject] = useState<Subject | null>(null);

  const [students, setStudents] = useState<Student[]>([
    { id: "student1", name: "John Doe", admissionNo: "ADM001", marks: undefined },
    { id: "student2", name: "Jane Smith", admissionNo: "ADM002", marks: undefined },
    { id: "student3", name: "Alice Brown", admissionNo: "ADM003", marks: undefined },
    { id: "student4", name: "Bob Green", admissionNo: "ADM004", marks: undefined },
  ]);
  
  const [subject, setSubject] = useState<Subject>({
    id: "subject1",
    name: "Mathematics",
  });
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch students and subject data
  //       const [studentsRes, subjectRes] = await Promise.all([
  //         fetch(`/api/school/examinations/${params.id}/students`),
  //         fetch(`/api/school/teachers/subjects/current`)
  //       ]);
        
  //       const studentsData = await studentsRes.json();
  //       const subjectData = await subjectRes.json();
        
  //       setStudents(studentsData);
  //       setSubject(subjectData);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [params.id]);

  const handleMarksChange = (studentId: string, marks: string) => {
    const numericMarks = parseFloat(marks);
    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) return;

    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, marks: numericMarks }
        : student
    ));
  };

  const handleSubmit = async () => {
    try {
      // Validate that all students have marks
      const incomplete = students.some(student => student.marks === undefined);
      if (incomplete) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter marks for all students",
        });
        return;
      }

      const response = await fetch(`/api/school/examinations/${params.id}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: subject?.id,
          results: students.map(student => ({
            studentId: student.id,
            marks: student.marks,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload marks");
      }

      toast({
        title: "Success",
        description: "Marks uploaded successfully",
      });

      router.push(`/school/examinations/${params.id}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload marks",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subject) {
    return <div>No subject assigned to current teacher</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Marks - {subject.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admission No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Marks (0-100)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={student.marks || ""}
                      onChange={(e) => handleMarksChange(student.id, e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button onClick={handleSubmit} className="mt-6">
            Upload Marks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}