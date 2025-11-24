"use client"

import { Card } from "@/components/ui/card"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  userRole: string
  onChange: (record: AuditRecord) => void
}

export function CARAcceptancePhase({ record, userRole, onChange }: PhaseProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 6: Corrective Action Acceptance</h2>
        <p className="text-sm text-muted-foreground">
          Both operator and auditor confirm agreement. Attach documentation and evidence.
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Evidence of Documentation</h3>
          <button className="w-full px-4 py-2 border border-dashed border-border rounded hover:bg-muted">
            + Add Evidence
          </button>
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Evidence of Implementation</h3>
          <button className="w-full px-4 py-2 border border-dashed border-border rounded hover:bg-muted">
            + Add Evidence
          </button>
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Training Records</h3>
          <button className="w-full px-4 py-2 border border-dashed border-border rounded hover:bg-muted">
            + Add Records
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {userRole === "operator" && (
          <Card className="p-6 border border-border space-y-4 bg-blue-50 dark:bg-blue-950">
            <h3 className="font-semibold text-foreground">Operator/Manager Signature</h3>
            <p className="text-sm text-muted-foreground">
              Confirm corrective action is complete and meets company requirements.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign as Operator</button>
          </Card>
        )}

        {userRole === "auditor" && (
          <Card className="p-6 border border-border space-y-4 bg-purple-50 dark:bg-purple-950">
            <h3 className="font-semibold text-foreground">Auditor Signature</h3>
            <p className="text-sm text-muted-foreground">Confirm agreement with corrective action and acceptance.</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Sign as Auditor</button>
          </Card>
        )}
      </div>
    </div>
  )
}
