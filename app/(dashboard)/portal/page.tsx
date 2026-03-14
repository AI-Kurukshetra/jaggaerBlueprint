import { MessageSquareText } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = {
  title: "SupplySync AI | Supplier Portal"
};

const threads = [
  {
    supplier: "Northwind Metals",
    topic: "Updated insurance certificate",
    status: "Awaiting review",
    lastMessage: "Uploaded the latest insurance docs for 2026 compliance."
  },
  {
    supplier: "Everline Logistics",
    topic: "RFQ Response",
    status: "New",
    lastMessage: "Submitted pricing and lead time details for RFQ-421."
  },
  {
    supplier: "BluePeak Electronics",
    topic: "Payment follow-up",
    status: "In progress",
    lastMessage: "Checking on invoice 8842 payment status."
  }
];

const tasks = [
  "Review insurance documentation for Northwind Metals",
  "Approve RFQ response scoring matrix",
  "Respond to payment inquiry",
  "Publish Q2 supplier newsletter"
];

export default function SupplierPortalPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Supplier Communication Portal"
        description="Central workspace for supplier messages, requests, and updates."
      />
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Active Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {threads.map((thread) => (
              <div key={thread.topic} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{thread.supplier}</p>
                    <p className="text-xs text-slate-500">{thread.topic}</p>
                  </div>
                  <Badge variant={thread.status === "New" ? "info" : thread.status === "Awaiting review" ? "warning" : "neutral"}>
                    {thread.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{thread.lastMessage}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Portal Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <div key={task} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <MessageSquareText className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700">{task}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
