import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6">
            <LoadingSkeleton className="h-3 w-24" />
            <LoadingSkeleton className="mt-4 h-8 w-16" />
            <LoadingSkeleton className="mt-3 h-3 w-32" />
          </Card>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="p-6">
            <LoadingSkeleton className="h-4 w-40" />
            <LoadingSkeleton className="mt-4 h-32 w-full" />
          </Card>
        ))}
      </section>
      <Card className="p-6">
        <LoadingSkeleton className="h-4 w-44" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
