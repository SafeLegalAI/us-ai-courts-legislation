---
license: cc-by-4.0
pretty_name: "US legislation on AI in courts, evidence and legal services (SafeLegalAI)"
language:
  - en
size_categories:
  - n<1K
tags:
  - legislation
  - courts
  - evidence
  - unauthorized-practice
  - state-law
  - congress
  - legal
  - law
  - ai-regulation
  - ai-safety
  - ai-governance
  - safelegalai
configs:
  - config_name: bills
    default: true
    data_files:
      - split: train
        path: data/bills.parquet
---

# US legislation on AI in courts, evidence and legal services

**41 state and federal bills and enacted laws (2023–2026) whose operative sections address AI-generated evidence, AI in courts and the judiciary, AI legal services and unauthorized practice, attorneys' AI use, AI-drafted police reports and criminal-justice disclosure, legal aid, or court-record use for AI training — each with status, last action, operative sections and primary text.**

Built 2026-09-08 by [SafeLegalAI](https://safelegalai.com) (Cognesio LLP). Canonical pages: [safelegalai.com/regulation/legislation](https://safelegalai.com/regulation/legislation) · repository, pipeline and issues: [https://github.com/SafeLegalAI/us-ai-courts-legislation](https://github.com/SafeLegalAI/us-ai-courts-legislation) · this mirror: [https://huggingface.co/datasets/safelegalaidata/us-ai-courts-legislation](https://huggingface.co/datasets/safelegalaidata/us-ai-courts-legislation).

| table | rows | one row is |
|---|---|---|
| `bills` | 41 | one bill or enacted law with an in-lane operative section |

Every row carries `source_url`, `fetched_at` and, where the Wayback Machine accepted the page, `archive_url`; `url` links the canonical page on safelegalai.com; `notice` carries the terms below. Full schemas: `schema/`.

One bill or enacted law, one row: `jurisdiction` (US or state code), `session`, `bill_number`, `title`, `lane[]` (evidence · courts-judiciary · legal-services-upl · attorney-ai-use · police-reports-criminal · legal-aid-a2j · court-records-training), `status`, `status_date`, `last_action`, `effective_date`, `operative_sections[]`, a 40–60-word `summary`, `sponsors[]`, `text_url`, `status_url`, `legiscan_bill_id`, provenance.

### `bills` by `jurisdiction`

| value | rows |
|---|---|
| NY | 15 |
| CA | 6 |
| MD | 4 |
| US | 3 |
| VA | 3 |
| LA | 2 |
| WV | 2 |
| UT | 1 |
| RI | 1 |
| KY | 1 |
| OK | 1 |
| DE | 1 |
| WA | 1 |

### `bills` by `status`

| value | rows |
|---|---|
| in-committee | 19 |
| in-force | 10 |
| died | 7 |
| enrolled | 2 |
| introduced | 2 |
| veto-sustained | 1 |

### `bills` by `lane`

| value | rows |
|---|---|
| evidence | 18 |
| courts-judiciary | 17 |
| police-reports-criminal | 14 |
| attorney-ai-use | 8 |
| legal-services-upl | 5 |
| legal-aid-a2j | 3 |

## Method

LegiScan (CC BY 4.0) and Open States (public domain) for discovery and metadata, Congress.gov/govinfo for federal bills, the state legislature's own bill page as `source_url`; NCSL, FPF, MultiState, CDT, Steptoe and AGORA trackers as leads only. Strict lane rule: general AI-regulation bills are excluded unless an operative section addresses courts, evidence, legal services or legal practice. Status is re-checked weekly during sessions.

SafeLegalAI records what courts, regulators, legislatures and vendors' own public pages state; it does not infer, rank or advise. Coding columns are SafeLegalAI's good-faith reading for comparison, not findings about any person or body. Corrections and right of reply: [safelegalai.com/report](https://safelegalai.com/report).

## Licence and notices

Bill texts and statutes are government edicts (public domain — *Georgia v. Public.Resource.Org* (2020)); LegiScan metadata is CC BY 4.0 (attribution: LegiScan LLC); Open States data is public domain. The compilation and coding are **CC BY 4.0** — attribute *SafeLegalAI (safelegalai.com), published by Cognesio LLP*. Code is Apache-2.0.

Provided as is, without warranty. Not legal advice. SafeLegalAI (Cognesio LLP) records what courts, regulators, legislatures and vendors' own public pages state; the linked official documents are the record. Names and marks belong to their owners. Anyone named may reply: https://safelegalai.com/report. Full terms: https://safelegalai.com/disclaimer See `DISCLAIMER.md` and `NOTICE` in this repository.

## Uses

**Suited to:** counting and comparing what the record shows (by court, jurisdiction, date, actor, outcome, status); building watch-lists and alerts from `source_url`/`fetched_at`; grounding retrieval or summarisation on cited primary documents; teaching and library guides that need a dated, sourced list.

**Not suited to:** ranking products, people or courts; inferring prevalence beyond what a court or regulator has itself stated; any use that treats a coding column as a finding of fact or law. Where a row names a person or organisation it does so as they appear in a public document; anyone named may request a correction or right of reply at https://safelegalai.com/report.

## Cite

> SafeLegalAI (Cognesio LLP), "US legislation on AI in courts, evidence and legal services", v0.1.3, 2026-09-08. https://huggingface.co/datasets/safelegalaidata/us-ai-courts-legislation — CC BY 4.0. Canonical: https://safelegalai.com/regulation/legislation

```bibtex
@dataset{safelegalai_us_ai_courts_legislation_0_1_3,
  title        = {US legislation on AI in courts, evidence and legal services},
  author       = {{SafeLegalAI (Cognesio LLP)}},
  year         = {2026},
  version      = {0.1.3},
  url          = {https://safelegalai.com/regulation/legislation},
  note         = {Mirror: https://huggingface.co/datasets/safelegalaidata/us-ai-courts-legislation. Data CC BY 4.0. Built 2026-09-08.}
}
```
