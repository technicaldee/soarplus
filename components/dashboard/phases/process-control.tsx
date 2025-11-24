"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  userRole: string
  onChange: (record: AuditRecord) => void
}

export function ProcessControlPhase({ record, userRole, onChange }: PhaseProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 5: Process Control & Implementation Plan</h2>
        <p className="text-sm text-muted-foreground">
          Create detailed action plan describing how corrective action will take place, who is responsible, and critical
          factors.
        </p>
      </Card>

      <div className="space-y-4">
        <Card className="p-6 border border-border space-y-4">
          <label className="block text-sm font-medium text-foreground">Description of Corrective Action</label>
          <Textarea
            placeholder="How the final action plan will take place..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Documents/Text Affected by Specific Action
          </label>
          <Textarea
            placeholder="List manuals, procedures, documents affected by this action..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <label className="block text-sm font-medium text-foreground">Personnel Responsible for Completion</label>
          <input
            type="text"
            placeholder="Names and titles of responsible personnel..."
            className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
          />
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <label className="block text-sm font-medium text-foreground">Critical Factors to Mitigate Risks</label>
          <Textarea
            placeholder="Identify critical factors ensuring corrective action mitigates risks..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        {userRole === "director-of-safety" && (
          <Card className="p-6 border border-border space-y-4 bg-green-50 dark:bg-green-950">
            <h3 className="font-semibold text-foreground">Director of Safety Acknowledgement</h3>
            <p className="text-sm text-muted-foreground">Accept the action plan as complete and appropriate.</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Sign & Acknowledge</button>
          </Card>
        )}
      </div>
    </div>
  )
}
