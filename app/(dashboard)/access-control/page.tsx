import { Users } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { getUsers } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Access Control"
};

export default async function AccessControlPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="User Access Control"
        description="Manage roles, permissions, and user status."
      />
      <Card className="p-6">
        {users.length === 0 ? (
          <EmptyState
            title="No users"
            description="User accounts will appear once onboarded."
            icon={<Users className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {user.email ?? "Unknown"}
                  </TableCell>
                  <TableCell>{user.role ?? "member"}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "success" : "warning"}>
                      {user.status ?? "active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
