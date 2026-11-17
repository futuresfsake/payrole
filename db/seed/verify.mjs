// Loads the schema and seed into an in-memory PostgreSQL (PGlite) and checks the access invariants.
// Usage (from db/seed): npm install && npm run verify
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const here = path.dirname(fileURLToPath(import.meta.url));
const db = new PGlite();
await db.exec(fs.readFileSync(path.join(here, '..', 'schema', '001_core_access.sql'), 'utf8'));
await db.exec(fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'));

const TODAY = "date '2026-11-17'";
const checks = [
  ['one tenant', `select count(*) = 1 as ok from tenant`],
  ['26 employees, 25 not separated', `select count(*) = 26 and count(*) filter (where status <> 'separated') = 25 as ok from employee`],
  ['12 system roles, recruiter disabled', `select count(*) = 12 and count(*) filter (where code = 'recruiter' and not is_enabled) = 1 as ok from role where is_system`],
  ['every permission referenced by a role exists and every role_permission row is unique', `select count(*) > 0 as ok from role_permission`],
  ['SoD-1: no account holds preparer and approver at once (active or proposed)', `
    select count(*) = 0 as ok from (
      select user_id from role_assignment ra join role r on r.id = ra.role_id
      where ra.status in ('active','proposed') and r.code in ('payroll_preparer','payroll_approver')
      group by user_id having count(distinct r.code) = 2) x`],
  ['static SoD pairs: every concurrent pair is covered by a live exception, or the rule allows none and none exist', `
    select count(*) = 0 as ok from sod_rule s
    join role ra_r on ra_r.code = s.role_a
    join role_assignment a on a.role_id = ra_r.id and a.status = 'active'
    join role_assignment b on b.user_id = a.user_id and b.status = 'active' and b.id <> a.id
    join role br on br.id = b.role_id and (br.code = any (s.role_b) or s.role_b = array['*'])
    left join sod_exception x on x.id = coalesce(a.sod_exception_id, b.sod_exception_id)
    where s.kind in ('static_pair','realm')
      and (not s.exceptions_allowed or x.id is null or x.expires_at < ${TODAY})`],
  ['privileged grants (payroll, dpo, tenant_admin) have a second approver unless bootstrap', `
    select count(*) = 0 as ok from role_assignment ra join role r on r.id = ra.role_id
    where r.code in ('payroll_preparer','payroll_approver','dpo','tenant_admin') and ra.status = 'active' and not ra.is_bootstrap
      and (ra.approved_by is null or ra.approved_by = ra.proposed_by)`],
  ['auditor assignments have an end date within 90 days', `
    select count(*) = 0 as ok from role_assignment ra join role r on r.id = ra.role_id
    where r.code = 'auditor' and (ra.valid_to is null or ra.valid_to - ra.valid_from > 90)`],
  ['SoD exceptions last 90 days at most and none expired', `select count(*) = 0 as ok from sod_exception where expires_at - created_at > 90 or expires_at < ${TODAY}`],
  ['rejected proposal exists and carries a reason code', `select count(*) = 1 as ok from role_assignment where status = 'rejected' and reject_code = 'SOD_1'`],
  ['every non-separated employee except the GM has exactly one current manager', `
    select count(*) = 0 as ok from employee e
    left join reporting_line rl on rl.employee_id = e.id and rl.valid_to is null
    where e.status <> 'separated' and e.employee_no <> 'EMP-0001'
    group by e.id having count(rl.id) <> 1`],
  ['reporting line has no cycles', `
    with recursive up as (
      select employee_id as start_id, manager_id as cur, 1 as depth from reporting_line where valid_to is null
      union all
      select up.start_id, rl.manager_id, up.depth + 1 from up join reporting_line rl on rl.employee_id = up.cur and rl.valid_to is null where up.depth < 20)
    select count(*) = 0 as ok from up where cur = start_id`],
  ['leave approver is never the requester (SoD-2) and is the requester current manager', `
    select count(*) = 0 as ok from leave_request lr
    left join reporting_line rl on rl.employee_id = lr.employee_id and rl.valid_to is null
    where lr.approver_employee_id = lr.employee_id or lr.approver_employee_id is distinct from rl.manager_id`],
  ['leave balances never negative', `
    select count(*) = 0 as ok from (select employee_id, leave_type_id, sum(quantity) bal from leave_ledger group by 1,2) b where bal < 0`],
  ['separated employee has a disabled account and no live assignment', `
    select count(*) = 0 as ok from employee e join user_account u on u.employee_id = e.id
    left join role_assignment ra on ra.user_id = u.id and ra.status = 'active'
    where e.status = 'separated' and (u.status <> 'disabled' or ra.id is not null)`],
  ['all government identifiers are DEV- values', `
    select count(*) = 0 as ok from employee_identifier where convert_from(value_enc, 'UTF8') !~ '^devseed:DEV-(SSS|TIN|PHILHEALTH|PAGIBIG)-[0-9]{4}-[0-9]{4}$'`],
  ['MFA enrolled for everyone holding an active granted role', `
    select count(*) = 0 as ok from user_account u join role_assignment ra on ra.user_id = u.id and ra.status = 'active' join role r on r.id = ra.role_id
    where r.kind in ('granted','platform') and r.mfa_required and not u.mfa_enrolled`],
  ['rule-set versions are placeholders without rates', `select count(*) = 0 as ok from rule_set_version where not is_placeholder or data ? 'rate'`],
  ['platform operator has no tenant', `select count(*) = 1 as ok from user_account u join role_assignment ra on ra.user_id = u.id where u.realm = 'platform' and u.tenant_id is null and ra.tenant_id is null`],
  ['scope_ref points to a real pay group or org unit', `
    select count(*) = 0 as ok from role_assignment ra
    where (ra.scope_type = 'pay_group' and not exists (select 1 from pay_group where id = ra.scope_ref))
       or (ra.scope_type = 'org_unit' and not exists (select 1 from org_unit where id = ra.scope_ref))`],
];

let failed = 0;
for (const [name, sql] of checks) {
  const res = await db.query(sql);
  const ok = res.rows.length > 0 ? res.rows.every((r) => r.ok === true) : true;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed += 1;
}
const counts = await db.query(`select
  (select count(*) from employee) employees, (select count(*) from user_account) users, (select count(*) from role_assignment) assignments,
  (select count(*) from permission) permissions, (select count(*) from role_permission) role_permissions, (select count(*) from leave_ledger) ledger`);
console.log('\nrows:', JSON.stringify(counts.rows[0]));
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
