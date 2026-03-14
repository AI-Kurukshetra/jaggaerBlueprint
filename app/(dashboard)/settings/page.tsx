import { Settings } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = {
  title: "SupplySync AI | Settings"
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">
          Configure your workspace, alerts, and integrations.
        </p>
      </div>
      <Card className="p-6">
        <EmptyState
          title="Settings coming soon"
          description="Workspace preferences and integrations will appear here."
          icon={<Settings className="h-5 w-5" />}
        />
      </Card>
    </div>
  );
}
