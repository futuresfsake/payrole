# TDD-exports: Government, bank, and GL file generators

| | |
|---|---|
| Story/FR | US-401…US-405, US-407 / FR-401…FR-405 |
| Status | Draft |
| ADRs | 001, 003 |

## 1. Problem and scope
Generate files customers upload to SSS, PhilHealth, Pag-IBIG, BIR, banks, and accounting. Formats are external and change (GAP-07, GAP-08). Out of scope: submission (ADR-003).

## 2. Design

### 2.1 Exporter interface
```ts
interface Exporter<TParams> {
  id: string;                    // e.g. "bir.1604c.alphalist"
  templateVersion: string;       // e.g. "2026.1"
  sourceNote: string;            // spec/circular reference, date retrieved
  validateParams(p): Result;
  collect(ctx, p): Promise<Dataset>;  // read model from finalized runs only
  render(dataset): { filename, mime, bytes, checksum, rowCount, controlTotals };
  selfCheck(output): Issue[];    // format-level validation
}
```
Registry keyed by `id + templateVersion + effectivity`. Tenants pick the version in force on the filing date.

### 2.2 Data source
Only **finalized** runs (or explicit "preview" watermark for drafts, never downloadable as official). Reads from immutable `payroll_result`, so regenerating a file for the same period yields identical bytes (determinism).

### 2.3 Export job
`export_job(id, tenant_id, exporter_id, template_version, params, status, file_key, checksum, control_totals, requested_by, purpose, expires_at)`. Async for > 1,000 rows. Output in object storage (SSE), served via short-lived signed URL (5 min), file auto-deleted after 30 days.

### 2.4 Control totals and reconciliation
Each file reports record count and amount totals; the UI shows reconciliation against the payroll register (e.g., SSS EE+ER total = Σ payslip lines + employer cost lines). Mismatch blocks download with explanation.

### 2.5 Exporter catalogue (planned)
| Exporter | Notes |
|---|---|
| sss.contributions | Monthly collection list per SSS spec; employer ID, SS numbers, MSC, EE/ER/EC |
| philhealth.remittance | Per RF-1/EPRS spec |
| pagibig.mcrf | Membership contribution remittance format |
| bir.1601c.data | Figures for 1601-C worksheet |
| bir.1604c.alphalist | Data file for BIR alphalist validation module |
| bir.2316 | PDF per employee, batch ZIP, password per recipient optional |
| bank.generic.csv | M3 |
| bank.<bank>.v1 | Top banks M4 (BDO, BPI, Metrobank first pending specs) |
| gl.journal.csv | Account mapping per tenant, balanced debits/credits check |
| dole.13thmonth | Per DOLE form, VERIFY |

### 2.6 Template maintenance
Each exporter has a fixtures folder with agency sample files and expected output; a "spec change" checklist; owner subscribes to agency announcements; quarterly review in [workflows](../../07-process/workflows.md) rule-set cadence.

### 2.7 PDF generation (2316, payslips)
Server-side render from HTML template; fonts embedded; PDF/A optional; watermark `DRAFT` for non-final. Rendering worker isolated (no network egress) to limit SSRF risk.

## 3. Security and privacy
Permission `export:<type>` + purpose + audit; exports containing government IDs require step-up auth. Filenames contain no PII (use run id/period). CSV cells sanitised against formula injection where the format permits. Signed URL single-use option. Download events audited.

## 4. Failure modes
Spec mismatch discovered at agency: file flagged `rejected_by_agency` by user, versions pinned, hotfix template version released, regeneration preserves the old file. Rendering failure retried 3×, then error with correlation id. Large 2316 batches chunked and zipped.

## 5. Test plan
Contract tests against agency validators/sample files where available; golden-file byte comparisons; control-total reconciliation tests; encoding tests (UTF-8 vs required ANSI, Ñ handling, fixed-width padding); negative: draft run export blocked.

## 6. Rollout
Generic bank CSV in M3 (parallel run), each government exporter validated with the customer's real submission portal in M4 before marking Verified in the statutory matrix.

## 7. Open questions
GAP-07 bank specs, GAP-08 agency formats, whether to offer eSignature-ready 2316 (BIR acceptance of electronic 2316 to verify).
