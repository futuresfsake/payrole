import { Bell, Database, FormInput, ShieldCheck, Table2 } from "lucide-react";
import { IconButton, SidebarNav, WorkspaceStrip } from "@/design-system";
import { DataDemo } from "./DataDemo";
import { DomainDemo } from "./DomainDemo";
import { FeedbackDemo } from "./FeedbackDemo";
import { FormsDemo } from "./FormsDemo";

export const metadata = { title: "Component catalogue · PayRole" };

const SECTIONS = [
  { id: "forms", label: "Forms and buttons", href: "#forms", icon: FormInput },
  { id: "feedback", label: "Status and states", href: "#feedback", icon: ShieldCheck },
  { id: "data", label: "DataTable", href: "#data", icon: Table2 },
  { id: "domain", label: "Payroll and access", href: "#domain", icon: Database },
];

export default function CataloguePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-12 items-center gap-6 border-b border-line bg-surface px-4 md:px-6">
        <span className="font-semibold">PayRole</span>
        <WorkspaceStrip
          items={[
            { id: "catalogue", label: "Catalogue", href: "/catalogue" },
            { id: "tokens", label: "Tokens", href: "#forms" },
          ]}
          currentId="catalogue"
        />
        <span className="flex-1" />
        <IconButton label="Notifications">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </header>
      <div className="flex flex-1 flex-col md:grid md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-line bg-surface p-3 md:border-b-0 md:border-r md:p-4">
          <SidebarNav scopeText="Design system" items={SECTIONS} currentId="forms" />
        </aside>
        <main className="min-w-0 p-4 md:p-6">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-1 text-2xl font-semibold leading-8">Component catalogue</h1>
            <p className="mb-8 max-w-[68ch] text-muted">Every component with its variants and states. Tokens come from ADR-015. Data here is synthetic.</p>
            <FormsDemo />
            <FeedbackDemo />
            <DataDemo />
            <DomainDemo />
          </div>
        </main>
      </div>
    </div>
  );
}
