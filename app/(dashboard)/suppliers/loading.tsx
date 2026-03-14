import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function SuppliersLoading() {
  return (
    <Card className="p-6">
      <LoadingSkeleton className="h-4 w-40" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </Card>
  );
}
