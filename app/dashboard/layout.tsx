import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from '@/utils/authOptions';
import DashboardLayout from "@/components/layout/dashboard-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/login");
  // }

  return <DashboardLayout>{children}</DashboardLayout>;
}