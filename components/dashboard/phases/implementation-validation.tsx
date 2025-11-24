"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  userRole: string
  onChange: (record: AuditRecord) => void
}

export function ImplementationValidationPhase({ record, userRole, onChange }: PhaseProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 7: Implementation Validation & Monitoring</h2>
        <p className="text-sm text-muted-foreground">
          Verify corrective action implementation, monitor for performance creep, and finalize audit closure.
        </p>
      </Card>

      <div className="space-y-4">
        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Impact of Changes Confirmation</h3>
          <Textarea
            placeholder="Confirm effective impact of changes. Did implementation solve the root cause?"
            className="bg-input text-foreground border-border"
          />
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Was Root Cause Addressed?</h3>
          <RadioGroup defaultValue="yes">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="root-cause-yes" />
              <label htmlFor="root-cause-yes" className="text-sm">
                Yes - Root cause fully addressed
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="partial" id="root-cause-partial" />
              <label htmlFor="root-cause-partial" className="text-sm">
                Partial - Partially addressed
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="root-cause-no" />
              <label htmlFor="root-cause-no" className="text-sm">
                No - Not addressed (trigger sub-finding)
              </label>
            </div>
          </RadioGroup>
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Performance Creep Monitoring</h3>
          <Textarea
            placeholder="Monitor for gradual drift back to non-compliant practices. Document any concerns..."
            className="bg-input text-foreground border-border"
          />
        </Card>

        {userRole === "director-of-safety" && (
          <Card className="p-6 border border-border space-y-4 bg-green-50 dark:bg-green-950">
            <h3 className="font-semibold text-foreground">Director of Safety Final Acceptance</h3>
            <p className="text-sm text-muted-foreground">
              Final approval closes this finding and marks implementation as validated.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Final Approval & Close
            </button>
          </Card>
        )}
      </div>
    </div>
  )
}
