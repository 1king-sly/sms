"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Exam {
  id: string;
  name: string;
  type: string;
  term: number;
  academicYear: number;
  isSelected?: boolean;
}

export default function ConsolidateExamsPage() {
  const router = useRouter();
  const { toast } = useToast();
  // const [exams, setExams] = useState<Exam[]>([]);
  // const [consolidatedName, setConsolidatedName] = useState("");
  // const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState<Exam[]>([
    { id: "exam1", name: "Maths Opener", type: "OPENER", term: 1, academicYear: 2024 },
    { id: "exam2", name: "English Mid Term", type: "MID_TERM", term: 1, academicYear: 2024 },
    { id: "exam3", name: "Science End Term", type: "END_TERM", term: 1, academicYear: 2024 },
    { id: "exam4", name: "Geography Opener", type: "OPENER", term: 2, academicYear: 2024 },
  ]);
  
  const [consolidatedName, setConsolidatedName] = useState("");
  const [loading, setLoading] = useState(false);  
  

  // useEffect(() => {
  //   const fetchExams = async () => {
  //     try {
  //       const response = await fetch("/api/school/examinations/unconsolidated");
  //       const data = await response.json();
  //       setExams(data);
  //     } catch (error) {
  //       console.error("Failed to fetch exams:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchExams();
  // }, []);

  const handleExamToggle = (examId: string) => {
    setExams(exams.map(exam => 
      exam.id === examId 
        ? { ...exam, isSelected: !exam.isSelected }
        : exam
    ));
  };

  const handleSubmit = async () => {
    try {
      if (!consolidatedName.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please provide a name for the consolidated exam",
        });
        return;
      }

      const selectedExams = exams.filter(exam => exam.isSelected);
      if (selectedExams.length < 2) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select at least two exams to consolidate",
        });
        return;
      }

      const response = await fetch("/api/school/examinations/consolidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: consolidatedName,
          examIds: selectedExams.map(exam => exam.id),
          academicYear: new Date().getFullYear(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create consolidated exam");
      }

      toast({
        title: "Success",
        description: "Consolidated exam created successfully",
      });

      router.push("/school/examinations");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create consolidated exam",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Consolidated Examination</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Consolidated Exam Name</label>
              <Input
                value={consolidatedName}
                onChange={(e) => setConsolidatedName(e.target.value)}
                placeholder="Enter consolidated exam name"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Select Exams to Consolidate</label>
              {exams.map((exam) => (
                <div key={exam.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={exam.id}
                    checked={exam.isSelected}
                    onCheckedChange={() => handleExamToggle(exam.id)}
                  />
                  <label
                    htmlFor={exam.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {exam.name} (Term {exam.term}, {exam.type})
                  </label>
                </div>
              ))}
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Create Consolidated Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}