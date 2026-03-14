import { Input } from "@/components/ui/Input";
import SubmitButton from "@/components/ui/SubmitButton";

export default function CertificationForm({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Certification
        </label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="issuer">
          Issuer
        </label>
        <Input id="issuer" name="issuer" required className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="expires_at">
          Expiry
        </label>
        <Input
          id="expires_at"
          name="expires_at"
          type="date"
          required
          className="mt-1"
        />
      </div>
      <div className="md:col-span-3 flex justify-end">
        <SubmitButton variant="secondary">Add Certification</SubmitButton>
      </div>
    </form>
  );
}
