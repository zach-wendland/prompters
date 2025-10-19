**COMPANY ANALYZER**

You are an AI assistant specialized in investigative corporate research and technical analysis. When given only a company name or website, you will conduct a comprehensive, step-by-step inquiry using all available public data sources, including advanced search operators on Google, Bing, LinkedIn, Crunchbase, official filings, and press releases.

Your analysis must be structured and deeply analytical, including but not limited to:
	•	Corporate Identity & Legal Structure
	•	Leadership & Ownership
	•	Core Products, Technologies, and Services
	•	Revenue Streams & Business Model Architecture
	•	Market Positioning, Competitive Landscape, and Differentiators
	•	Partnerships, Investors, and Supply Chain Indicators
	•	Recent Events, Legal Filings, and Strategic Moves
	•	Financials (Publicly Available Data Only)
	•	Cybersecurity Exposure, Technical Infrastructure, and Domains
	•	Emerging Risks, Strategic Flags, and Anomalies

Think like a forensic analyst and investigative researcher. Infer patterns, triangulate across sources, and flag any inconsistencies or notable gaps.


---

**DMCA TAKEDOWNS & LINKGUARD PRODUCT SPEC**

Draft a detailed product requirements document for a dual-module SaaS platform that helps independent creators protect revenue through rapid DMCA enforcement and affiliate link integrity.

### Context
- Customers: YouTubers, bloggers, TikTok storefront operators, and creators relying on affiliate platforms (LTK, ShopMy, Amazon Associates).
- Pain points: marketplace image theft, keyword spam, and affiliate extensions that overwrite last-click attribution.
- Pricing target: $19–$49/month subscription with an optional percentage of recovered revenue.
- Constraint: operate inside platform policy grey areas with rigorous legal and privacy compliance.

### Product Pillars
1. **DMCA Takedowns MVP**
   - Marketplace scanning: keyword/image detection, prioritised candidate queue, and workflow triage.
   - Evidence capture: source URL logging, automated screenshots, file hashing, and tamper-proof audit trails.
   - One-click DMCA notice templates tailored per marketplace; include Pixsy-style auto-draft notices for retention and faster follow-through.
   - Status tracker: submission history, platform responses, deadlines, and follow-up reminders.
   - Metrics: resolution rate, average takedown time, recovered asset value.

2. **LinkGuard Affiliate Watchdog**
   - Real-time verification: browser/mobile extension that inspects outbound affiliate links, confirms correct parameters, and alerts on discrepancies.
   - Hijack detection: last-click cookie override monitoring, coupon/shopping extension interference signals, and configurable threshold alerts.
   - Automatic remediation: snapshot proof (URL, headers, cookies, DOM capture), switch to creator-owned parameters when policy permits, and log manual override options when not allowed.
   - Dispute automation: generate evidence packets, recommended outreach scripts, and submission-ready forms for each affiliate network.
   - Compliance: maintain policy matrices per platform, highlight restricted actions, and store consent/audit records.

### Success Criteria
- Reduce manual takedown processing time by 70% and affiliate revenue leakage by 30% within three months of adoption.
- Provide exportable evidence bundles acceptable to major marketplaces and affiliate networks.
- Maintain SOC 2-ready logging, GDPR-compliant data handling, and configurable retention schedules.

### Future Enhancements
- Machine learning prioritisation for infringement severity.
- CRM integrations for dispute tracking.
- Revenue analytics tying recovered earnings to subscription ROI.

