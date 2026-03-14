import { Bell } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getNotifications } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Notifications"
};

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Email Notifications"
        description="Automated alerts for approvals, deadlines, and supplier updates."
      />
      <Card className="p-6">
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="Notifications will appear as events are triggered."
            icon={<Bell className="h-5 w-5" />}
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notice) => (
              <div key={notice.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{notice.type}</p>
                  <Badge variant={notice.read_at ? "neutral" : "info"}>
                    {notice.read_at ? "Read" : "New"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{notice.message}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {new Date(notice.created_at).toLocaleString("en-US")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
