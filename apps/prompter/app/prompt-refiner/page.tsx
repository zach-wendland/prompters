import { PromptRefinerForm } from "@/components/prompt-refiner-form";
import Link from "next/link";

export const metadata = {
  title: "Prompt Refiner • Prompter",
};

export default function PromptRefinerPage() {
  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-teal transition hover:text-aqua">
        <span aria-hidden>←</span>
        Back to modules
      </Link>
      <PromptRefinerForm />
    </div>
  );
}
