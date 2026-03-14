import { ClipboardCheck } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getSuppliers } from "@/services/suppliers";
import { getWorkflows } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Supplier Onboarding"
};

const steps = [
  { title: "Intake", status: "Complete" },
  { title: "Document Collection", status: "In Progress" },
  { title: "Risk Assessment", status: "Pending" },
  { title: "Compliance Review", status: "Pending" },
  { title: "Approval", status: "Pending" }
];

export default async function OnboardingPage() {
  const [suppliers, workflows] = await Promise.all([
    getSuppliers(),
    getWorkflows()
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Supplier Onboarding Workflow"
        description="Automated multi-step onboarding with approvals and compliance checks."
      />
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step) => (
              <div key={step.title} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-500">Standard onboarding flow</p>
                </div>
                <Badge variant={step.status === "Complete" ? "success" : step.status === "In Progress" ? "info" : "warning"}>
                  {step.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{workflow.name}</p>
                  <p className="text-xs text-slate-500">{workflow.resource_type}</p>
                </div>
                <Badge variant={workflow.status === "active" ? "success" : "neutral"}>
                  {workflow.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="p-6">
        <CardHeader>
          <CardTitle>Recent Supplier Intake</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suppliers.slice(0, 6).map((supplier, index) => (
            <div key={supplier.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{supplier.name}</p>
                <p className="text-xs text-slate-500">{supplier.category} • {supplier.location}</p>
              </div>
              <Badge variant={index % 3 === 0 ? "info" : index % 3 === 1 ? "warning" : "success"}>
                {index % 3 === 0 ? "Verification" : index % 3 === 1 ? "Docs Pending" : "Approved"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
