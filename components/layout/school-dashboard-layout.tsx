"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Building2,
  Calculator,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  TestTube2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const schoolAdminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/school",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Departments",
    href: "/school/departments",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Teachers",
    href: "/school/teachers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Students",
    href: "/school/students",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "Accounting",
    href: "/school/accounting",
    icon: <Calculator className="h-5 w-5" />,
  },
  {
    title: "Examinations",
    href: "/school/examinations",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Library",
    href: "/school/library",
    icon: <Library className="h-5 w-5" />,
  },
  {
    title: "Laboratory",
    href: "/school/laboratory",
    icon: <TestTube2 className="h-5 w-5" />,
  },
];

export default function SchoolDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white dark:bg-gray-800 transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b px-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">School Admin</span>
        </div>
        <nav className="space-y-1 p-4">
          {schoolAdminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
                pathname === item.href
                  ? "bg-gray-100 text-primary dark:bg-gray-700"
                  : "text-gray-600 dark:text-gray-300"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "min-h-screen transition-margin duration-200 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}