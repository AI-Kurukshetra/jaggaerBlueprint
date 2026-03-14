"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function DocumentUpload({
  supplierId,
  onUploaded
}: {
  supplierId: string;
  onUploaded: (payload: {
    document_type: string;
    file_path: string;
    file_name: string;
    expires_at?: string;
  }) => Promise<void>;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const documentType = String(formData.get("document_type") ?? "");
    const expiresAt = String(formData.get("expires_at") ?? "");
    const file = formData.get("file") as File | null;

    if (!file) {
      setError("Select a file to upload.");
      setIsUploading(false);
      return;
    }

    const supabase = createClient();
    const filePath = `${supplierId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("supplier-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true
      });

    if (uploadError) {
      setError(uploadError.message);
      addToast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "error"
      });
      setIsUploading(false);
      return;
    }

    await onUploaded({
      document_type: documentType,
      file_path: filePath,
      file_name: file.name,
      expires_at: expiresAt || undefined
    });

    event.currentTarget.reset();
    addToast({
      title: "Document uploaded",
      description: "The supplier document is now available.",
      variant: "success"
    });
    setIsUploading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="document_type">
          Document Type
        </label>
        <Input id="document_type" name="document_type" required className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="expires_at">
          Expiry (optional)
        </label>
        <Input id="expires_at" name="expires_at" type="date" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="file">
          File
        </label>
        <Input id="file" name="file" type="file" required className="mt-1" />
      </div>
      {error ? <p className="text-sm text-rose-600 md:col-span-3">{error}</p> : null}
      <div className="md:col-span-3 flex justify-end">
        <Button type="submit" variant="secondary" isLoading={isUploading}>
          Upload Document
        </Button>
      </div>
    </form>
  );
}
