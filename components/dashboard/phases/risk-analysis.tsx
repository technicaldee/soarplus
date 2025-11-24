"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  onChange: (record: AuditRecord) => void
}

export function RiskAnalysisPhase({ record, onChange }: PhaseProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 3: Risk Assessment & Prioritization</h2>
        <p className="text-sm text-muted-foreground">
          Analyze findings for root causes, assign risk rankings, and establish priority based on severity and
          probability.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Risk Matrix Assessment</h3>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Probability</label>
            <Select>
              <SelectTrigger className="bg-input text-foreground border-border">
                <SelectValue placeholder="Select probability..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frequent">Frequent</SelectItem>
                <SelectItem value="occasional">Occasional</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="improbable">Improbable</SelectItem>
                <SelectItem value="extremely-improbable">Extremely Improbable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
            <Select>
              <SelectTrigger className="bg-input text-foreground border-border">
                <SelectValue placeholder="Select severity..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="catastrophic">Catastrophic</SelectItem>
                <SelectItem value="hazardous">Hazardous</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="negligible">Negligible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Priority Ranking</label>
            <Select>
              <SelectTrigger className="bg-input text-foreground border-border">
                <SelectValue placeholder="Select priority..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Root Cause Analysis</h3>
          <Textarea
            placeholder="Identify and document root causes for the failure of non-compliance..."
            className="bg-input text-foreground border-border"
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assigned ROSI Action Team</label>
            <input
              type="text"
              placeholder="Team members responsible for corrective action..."
              className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
