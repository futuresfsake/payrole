/** problem+json as returned by the API, and the plain-words messages for authorization reason codes. */
export type ReasonCode =
  | "NO_PERMISSION_IN_SCOPE"
  | "STEP_UP_REQUIRED"
  | "PURPOSE_REQUIRED"
  | "SOD_1"
  | "SOD_2"
  | "SOD_3"
  | "SOD_4"
  | "SOD_5"
  | "SOD_6"
  | "SOD_7"
  | "ASSIGNMENT_EXPIRED"
  | "ACCOUNT_SUSPENDED"
  | "TENANT_SUSPENDED";

export interface Problem {
  type: string;
  title: string;
  status: number;
  detail?: string;
  correlationId: string;
  reasonCode?: ReasonCode;
}

export interface ReasonMessage {
  title: string;
  body: string;
  /** SoD-1, 2, 4 and 7 can never be overridden; 5 and 6 can by recorded exception. */
  overridable: boolean;
}

export const REASON_MESSAGES: Record<ReasonCode, ReasonMessage> = {
  NO_PERMISSION_IN_SCOPE: {
    title: "No permission in this scope",
    body: "Your roles don't include this action for this record. Ask a company admin to propose a role assignment if you need it.",
    overridable: false,
  },
  STEP_UP_REQUIRED: {
    title: "Confirm it's you first",
    body: "This action needs a fresh passkey or authenticator check. Confirm, then try again.",
    overridable: false,
  },
  PURPOSE_REQUIRED: {
    title: "Say why you need this",
    body: "Choose a reason. It is saved in the audit log with your name.",
    overridable: false,
  },
  SOD_1: {
    title: "You prepared this run",
    body: "The person who prepares a payroll run can't also approve it. Rule SoD-1. No exception is possible.",
    overridable: false,
  },
  SOD_2: {
    title: "You can't approve your own request",
    body: "Requests you file go to someone else. Rule SoD-2. No exception is possible.",
    overridable: false,
  },
  SOD_3: {
    title: "A second person must approve this",
    body: "Roles for payroll, privacy or administration need a second approver who isn't the proposer. Rule SoD-3.",
    overridable: false,
  },
  SOD_4: {
    title: "Platform staff can't hold company roles",
    body: "Platform operators reach company data only through break-glass access. Rule SoD-4. No exception is possible.",
    overridable: false,
  },
  SOD_5: {
    title: "Admin and HR or payroll roles clash",
    body: "A tenant admin can't also hold an HR or payroll role unless a second approver records an exception of 90 days at most. Rule SoD-5.",
    overridable: true,
  },
  SOD_6: {
    title: "DPO and tenant admin clash",
    body: "The data protection officer can't also be a tenant admin unless a second approver records an exception of 90 days at most. Rule SoD-6.",
    overridable: true,
  },
  SOD_7: {
    title: "Auditors are read only",
    body: "An auditor can't hold any role that can change data. Rule SoD-7. No exception is possible.",
    overridable: false,
  },
  ASSIGNMENT_EXPIRED: {
    title: "This access has ended",
    body: "Your role assignment passed its end date. Ask a company admin to renew it.",
    overridable: false,
  },
  ACCOUNT_SUSPENDED: {
    title: "This account is suspended",
    body: "Contact your company admin.",
    overridable: false,
  },
  TENANT_SUSPENDED: {
    title: "This company is suspended",
    body: "Contact PayRole support with the reference below.",
    overridable: false,
  },
};

export function describeReason(code: ReasonCode): ReasonMessage {
  return REASON_MESSAGES[code];
}
