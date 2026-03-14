import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SupplierForm from "@/components/suppliers/SupplierForm";
import ScorecardForm from "@/components/suppliers/ScorecardForm";
import CertificationForm from "@/components/suppliers/CertificationForm";
import DocumentUpload from "@/components/suppliers/DocumentUpload";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import DeleteSupplierButton from "@/components/suppliers/DeleteSupplierButton";
import {
  addSupplierCertification,
  addSupplierDocument,
  addSupplierScorecard,
  deleteSupplier,
  updateSupplier
} from "@/app/(dashboard)/suppliers/actions";
import { getSupplierById } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Supplier"
};

function isExpiring(dateString: string) {
  const expires = new Date(dateString).getTime();
  const threshold = Date.now() + 1000 * 60 * 60 * 24 * 30;
  return expires <= threshold;
}

export default async function SupplierDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supplier, documents, certifications, scorecard } = await getSupplierById(
    id
  );

  if (!supplier) {
    notFound();
  }

  const supabase = await createClient();
  const documentUrls = await Promise.all(
    documents.map(async (doc) => {
      const { data } = await supabase.storage
        .from("supplier-documents")
        .createSignedUrl(doc.file_path, 60 * 60);
      return { ...doc, signedUrl: data?.signedUrl };
    })
  );

  const updateAction = updateSupplier.bind(null, supplier.id);
  const scorecardAction = addSupplierScorecard.bind(null, supplier.id);
  const certificationAction = addSupplierCertification.bind(null, supplier.id);
  const uploadAction = addSupplierDocument.bind(null, supplier.id);
  const deleteAction = deleteSupplier.bind(null, supplier.id);

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{supplier.name}</h2>
            <p className="text-sm text-slate-500">
              {supplier.category} • {supplier.location}
            </p>
          </div>
          <DeleteSupplierButton action={deleteAction} />
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader>
          <CardTitle>Supplier Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm
            supplier={supplier}
            action={updateAction}
            submitLabel="Update Supplier"
          />
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Scorecard</CardTitle>
            <p className="text-sm text-slate-500">Latest performance assessment.</p>
          </CardHeader>
          <CardContent>
            {scorecard ? (
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
                  <p className="text-xs text-slate-500">Delivery</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {scorecard.delivery_score}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
                  <p className="text-xs text-slate-500">Quality</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {scorecard.quality_score}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
                  <p className="text-xs text-slate-500">Service</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {scorecard.service_score}
                  </p>
                </div>
                <div className="col-span-3 rounded-xl bg-slate-900 px-4 py-3 text-center text-white">
                  <p className="text-xs text-slate-200">Overall</p>
                  <p className="text-2xl font-semibold">
                    {scorecard.overall_score}%
                  </p>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No scorecard yet"
                description="Add the first performance scorecard below."
              />
            )}
            <div className="mt-6">
              <ScorecardForm action={scorecardAction} />
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
            <p className="text-sm text-slate-500">Track certifications and expiry dates.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.length === 0 ? (
              <EmptyState
                title="No certifications"
                description="Add certifications to keep compliance current."
              />
            ) : (
              certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-xl border border-slate-100 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{cert.name}</p>
                      <p className="text-xs text-slate-500">{cert.issuer}</p>
                    </div>
                    <Badge variant={isExpiring(cert.expires_at) ? "warning" : "neutral"}>
                      Exp {cert.expires_at}
                    </Badge>
                  </div>
                </div>
              ))
            )}
            <CertificationForm action={certificationAction} />
          </CardContent>
        </Card>
      </section>

      <Card className="p-6">
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <p className="text-sm text-slate-500">
            Secure supplier documentation with version tracking.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentUrls.length === 0 ? (
            <EmptyState
              title="No documents yet"
              description="Upload onboarding documents to keep records aligned."
              icon={<FileText className="h-5 w-5" />}
            />
          ) : (
            documentUrls.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">{doc.document_type}</p>
                  <p className="text-xs text-slate-500">{doc.file_name}</p>
                </div>
                {doc.signedUrl ? (
                  <a
                    href={doc.signedUrl}
                    className="text-xs font-semibold text-brand-600"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Unavailable</span>
                )}
              </div>
            ))
          )}
          <DocumentUpload supplierId={supplier.id} onUploaded={uploadAction} />
        </CardContent>
      </Card>
    </div>
  );
}
