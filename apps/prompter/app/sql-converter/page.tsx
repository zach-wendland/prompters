import { SqlTranslatorForm } from "@/components/sql-translator-form";
import Link from "next/link";

export const metadata = {
  title: "SQL Syntax Converter • Prompter",
};

export default function SqlConverterPage() {
  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-teal transition hover:text-aqua">
        <span aria-hidden>←</span>
        Back to modules
      </Link>
      <SqlTranslatorForm />
    </div>
  );
}
