import { Input } from "@/components/ui/Input";
import SubmitButton from "@/components/ui/SubmitButton";

export default function ScorecardForm({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="delivery_score">
          Delivery
        </label>
        <Input
          id="delivery_score"
          name="delivery_score"
          type="number"
          min={0}
          max={100}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="quality_score">
          Quality
        </label>
        <Input
          id="quality_score"
          name="quality_score"
          type="number"
          min={0}
          max={100}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="service_score">
          Service
        </label>
        <Input
          id="service_score"
          name="service_score"
          type="number"
          min={0}
          max={100}
          required
          className="mt-1"
        />
      </div>
      <div className="md:col-span-3 flex justify-end">
        <SubmitButton variant="secondary">Save Scorecard</SubmitButton>
      </div>
    </form>
  );
}
