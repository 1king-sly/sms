"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
  email: string;
  isAssigned: boolean;
}

export default function AssignTeachersPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`/api/school/subjects/${params.id}/teachers`);
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [params.id]);

  const handleTeacherToggle = (teacherId: string) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, isAssigned: !teacher.isAssigned }
        : teacher
    ));
  };

  const handleSubmit = async () => {
    try {
      const assignedTeacherIds = teachers
        .filter(teacher => teacher.isAssigned)
        .map(teacher => teacher.id);

      const response = await fetch(`/api/school/subjects/${params.id}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherIds: assignedTeacherIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to update teacher assignments");
      }

      toast({
        title: "Success",
        description: "Teacher assignments updated successfully",
      });

      router.push("/school/subjects");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update teacher assignments",
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
          <CardTitle>Assign Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center space-x-2">
                <Checkbox
                  id={teacher.id}
                  checked={teacher.isAssigned}
                  onCheckedChange={() => handleTeacherToggle(teacher.id)}
                />
                <label
                  htmlFor={teacher.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {teacher.name} ({teacher.email})
                </label>
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="mt-6 w-full">
            Save Assignments
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}