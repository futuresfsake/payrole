# Shell, Auth, Home

## W-01 Login
**Purpose** Sign in. **Roles** all. **Stories** US-001.
```
┌────────────────────────────────────────────┐
│  PayRole                                   │
│  ────────────────────────────────────────  │
│  Sign in to Acme Trading Corp.             │
│                                            │
│  Work email                                │
│  [______________________________]          │
│  Password                                  │
│  [______________________________] <Show>   │
│                                            │
│  [Sign in]      <Use a passkey instead>    │
│  <Forgot password>                         │
│                                            │
│  ────────────────────────────────────────  │
│  Privacy notice · Terms · Help             │
└────────────────────────────────────────────┘
```
**States** invalid creds ("Email or password is incorrect."), locked ("Too many attempts. Try again in 15 minutes or reset your password."), SSO-only tenant (button "Continue with company sign-in" replaces form), session expired (banner "You were signed out after 30 minutes of inactivity.").
**Rules** generic errors; no account enumeration; tenant resolved by subdomain.

## W-02 MFA challenge / enrolment
```
┌──────────────────────────────────────┐
│ Confirm it's you                     │
│ (•) Passkey   ( ) Authenticator code │
│ Code  [ _ _ _ _ _ _ ]                │
│ [Confirm]       <Use a recovery code>│
└──────────────────────────────────────┘
```
Enrolment: QR + manual key, 8 recovery codes shown once with "Download" and "I saved them" checkbox required. Privileged roles cannot skip enrolment.

## W-03 App shell (desktop)
```
┌──────────────────────────────────────────────────────────────────┐
│ Acme Trading Corp.  [Search people, pages… ⌘K]      🔔3  H. Reyes ▾│
├────────────┬─────────────────────────────────────────────────────┤
│ Home       │  Page title                          [Primary action]│
│ My space   │  ───────────────────────────────────────────────────│
│ My team    │                                                     │
│ People     │   content                                           │
│ Time       │                                                     │
│ Leave      │                                                     │
│ Payroll    │                                                     │
│ Reports    │                                                     │
│ Privacy    │                                                     │
│ Settings   │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```
Nav items appear only if permitted. User menu: Profile, Sessions, Language, Sign out. Environment ribbon in staging ("Staging, synthetic data").

## W-04 App shell (mobile ESS)
```
┌────────────────────────┐
│ PayRole          🔔  ☰ │
├────────────────────────┤
│  content               │
├────────────────────────┤
│ Home  Pay  Leave  Me   │
└────────────────────────┘
```

## W-05 Home: Employee
```
Good morning, Ena.                     Tue 15 Nov 2026
─────────────────────────────────────────────────────
Next payday        Fri 30 Nov          [View last payslip]
─────────────────────────────────────────────────────
Leave balance      VL 8.5   SL 5   SIL 3        [File leave]
─────────────────────────────────────────────────────
This week          Mon  Tue  Wed  Thu  Fri
                   8h   8h   ·    ·    ·          <Attendance>
─────────────────────────────────────────────────────
Needs your action  (2)
  Acknowledge: Updated leave policy              [Read]
  Complete: Emergency contact                    [Update]
─────────────────────────────────────────────────────
```
Ruled sections, not cards. Greeting uses first name only. States: no payslip yet ("Your first payslip appears after your first pay date.").

## W-06 Home: Manager (adds block)
```
Waiting for you (4)                         [Open inbox]
  Ena Cruz · Vacation · 20–22 Dec · 3 days        [Approve][Review]
  Marco… Overtime · 2.0 h · 12 Nov                [Approve][Review]
Out this week: 2   Late today: 1   Probation ending (30 days): 1
```

## W-07 Home: HR Admin
```
To do                                      Count
  Probation ends within 30 days             3   >
  Documents expiring within 30 days         5   >
  New hires without government IDs          2   >
  Profile change requests                   4   >
Headcount 212   Joined (30d) 6   Separated (30d) 2
```

## W-08 Home: Payroll Officer
```
Current period: 1–15 Dec      Cut-off Mon 12 Dec      Pay date Fri 16 Dec
Checklist
  [x] Attendance imported (Dec 1–12)
  [ ] Exceptions cleared                 11 open   >
  [ ] Attendance locked
  [ ] Draft run computed
  [ ] Submitted for approval
Upcoming filings: 1601-C due 10 Jan · SSS due per schedule
```

## W-09 Home: Finance / Owner
Payroll cost by month (simple ruled table + one restrained line chart), headcount trend, pending approvals; no decorative charts. Chart colors from the restricted palette plus pattern fills for colour-blind safety.
