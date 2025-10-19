import { DmcaLinkguardConsole } from "@/components/dmca-linkguard-console";
import Link from "next/link";

export const metadata = {
  title: "DMCA & LinkGuard Console • Prompter",
  description: "Operate the dual-module SaaS surface for rapid DMCA enforcement and affiliate link protection.",
};

export default function DmcaLinkguardPage() {
  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-teal transition hover:text-aqua">
        <span aria-hidden>←</span>
        Back to modules
      </Link>
      <DmcaLinkguardConsole />
    </div>
  );
}
