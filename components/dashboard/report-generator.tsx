"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, File } from "lucide-react"

interface Finding {
  id: string
  category: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  evidence: string
}

interface Recommendation {
  id: string
  action: string
  responsible: string
  targetDate: string
  priority: "low" | "medium" | "high"
}

interface AuditReport {
  organizationName: string
  auditDate: string
  auditScope: string
  auditorName: string
  findings: Finding[]
  recommendations: Recommendation[]
  overallRating: string
}

interface ReportGeneratorProps {
  auditData: AuditReport
}

const SEVERITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

// Calculate risk scores
const SEVERITY_WEIGHTS = {
  low: 1,
  medium: 3,
  high: 7,
  critical: 10,
}

const PRIORITY_WEIGHTS = {
  low: 1,
  medium: 3,
  high: 5,
}

export function ReportGenerator({ auditData }: ReportGeneratorProps) {
  const overallRiskScore = auditData.findings.reduce((sum, finding) => sum + SEVERITY_WEIGHTS[finding.severity], 0)
  const actionScore = auditData.recommendations.reduce((sum, rec) => sum + PRIORITY_WEIGHTS[rec.priority], 0)
  const netRiskScore = Math.max(0, overallRiskScore - actionScore * 0.7)

  const generateCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,"

    // Header section
    csvContent += `AUDIT REPORT\n`
    csvContent += `Organization,${auditData.organizationName}\n`
    csvContent += `Audit Date,${auditData.auditDate}\n`
    csvContent += `Auditor Name,${auditData.auditorName}\n`
    csvContent += `Audit Scope,${auditData.auditScope}\n`
    csvContent += `Overall Rating,${auditData.overallRating}\n`
    csvContent += `Overall Risk Score,${Math.round(overallRiskScore)}\n`
    csvContent += `Net Risk Score,${Math.round(netRiskScore)}\n\n`

    // Findings section
    csvContent += `FINDINGS\n`
    csvContent += `Category,Description,Severity,Evidence\n`
    auditData.findings.forEach((finding) => {
      const description = `"${finding.description.replace(/"/g, '""')}"`
      const evidence = `"${finding.evidence.replace(/"/g, '""')}"`
      csvContent += `${finding.category},${description},${SEVERITY_LABELS[finding.severity]},${evidence}\n`
    })
    csvContent += `\n`

    // Recommendations section
    csvContent += `CORRECTIVE ACTIONS\n`
    csvContent += `Action,Responsible Party,Target Date,Priority\n`
    auditData.recommendations.forEach((rec) => {
      const action = `"${rec.action.replace(/"/g, '""')}"`
      csvContent += `${action},${rec.responsible},${rec.targetDate},${PRIORITY_LABELS[rec.priority]}\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `audit-report-${auditData.auditDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDFReport = () => {
    // Create a printable HTML version
    const printWindow = window.open("", "", "width=900,height=1200")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Audit Report - ${auditData.organizationName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { border-bottom: 3px solid #1f2937; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #1f2937; font-size: 28px; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-title { background-color: #f3f4f6; padding: 10px 15px; font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-left: 4px solid #2563eb; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .info-item { padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; }
          .info-label { font-weight: bold; color: #374151; font-size: 12px; }
          .info-value { margin-top: 5px; color: #1f2937; }
          .risk-cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
          .risk-card { padding: 15px; border-radius: 4px; text-align: center; border: 1px solid #e5e7eb; }
          .risk-card.critical { background-color: #fee2e2; border-color: #fecaca; }
          .risk-card.high { background-color: #fed7aa; border-color: #fdba74; }
          .risk-card.medium { background-color: #fef3c7; border-color: #fcd34d; }
          .risk-card.low { background-color: #dcfce7; border-color: #bbf7d0; }
          .risk-label { font-size: 12px; color: #666; }
          .risk-value { font-size: 28px; font-weight: bold; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #1f2937; font-size: 12px; border-bottom: 2px solid #d1d5db; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          tr:last-child td { border-bottom: 2px solid #d1d5db; }
          .severity-low { background-color: #dcfce7; color: #166534; }
          .severity-medium { background-color: #fef3c7; color: #854d0e; }
          .severity-high { background-color: #fed7aa; color: #92400e; }
          .severity-critical { background-color: #fee2e2; color: #991b1b; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SOAR+ Audit Report</h1>
          <p><strong>${auditData.organizationName}</strong> | ${auditData.auditDate}</p>
        </div>

        <!-- Audit Information -->
        <div class="section">
          <div class="section-title">Audit Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Organization</div>
              <div class="info-value">${auditData.organizationName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Audit Date</div>
              <div class="info-value">${auditData.auditDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Auditor</div>
              <div class="info-value">${auditData.auditorName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Scope</div>
              <div class="info-value">${auditData.auditScope}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Overall Rating</div>
              <div class="info-value">${auditData.overallRating.replace(/-/g, " ").toUpperCase()}</div>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="section">
          <div class="section-title">Risk Assessment</div>
          <div class="risk-cards">
            <div class="risk-card critical">
              <div class="risk-label">Overall Risk Score</div>
              <div class="risk-value">${Math.round(overallRiskScore)}</div>
            </div>
            <div class="risk-card high">
              <div class="risk-label">Net Risk Score</div>
              <div class="risk-value">${Math.round(netRiskScore)}</div>
            </div>
            <div class="risk-card low">
              <div class="risk-label">Mitigation Impact</div>
              <div class="risk-value">${Math.round(((overallRiskScore - netRiskScore) / overallRiskScore) * 100) || 0}%</div>
            </div>
          </div>
        </div>

        <!-- Findings -->
        <div class="section">
          <div class="section-title">Findings (${auditData.findings.length})</div>
          ${
            auditData.findings.length > 0
              ? `
            <table>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Severity</th>
              </tr>
              ${auditData.findings
                .map(
                  (finding) => `
                <tr>
                  <td>${finding.category}</td>
                  <td>${finding.description}</td>
                  <td><span class="badge severity-${finding.severity}">${SEVERITY_LABELS[finding.severity]}</span></td>
                </tr>
              `,
                )
                .join("")}
            </table>
          `
              : '<p style="color: #999;">No findings recorded</p>'
          }
        </div>

        <!-- Corrective Actions -->
        <div class="section">
          <div class="section-title">Corrective Actions (${auditData.recommendations.length})</div>
          ${
            auditData.recommendations.length > 0
              ? `
            <table>
              <tr>
                <th>Action</th>
                <th>Responsible</th>
                <th>Target Date</th>
                <th>Priority</th>
              </tr>
              ${auditData.recommendations
                .map(
                  (rec) => `
                <tr>
                  <td>${rec.action}</td>
                  <td>${rec.responsible}</td>
                  <td>${rec.targetDate || "Not set"}</td>
                  <td><span class="badge severity-${rec.priority}">${PRIORITY_LABELS[rec.priority]}</span></td>
                </tr>
              `,
                )
                .join("")}
            </table>
          `
              : '<p style="color: #999;">No corrective actions recorded</p>'
          }
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>SOAR+ Audit System | Aviation Safety Management Platform</p>
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Print / Save as PDF
          </button>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <Card className="p-6 border border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Report Export</h3>
          <p className="text-sm text-muted-foreground">Download your audit report in multiple formats</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* CSV Export */}
          <Button
            onClick={generateCSVReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-auto py-4 px-6 flex-col justify-center"
          >
            <File className="w-5 h-5" />
            <div className="text-center">
              <p className="font-semibold text-sm">Export as CSV</p>
              <p className="text-xs opacity-90">Spreadsheet format for Excel</p>
            </div>
          </Button>

          {/* PDF Export */}
          <Button
            onClick={generatePDFReport}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-auto py-4 px-6 flex-col justify-center"
          >
            <FileText className="w-5 h-5" />
            <div className="text-center">
              <p className="font-semibold text-sm">Export as PDF</p>
              <p className="text-xs opacity-90">Print or save as PDF</p>
            </div>
          </Button>
        </div>

        {/* Report Preview Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Report Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">Total Findings</p>
              <p className="text-lg font-bold text-foreground">{auditData.findings.length}</p>
            </div>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">Critical Issues</p>
              <p className="text-lg font-bold text-red-600">
                {auditData.findings.filter((f) => f.severity === "critical").length}
              </p>
            </div>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">Total Actions</p>
              <p className="text-lg font-bold text-foreground">{auditData.recommendations.length}</p>
            </div>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <p className="text-lg font-bold text-orange-600">{Math.round(netRiskScore)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
