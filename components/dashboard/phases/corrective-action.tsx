"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  userRole: string
  onChange: (record: AuditRecord) => void
}

export function CorrectiveActionPhase({ record, userRole, onChange }: PhaseProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 4: Corrective Action Development</h2>
        <p className="text-sm text-muted-foreground">
          Operator proposes corrective actions addressing root causes. Document controls and accepted residual risks.
        </p>
      </Card>

      <div className="space-y-4">
        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Proposed Corrective Action</h3>
          <Textarea
            placeholder="Describe the specific corrective actions, addressing root causes not symptoms..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Controls Mitigating Risk</h3>
          <Textarea
            placeholder="Document controls that will ensure effective implementation..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Accepted Risks & Residual Risk Rating</h3>
          <Textarea
            placeholder="Identify any accepted risks and provide residual risk rating (High/Medium/Low)..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        {userRole === "responsible-manager" && (
          <Card className="p-6 border border-border space-y-4 bg-blue-50 dark:bg-blue-950">
            <h3 className="font-semibold text-foreground">Responsible Manager Signature</h3>
            <p className="text-sm text-muted-foreground">
              By signing, you accept accountability for corrective action and residual risk.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Digitally</button>
          </Card>
        )}
      </div>
    </div>
  )
}
