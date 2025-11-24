"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AuditRecord } from "@/lib/soar-data-model"

interface PhaseProps {
  record: AuditRecord
  onChange: (record: AuditRecord) => void
}

export function OperatorSelfAssessmentPhase({ record, onChange }: PhaseProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Phase 1: Operator Self-Assessment</h2>
        <p className="text-sm text-muted-foreground">
          Audit questions (standards) are sequenced in numerical order or selected by ID number. Company evaluates
          compliance and provides supporting documentation.
        </p>
      </Card>

      <div className="space-y-4">
        {record.operatorSelfAssessments.length === 0 ? (
          <Card className="p-6 border border-border text-center">
            <p className="text-muted-foreground">
              No self-assessments recorded yet. Begin evaluation of audit questions.
            </p>
          </Card>
        ) : (
          record.operatorSelfAssessments.map((assessment, index) => (
            <Card key={assessment.id} className="p-6 border border-border">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Question {index + 1}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {assessment.responseText || "Assessment pending"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Compliance Status</label>
                    <Select defaultValue={assessment.complianceStatus}>
                      <SelectTrigger className="bg-input text-foreground border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={assessment.selfScore}
                      className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Manual/Document Location</label>
                  <input
                    type="text"
                    defaultValue={assessment.manualLocation}
                    placeholder="e.g., SOP Section 3.2, Page 15"
                    className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Operator Response</label>
                  <Textarea
                    defaultValue={assessment.responseText}
                    placeholder="Describe how the organization meets this standard..."
                    className="bg-input text-foreground border-border"
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="border-border bg-transparent">
          Save Assessment
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Proceed to Auditor Assessment
        </Button>
      </div>
    </div>
  )
}
