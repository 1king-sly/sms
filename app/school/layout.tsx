import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from '@/utils/authOptions';
import SchoolDashboardLayout from "@/components/layout/school-dashboard-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);

  // if (!session || session.user.role !== "SCHOOL_ADMIN") {
  //   redirect("/login");
  // }

  return <SchoolDashboardLayout>{children}</SchoolDashboardLayout>;
}