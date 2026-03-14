import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "SupplySync AI | Auth"
};

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-16">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
