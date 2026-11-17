"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Checkbox, DatePicker, IconButton, Input, MoneyInput, Select, Tabs } from "@/design-system";
import { CatalogueSection, Demo } from "./CatalogueSection";

export function FormsDemo() {
  const [agree, setAgree] = useState(false);
  const [amount, setAmount] = useState<number | null>(125_050);
  return (
    <CatalogueSection id="forms" title="Buttons and form controls" description="Labels are always visible. Control borders are gray-500 (4.8:1). One primary button per view.">
      <Demo title="Button: variants and states">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Approve run</Button>
          <Button>Return to preparer</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary" loading>
            Saving
          </Button>
          <Button variant="primary" disabled>
            Submit for approval
          </Button>
          <Button size="sm">Small</Button>
          <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Add employee</Button>
          <IconButton label="Delete draft">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      </Demo>
      <Demo title="Input, Select, DatePicker, MoneyInput">
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <Input id="demo-name" label="Full name" hint="As on the employee's ID." defaultValue="Villanueva, Ena" />
          <Input id="demo-error" label="Mobile number" error="Enter 11 digits, starting with 09." defaultValue="0917" />
          <Input id="demo-disabled" label="Employee number" disabled defaultValue="EMP-0012" />
          <Input id="demo-readonly" label="Pay group" readOnly defaultValue="Semi-monthly (operations)" />
          <Select
            id="demo-select"
            label="Department"
            placeholder="Choose a department"
            options={[
              { value: "ops", label: "Operations" },
              { value: "fin", label: "Finance" },
            ]}
          />
          <DatePicker id="demo-date" label="Start date" hint="Dates are in Manila time." />
          <MoneyInput id="demo-money" label="Monthly rate" value={amount} onChange={setAmount} />
          <Checkbox id="demo-check" label="I have checked the time records" checked={agree} onCheckedChange={setAgree} hint="Required before you submit." />
        </div>
      </Demo>
      <Demo title="Tabs">
        <Tabs
          label="Role assignment views"
          items={[
            { value: "assignments", label: "Assignments", content: <p>Active assignments appear here.</p> },
            { value: "proposals", label: "Proposals", content: <p>Waiting for a second approver.</p> },
            { value: "exceptions", label: "SoD exceptions", content: <p>Exceptions with their end dates.</p> },
          ]}
        />
      </Demo>
    </CatalogueSection>
  );
}
