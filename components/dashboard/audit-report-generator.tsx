"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SOARAudit } from "@/lib/soar-complete-model"

interface AuditReportGeneratorProps {
  audit: SOARAudit
  onExport: (format: "pdf" | "excel" | "json") => void
}

export function AuditReportGenerator({ audit, onExport }: AuditReportGeneratorProps) {
  const completionPercentage = Math.round(
    (audit.correctiveActions.filter((a) => a.finalStatus === "complete").length /
      Math.max(audit.correctiveActions.length, 1)) *
      100,
  )

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Audit Report & Export</h3>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-muted rounded border border-border">
          <p className="text-sm text-muted-foreground">Normalized Score</p>
          <p className="text-3xl font-bold text-foreground mt-1">{audit.normalizedScore}%</p>
        </div>
        <div className="p-4 bg-muted rounded border border-border">
          <p className="text-sm text-muted-foreground">CAR Completion</p>
          <p className="text-3xl font-bold text-foreground mt-1">{completionPercentage}%</p>
        </div>
        <div className="p-4 bg-muted rounded border border-border">
          <p className="text-sm text-muted-foreground">Risk Profile</p>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-red-100 text-red-800">{audit.riskProfile.critical} Critical</Badge>
            <Badge className="bg-orange-100 text-orange-800">{audit.riskProfile.high} High</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={() => onExport("pdf")} className="w-full bg-primary text-primary-foreground">
          Export as PDF
        </Button>
        <Button onClick={() => onExport("excel")} variant="outline" className="w-full">
          Export as Excel
        </Button>
        <Button onClick={() => onExport("json")} variant="outline" className="w-full">
          Export as JSON
        </Button>
      </div>
    </Card>
  )
}
