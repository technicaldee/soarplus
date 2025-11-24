"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  userRole: string
  onChange: (record: AuditRecord) => void
}

export function AuditorAssessmentPhase({ record, userRole, onChange }: PhaseProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 2: Auditor Assessment</h2>
        <p className="text-sm text-muted-foreground">
          Auditor reviews operator self-assessment and evaluates compliance against standards, identifying findings and
          scoring results.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Auditor Assessment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Assessment Status</label>
                <Select defaultValue="documented-implemented">
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documented-implemented">Documented and Implemented</SelectItem>
                    <SelectItem value="implemented-not-documented">Implemented, Not Documented</SelectItem>
                    <SelectItem value="documented-not-implemented">Documented, Not Implemented</SelectItem>
                    <SelectItem value="not-documented-not-implemented">Not Documented and Not Implemented</SelectItem>
                    <SelectItem value="not-applicable">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Compliance Score (0-100%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Auditor Comments</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Add comments, observations, or questions..."
                className="bg-input text-foreground border-border"
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Finding Severity</label>
                <Select>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Finding</SelectItem>
                    <SelectItem value="negligible">Negligible</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="hazardous">Hazardous</SelectItem>
                    <SelectItem value="catastrophic">Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
