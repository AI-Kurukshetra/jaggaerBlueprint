"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import type { ButtonProps } from "@/components/ui/Button";

export default function SubmitButton({
  children,
  isLoading,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} isLoading={isLoading || pending}>
      {children}
    </Button>
  );
}
