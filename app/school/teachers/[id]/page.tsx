import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fetchSingleSchoolTeacher } from "@/lib/actions";

export default async function TeacherDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  
  // const teacher = await fetchSingleSchoolTeacher(params.id)

  const teacher =  {
    id: "ckw1d9p45678bvlmnopqrtyz",
    name: "Mr. John Doe",
    email: "johndoe@example.com",
    password: "hashed_password",
    idNumber: "T12345",
    photo: null,
    role:'TEACHER',

    schoolId: "ckw1d9p12345aqlrste45bfgh",
    school: {
      id: "ckw1d9p12345aqlrste45bfgh",
      name: "Greenwood High School",
    },
    departments: [
      {
        department: {
          id: "ckw1d9p78910xyzqwerty567",
          name: "Science",
        },
      },
    ],
    subjects: [
      {
        subject: {
          id: "ckw1d9pqy1111qldfe23c3e1z",
          name: "Mathematics",
        },
      },
      {
        subject: {
          id: "ckw1d9pqy2222qldfe23c3e1z",
          name: "Physics",
        },
      },
    ],
    classTeacher: {
      id: "ckw1d9p456789stream0001",
      name: "10th Grade - A",
    },    createdAt: new Date("2022-09-01T08:00:00Z"),
    updatedAt: new Date("2023-09-01T08:00:00Z"),
  }

  if (!teacher) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={teacher.photo || ""} />
              <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{teacher.name}</h2>
              <p className="text-muted-foreground">{teacher.email}</p>
              <p className="text-sm">ID: {teacher.idNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {teacher.departments.map((dept) => (
                <Badge key={dept.department.id} variant="secondary">
                  {dept.department.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subj) => (
                <Badge key={subj.subject.id} variant="outline">
                  {subj.subject.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {teacher.classTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Class Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Stream: {teacher.classTeacher.name}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}