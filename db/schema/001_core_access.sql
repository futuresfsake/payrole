-- PayRole logical schema subset used by the seed data.
-- Source of truth for the full model: docs/03-design/data-model.md.
-- This file is a development aid until the M0 migrations exist. It omits row-level security
-- policies, triggers and encryption wrappers, which come with the real migrations (ADR-004, ADR-007).
-- Conventions: UUID primary keys (v7-shaped in seed), tenant_id on every tenant table, money numeric(19,4).

create table tenant (
  id uuid primary key,
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Manila',
  currency char(3) not null default 'PHP',
  created_at timestamptz not null default now()
);

create table org_unit (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  parent_id uuid references org_unit(id),
  code text not null,
  name text not null,
  unique (tenant_id, code)
);

create table position (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  title text not null,
  grade text,
  unique (tenant_id, title)
);

create table employee (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_no text not null,
  given_name text not null,
  family_name text not null,
  birth_date date not null,
  sex text check (sex in ('F','M')),
  civil_status text,
  personal_email text,
  mobile text,
  hired_on date not null,
  separated_on date,
  status text not null check (status in ('active','probationary','separated')),
  unique (tenant_id, employee_no)
);

create table employment (            -- effective-dated (ADR-008)
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  org_unit_id uuid not null references org_unit(id),
  position_id uuid not null references position(id),
  pay_group_id uuid,
  employment_type text not null check (employment_type in ('regular','probationary','contractual','project')),
  valid_from date not null,
  valid_to date,
  contract_end date
);

create table reporting_line (        -- effective-dated; drives team scope
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  manager_id uuid not null references employee(id),
  valid_from date not null,
  valid_to date,
  check (employee_id <> manager_id)
);

create table compensation (          -- encrypted at rest in production (ADR-007); clear in dev seed
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  rate_amount numeric(19,4) not null,
  rate_type text not null check (rate_type in ('monthly','daily','hourly')),
  working_days_factor numeric(6,2) not null,
  is_mwe boolean not null default false,
  tax_status text,
  valid_from date not null,
  valid_to date
);

create table employee_identifier (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  type text not null check (type in ('SSS','TIN','PHILHEALTH','PAGIBIG')),
  value_enc bytea not null,          -- dev seed: 'devseed:' prefix, never a real number
  value_bidx bytea not null,         -- sha256 of the value, stands in for the HMAC blind index
  last4 char(4) not null,
  unique (tenant_id, type, value_bidx)
);

-- Identity and access (ADR-013) -------------------------------------------------------------

create table user_account (
  id uuid primary key,
  tenant_id uuid references tenant(id),      -- null only for the platform realm
  realm text not null check (realm in ('tenant','platform')),
  idp_subject text not null unique,
  email text not null unique,
  display_name text not null,
  employee_id uuid references employee(id),
  status text not null check (status in ('active','suspended','disabled')),
  mfa_enrolled boolean not null default false,
  check ((realm = 'platform') = (tenant_id is null))
);

create table role (
  id uuid primary key,
  tenant_id uuid references tenant(id),      -- null = system role
  code text not null,
  name text not null,
  kind text not null check (kind in ('derived','granted','platform','custom')),
  default_scope text not null check (default_scope in ('self','team','org_unit','pay_group','tenant','platform')),
  mfa_required boolean not null,
  is_system boolean not null,
  is_enabled boolean not null default true,
  description text
);
create unique index role_code_uq on role (coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid), code);

create table permission (
  id uuid primary key,
  code text not null unique,                 -- resource:action
  sensitivity text not null check (sensitivity in ('S0','S1','S2','S3','S4')),
  needs_purpose boolean not null default false,
  needs_step_up boolean not null default false,
  description text
);

create table role_permission (
  role_id uuid not null references role(id),
  permission_id uuid not null references permission(id),
  field_mask jsonb,
  primary key (role_id, permission_id)
);

create table sod_rule (
  id uuid primary key,
  code text not null unique,
  kind text not null check (kind in ('static_pair','dynamic','process','realm')),
  role_a text,
  role_b text[],
  exceptions_allowed boolean not null,
  description text not null
);

create table sod_exception (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  rule_code text not null references sod_rule(code),
  approved_by uuid not null references user_account(id),
  reason text not null,
  created_at date not null,
  expires_at date not null,
  check (expires_at - created_at <= 90)
);

create table role_assignment (
  id uuid primary key,
  tenant_id uuid references tenant(id),
  user_id uuid not null references user_account(id),
  role_id uuid not null references role(id),
  scope_type text not null check (scope_type in ('self','team','org_unit','pay_group','tenant','platform')),
  scope_ref uuid,
  valid_from date not null,
  valid_to date,
  proposed_by uuid references user_account(id),
  approved_by uuid references user_account(id),
  reason text not null,
  status text not null check (status in ('proposed','active','ended','rejected')),
  reject_code text,
  is_bootstrap boolean not null default false,   -- first admins, created at tenant provisioning
  sod_exception_id uuid references sod_exception(id),
  check ((scope_type in ('org_unit','pay_group')) = (scope_ref is not null)),
  check (valid_to is null or valid_to >= valid_from)
);

-- Time, leave, payroll set-up --------------------------------------------------------------

create table schedule (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  name text not null,
  start_time time not null,
  end_time time not null,
  rest_days int[] not null,                   -- ISO weekday numbers, 1 = Monday
  break_minutes int not null,
  grace_minutes int not null default 0
);

create table schedule_assignment (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  schedule_id uuid not null references schedule(id),
  valid_from date not null,
  valid_to date
);

create table holiday (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  holiday_date date not null,
  name text not null,
  kind text not null check (kind in ('regular','special_non_working','special_working')),
  is_placeholder boolean not null default true,   -- VERIFY against the proclamation
  unique (tenant_id, holiday_date, name)
);

create table leave_type (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  code text not null,
  name text not null,
  paid boolean not null,
  statutory boolean not null,
  annual_days numeric(7,3),
  needs_attachment_after_days int,
  verify_note text,
  unique (tenant_id, code)
);

create table leave_ledger (          -- append-only
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  leave_type_id uuid not null references leave_type(id),
  entry_type text not null check (entry_type in ('accrual','usage','adjustment','expiry','conversion')),
  quantity numeric(7,3) not null,
  effective_date date not null,
  source_ref text
);

create table leave_request (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  employee_id uuid not null references employee(id),
  leave_type_id uuid not null references leave_type(id),
  start_date date not null,
  end_date date not null,
  days numeric(7,3) not null,
  status text not null check (status in ('pending','approved','rejected','cancelled')),
  approver_employee_id uuid references employee(id),
  filed_on date not null,
  note text,
  check (end_date >= start_date)
);

create table pay_group (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  name text not null,
  frequency text not null check (frequency in ('weekly','semi_monthly','monthly')),
  unique (tenant_id, name)
);

create table pay_period (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  pay_group_id uuid not null references pay_group(id),
  period_start date not null,
  period_end date not null,
  pay_date date not null,
  status text not null check (status in ('closed','open','scheduled')),
  unique (pay_group_id, period_start)
);

create table rule_set (
  id uuid primary key,
  agency text not null,
  type text not null,
  description text not null,
  unique (agency, type)
);

create table rule_set_version (
  id uuid primary key,
  rule_set_id uuid not null references rule_set(id),
  effective_from date not null,
  effective_to date,
  data jsonb not null,
  source_citation text not null,
  is_placeholder boolean not null default true,
  approved_by uuid references user_account(id)
);

create table workflow_definition (
  id uuid primary key,
  tenant_id uuid not null references tenant(id),
  code text not null,
  name text not null,
  steps jsonb not null,
  unique (tenant_id, code)
);

alter table employment add constraint employment_pay_group_fk foreign key (pay_group_id) references pay_group(id);
