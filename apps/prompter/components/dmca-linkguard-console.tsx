"use client";

import { useMemo, useState } from "react";

type Candidate = {
  id: string;
  marketplace: string;
  keyword: string;
  severity: "high" | "medium" | "low";
  matches: number;
  lastSeen: string;
  status: "queued" | "in-progress" | "resolved";
};

type EvidenceItem = {
  id: string;
  label: string;
  url: string;
  hash: string;
  capturedAt: string;
};

type DisputePacket = {
  network: string;
  violations: string[];
  proof: string;
  status: "ready" | "draft" | "submitted";
};

const candidateQueue: Candidate[] = [
  {
    id: "PX-9927",
    marketplace: "Etsy",
    keyword: "hand-painted galaxy poster",
    severity: "high",
    matches: 6,
    lastSeen: "7 minutes ago",
    status: "queued",
  },
  {
    id: "PX-9924",
    marketplace: "Redbubble",
    keyword: "creator handle",
    severity: "medium",
    matches: 4,
    lastSeen: "22 minutes ago",
    status: "in-progress",
  },
  {
    id: "PX-9919",
    marketplace: "Amazon Merch",
    keyword: "infringing store name",
    severity: "high",
    matches: 3,
    lastSeen: "1 hour ago",
    status: "queued",
  },
  {
    id: "PX-9913",
    marketplace: "eBay",
    keyword: "watermarked print",
    severity: "low",
    matches: 8,
    lastSeen: "2 hours ago",
    status: "resolved",
  },
];

const evidenceBundles: Record<string, EvidenceItem[]> = {
  "PX-9927": [
    {
      id: "EV-472",
      label: "Listing URL",
      url: "https://etsy.com/listing/galaxy-print",
      hash: "fd4c1b3e",
      capturedAt: "2024-05-12 14:06 UTC",
    },
    {
      id: "EV-473",
      label: "Screenshot",
      url: "s3://proofs/px-9927/screenshot.png",
      hash: "a9e2d77f",
      capturedAt: "2024-05-12 14:07 UTC",
    },
    {
      id: "EV-474",
      label: "SHA256 Hash",
      url: "artifact",
      hash: "3f44f5b0e6c912bd",
      capturedAt: "2024-05-12 14:08 UTC",
    },
  ],
  "PX-9924": [
    {
      id: "EV-461",
      label: "Listing URL",
      url: "https://redbubble.com/shop/creator-handle",
      hash: "ff21d91a",
      capturedAt: "2024-05-12 13:32 UTC",
    },
    {
      id: "EV-462",
      label: "Coupon Trace",
      url: "extension-capture.json",
      hash: "2cd1a0f9",
      capturedAt: "2024-05-12 13:33 UTC",
    },
  ],
  "PX-9919": [
    {
      id: "EV-433",
      label: "Listing URL",
      url: "https://amazon.com/dp/B0XYZ",
      hash: "0be92ad3",
      capturedAt: "2024-05-12 12:58 UTC",
    },
    {
      id: "EV-434",
      label: "Auto Screenshot",
      url: "s3://proofs/px-9919/screenshot.png",
      hash: "4d882cb1",
      capturedAt: "2024-05-12 12:59 UTC",
    },
  ],
};

const dmcaTemplates = [
  {
    marketplace: "Etsy",
    sla: "Response target: 24h",
    policyNotes: "Requires registered copyright number and sworn statement.",
  },
  {
    marketplace: "Redbubble",
    sla: "Response target: 36h",
    policyNotes: "Accepts evidence bundles with SHA256 signature.",
  },
  {
    marketplace: "Amazon Merch",
    sla: "Response target: 48h",
    policyNotes: "Mandates proof of original design ownership and seller ID.",
  },
  {
    marketplace: "eBay",
    sla: "Response target: 24h",
    policyNotes: "Supports templated CSV uploads for batch submissions.",
  },
];

const affiliateEvents = [
  {
    id: "LK-3381",
    publisher: "CreatorShop | checkout",
    issue: "Coupon extension override detected",
    action: "Parameters restored to creator defaults",
    timestamp: "2024-05-12 14:10 UTC",
  },
  {
    id: "LK-3379",
    publisher: "YouTube merch shelf",
    issue: "Missing tag detected",
    action: "Auto-drafted dispute packet for LTK",
    timestamp: "2024-05-12 13:54 UTC",
  },
  {
    id: "LK-3374",
    publisher: "ShopMy storefront",
    issue: "Expired signature",
    action: "Flagged for manual override",
    timestamp: "2024-05-12 13:21 UTC",
  },
];

const disputePackets: DisputePacket[] = [
  {
    network: "Amazon Associates",
    violations: [
      "Last-click hijack from CouponWave",
      "Missing disclosure badge detected",
    ],
    proof: "Headers, cookie diff, DOM snapshot",
    status: "ready",
  },
  {
    network: "LTK",
    violations: ["Unauthorized link parameter mutation"],
    proof: "Extension event log, screenshot",
    status: "draft",
  },
  {
    network: "ShopMy",
    violations: ["Signature expired", "Affiliate ID mismatch"],
    proof: "Har log, session replay clip",
    status: "submitted",
  },
];

const complianceMatrix = [
  {
    platform: "Amazon",
    allowed: "Auto-restore parameters, evidence logging",
    restricted: "No cookie deletion or session resets",
  },
  {
    platform: "YouTube",
    allowed: "Outbound link monitoring, disclosure prompts",
    restricted: "No auto-injection inside descriptions",
  },
  {
    platform: "LTK",
    allowed: "Parameter verification, dispute drafting",
    restricted: "Creator opt-in required for auto-fix",
  },
];

export function DmcaLinkguardConsole() {
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidateQueue[0].id);
  const [autoRemediation, setAutoRemediation] = useState(true);
  const [liveMonitoring, setLiveMonitoring] = useState(true);

  const selectedCandidate = useMemo(() => {
    return candidateQueue.find((candidate) => candidate.id === selectedCandidateId) ?? candidateQueue[0];
  }, [selectedCandidateId]);

  const currentEvidence = evidenceBundles[selectedCandidate.id] ?? [];

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-teal/30 bg-gunmetal/70 p-6 shadow-neon">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal">Module 01</p>
            <h2 className="mt-1 text-2xl font-orbitron text-steel">DMCA Takedowns Command Center</h2>
            <p className="mt-2 max-w-2xl text-sm text-steel/80">
              Monitor infringement across marketplaces, triage candidates, and dispatch compliant takedown notices with forensic-grade evidence bundles.
            </p>
          </div>
          <div className="rounded-xl border border-teal/40 bg-charcoal/70 px-4 py-3 text-xs text-steel/70">
            Queue velocity <span className="font-semibold text-teal">12/hr</span> • Avg resolution <span className="font-semibold text-teal">18h</span>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Candidate Queue</h3>
            <div className="space-y-3">
              {candidateQueue.map((candidate) => {
                const isActive = candidate.id === selectedCandidate.id;
                return (
                  <button
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className={`w-full rounded-xl border bg-charcoal/60 p-4 text-left transition hover:border-aqua/50 hover:bg-charcoal/80 ${
                      isActive ? "border-aqua/70 shadow-neon" : "border-teal/20"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-steel/70">
                      <span>{candidate.id}</span>
                      <span className="uppercase tracking-[0.25em] text-aqua/70">{candidate.marketplace}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-steel">{candidate.keyword}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-steel/60">
                      <span>
                        Severity: <span className="font-medium text-teal">{candidate.severity}</span>
                      </span>
                      <span>
                        Matches: <span className="font-medium text-teal">{candidate.matches}</span>
                      </span>
                      <span>{candidate.lastSeen}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-teal/30 bg-charcoal/60 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Evidence Locker</h3>
                <p className="text-xs text-steel/60">Tamper-proof bundle generated automatically.</p>
              </div>
              <div className="mt-4 space-y-3">
                {currentEvidence.map((item) => (
                  <div key={item.id} className="rounded-lg border border-teal/20 bg-gunmetal/60 p-3 text-xs text-steel/70">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-teal">{item.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-aqua/70">{item.capturedAt}</span>
                    </div>
                    <p className="mt-2 break-all text-[11px] text-steel/80">{item.url}</p>
                    <p className="mt-1 text-[10px] text-steel/60">Hash: {item.hash}</p>
                  </div>
                ))}
                {currentEvidence.length === 0 && (
                  <p className="text-xs text-steel/60">No evidence captured yet for this candidate.</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-teal/30 bg-charcoal/60 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">DMCA Templates</h3>
                <ul className="mt-3 space-y-3 text-xs text-steel/70">
                  {dmcaTemplates.map((template) => (
                    <li
                      key={template.marketplace}
                      className="rounded-lg border border-teal/20 bg-gunmetal/60 p-3"
                    >
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-aqua/70">
                        <span>{template.marketplace}</span>
                        <span>{template.sla}</span>
                      </div>
                      <p className="mt-2 text-xs text-steel/70">{template.policyNotes}</p>
                      <button className="mt-3 inline-flex items-center gap-2 rounded-md border border-aqua/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-aqua transition hover:border-aqua hover:text-teal">
                        Auto-draft notice
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-teal/30 bg-charcoal/60 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Status Tracker</h3>
                <ol className="mt-3 space-y-4 border-l border-aqua/30 pl-5 text-xs text-steel/70">
                  <li>
                    <p className="font-semibold text-teal">Submission queued</p>
                    <p className="text-[11px] text-steel/60">Auto-fill forms with creator credentials and notarized statement.</p>
                  </li>
                  <li>
                    <p className="font-semibold text-teal">Platform response pending</p>
                    <p className="text-[11px] text-steel/60">Reminder scheduled in 12h with escalation template.</p>
                  </li>
                  <li>
                    <p className="font-semibold text-teal">Compliance verification</p>
                    <p className="text-[11px] text-steel/60">Evidence bundle exported and archived to SOC 2 logbook.</p>
                  </li>
                </ol>
                <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.25em] text-aqua/80">
                  <div className="rounded-lg border border-teal/20 bg-gunmetal/60 p-3 text-center">
                    Resolution rate
                    <p className="mt-1 text-lg font-semibold text-teal">92%</p>
                  </div>
                  <div className="rounded-lg border border-teal/20 bg-gunmetal/60 p-3 text-center">
                    Avg takedown time
                    <p className="mt-1 text-lg font-semibold text-teal">18h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-aqua/40 bg-gunmetal/70 p-6 shadow-neon">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-aqua">Module 02</p>
            <h2 className="mt-1 text-2xl font-orbitron text-steel">LinkGuard Affiliate Watchdog</h2>
            <p className="mt-2 max-w-2xl text-sm text-steel/80">
              Validate outbound links, neutralize hijacks in real time, and ship dispute packets with the policy context each network expects.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-steel/70 md:flex-row md:items-center md:gap-4">
            <Toggle
              label="Live monitoring"
              active={liveMonitoring}
              onToggle={() => setLiveMonitoring((value) => !value)}
            />
            <Toggle
              label="Auto-remediation"
              active={autoRemediation}
              onToggle={() => setAutoRemediation((value) => !value)}
            />
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-aqua/30 bg-charcoal/60 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Real-time events</h3>
                <p className="text-xs text-steel/60">
                  {liveMonitoring ? "Streaming telemetry from browser + mobile surfaces." : "Monitoring paused by operator."}
                </p>
              </div>
              <ul className="mt-4 space-y-3 text-xs text-steel/70">
                {affiliateEvents.map((event) => (
                  <li key={event.id} className="rounded-lg border border-aqua/30 bg-gunmetal/60 p-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-aqua/70">
                      <span>{event.publisher}</span>
                      <span>{event.timestamp}</span>
                    </div>
                    <p className="mt-2 text-xs text-steel/80">{event.issue}</p>
                    <p className="mt-1 text-[11px] text-teal">{event.action}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-aqua/30 bg-charcoal/60 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Dispute packets</h3>
              <div className="mt-3 space-y-3 text-xs text-steel/70">
                {disputePackets.map((packet) => (
                  <div key={packet.network} className="rounded-lg border border-aqua/20 bg-gunmetal/60 p-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-aqua/70">
                      <span>{packet.network}</span>
                      <StatusBadge status={packet.status} />
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[11px] text-steel/80">
                      {packet.violations.map((violation) => (
                        <li key={violation}>{violation}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[11px] text-teal">Proof bundle: {packet.proof}</p>
                    <button className="mt-3 inline-flex items-center gap-2 rounded-md border border-aqua/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-aqua transition hover:border-aqua hover:text-teal">
                      Generate outreach kit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-aqua/30 bg-charcoal/60 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Compliance matrix</h3>
              <table className="mt-3 w-full table-fixed text-left text-xs text-steel/70">
                <thead className="text-[11px] uppercase tracking-[0.25em] text-aqua/70">
                  <tr>
                    <th className="pb-2">Platform</th>
                    <th className="pb-2">Allowed</th>
                    <th className="pb-2">Restricted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aqua/20">
                  {complianceMatrix.map((entry) => (
                    <tr key={entry.platform} className="align-top">
                      <td className="py-3 text-sm text-steel">{entry.platform}</td>
                      <td className="py-3 pr-3 text-xs text-steel/70">{entry.allowed}</td>
                      <td className="py-3 text-xs text-steel/70">{entry.restricted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-aqua/30 bg-charcoal/60 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-aqua/80">Impact dashboard</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 text-[10px] uppercase tracking-[0.25em] text-aqua/80 sm:grid-cols-2">
                <div className="rounded-lg border border-aqua/20 bg-gunmetal/60 p-4 text-center">
                  Recovered revenue (30d)
                  <p className="mt-1 text-2xl font-semibold text-teal">$18,420</p>
                </div>
                <div className="rounded-lg border border-aqua/20 bg-gunmetal/60 p-4 text-center">
                  Active disputes
                  <p className="mt-1 text-2xl font-semibold text-teal">9</p>
                </div>
                <div className="rounded-lg border border-aqua/20 bg-gunmetal/60 p-4 text-center">
                  Extensions neutralized
                  <p className="mt-1 text-2xl font-semibold text-teal">27</p>
                </div>
                <div className="rounded-lg border border-aqua/20 bg-gunmetal/60 p-4 text-center">
                  Compliance score
                  <p className="mt-1 text-2xl font-semibold text-teal">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Toggle({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-3 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] transition ${
        active ? "border-teal/60 bg-teal/10 text-teal" : "border-aqua/30 bg-charcoal/60 text-steel/60"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full border ${
          active ? "border-teal bg-teal" : "border-aqua/40 bg-transparent"
        }`}
      />
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: DisputePacket["status"] }) {
  const styles: Record<DisputePacket["status"], string> = {
    ready: "border-teal/60 text-teal",
    draft: "border-steel/40 text-steel/60",
    submitted: "border-aqua/60 text-aqua",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}
