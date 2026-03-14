import { redirect } from "next/navigation";
import { ensureUserAndTenant } from "@/services/auth";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const result = await ensureUserAndTenant();

  if (!result) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col px-4 py-6 md:px-6 lg:px-8">
          <Header />
          <div className="mt-4">
            <MobileNav />
          </div>
          <main className="mt-6 flex-1 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
