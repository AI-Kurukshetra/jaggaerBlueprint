"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validations/auth";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const values = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? "")
    };

    const parsed = signupSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.errors.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setFieldErrors(nextErrors);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password
    });

    if (signUpError) {
      setError(signUpError.message);
      addToast({
        title: "Sign up failed",
        description: signUpError.message,
        variant: "error"
      });
      setIsLoading(false);
      return;
    }

    addToast({
      title: "Account created",
      description: "Welcome to SupplySync AI.",
      variant: "success"
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-600">SupplySync AI</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create your account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Start onboarding suppliers and managing compliance in minutes.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
          <Input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="mt-1"
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
          <Input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            className="mt-1"
          />
          {fieldErrors.password ? (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>
          ) : null}
        </div>
        {error ? (
          <Alert title="Unable to sign up" description={error} variant="error" />
        ) : null}
        <Button type="submit" isLoading={isLoading} className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
        Already have access?{" "}
        <Link className="font-semibold text-brand-600" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
