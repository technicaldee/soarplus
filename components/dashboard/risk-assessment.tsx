"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp, BarChart3 } from "lucide-react"

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

interface RiskAssessmentProps {
  findings: Finding[]
  recommendations: Recommendation[]
}

// Risk scoring weights for different severity levels
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

const SEVERITY_COLORS = {
  low: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
}

const SEVERITY_BADGES = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
}

const getRiskLevel = (score: number): "low" | "medium" | "high" | "critical" => {
  if (score <= 15) return "low"
  if (score <= 35) return "medium"
  if (score <= 65) return "high"
  return "critical"
}

const getRiskColor = (level: "low" | "medium" | "high" | "critical") => {
  const colors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-orange-600",
    critical: "text-red-600",
  }
  return colors[level]
}

const getRiskBgColor = (level: "low" | "medium" | "high" | "critical") => {
  const colors = {
    low: "bg-green-50",
    medium: "bg-yellow-50",
    high: "bg-orange-50",
    critical: "bg-red-50",
  }
  return colors[level]
}

export function RiskAssessment({ findings, recommendations }: RiskAssessmentProps) {
  // Calculate overall risk score
  const overallRiskScore = findings.reduce((sum, finding) => sum + SEVERITY_WEIGHTS[finding.severity], 0)

  // Calculate action implementation score
  const actionScore = recommendations.reduce((sum, rec) => sum + PRIORITY_WEIGHTS[rec.priority], 0)

  // Calculate net risk (risk minus mitigation)
  const netRiskScore = Math.max(0, overallRiskScore - actionScore * 0.7)

  // Risk breakdown by severity
  const severityBreakdown = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  }

  // Action implementation status
  const priorityBreakdown = {
    high: recommendations.filter((r) => r.priority === "high").length,
    medium: recommendations.filter((r) => r.priority === "medium").length,
    low: recommendations.filter((r) => r.priority === "low").length,
  }

  const overallRiskLevel = getRiskLevel(netRiskScore)
  const maxScore = Math.max(overallRiskScore, 100)

  return (
    <div className="space-y-6">
      {/* Risk Score Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Overall Risk Score */}
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Overall Risk Score</h3>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mb-4">
            <div className="text-3xl font-bold text-foreground">{Math.round(overallRiskScore)}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on {findings.length} findings</p>
          </div>
          <Progress value={Math.min((overallRiskScore / maxScore) * 100, 100)} className="h-2" />
        </Card>

        {/* Net Risk Score */}
        <Card className={`p-6 border border-border ${getRiskBgColor(overallRiskLevel)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Net Risk Score</h3>
            <TrendingUp className={`w-4 h-4 ${getRiskColor(overallRiskLevel)}`} />
          </div>
          <div className="mb-4">
            <div className={`text-3xl font-bold ${getRiskColor(overallRiskLevel)}`}>{Math.round(netRiskScore)}</div>
            <Badge className={`mt-2 ${SEVERITY_BADGES[overallRiskLevel]} border`}>
              {overallRiskLevel.toUpperCase()}
            </Badge>
          </div>
          <Progress value={Math.min((netRiskScore / maxScore) * 100, 100)} className="h-2" />
        </Card>

        {/* Mitigation Effectiveness */}
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Mitigation Impact</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mb-4">
            <div className="text-3xl font-bold text-foreground">
              {Math.round(((overallRiskScore - netRiskScore) / overallRiskScore) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Risk reduction from actions</p>
          </div>
          <Progress
            value={Math.round(((overallRiskScore - netRiskScore) / overallRiskScore) * 100) || 0}
            className="h-2"
          />
        </Card>
      </div>

      {/* Risk Matrix */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Finding Severity Breakdown</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Critical</span>
              <Badge className="bg-red-100 text-red-800 border-red-300 border">{severityBreakdown.critical}</Badge>
            </div>
            <Progress value={severityBreakdown.critical > 0 ? 100 : 0} className="h-2 bg-red-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High</span>
              <Badge className="bg-orange-100 text-orange-800 border-orange-300 border">{severityBreakdown.high}</Badge>
            </div>
            <Progress value={severityBreakdown.high > 0 ? 100 : 0} className="h-2 bg-orange-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Medium</span>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 border">
                {severityBreakdown.medium}
              </Badge>
            </div>
            <Progress value={severityBreakdown.medium > 0 ? 100 : 0} className="h-2 bg-yellow-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low</span>
              <Badge className="bg-green-100 text-green-800 border-green-300 border">{severityBreakdown.low}</Badge>
            </div>
            <Progress value={severityBreakdown.low > 0 ? 100 : 0} className="h-2 bg-green-200" />
          </div>
        </div>
      </Card>

      {/* Action Priority Distribution */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Action Priority Distribution</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High Priority</span>
              <Badge className="bg-red-100 text-red-800 border-red-300 border">{priorityBreakdown.high}</Badge>
            </div>
            <Progress value={priorityBreakdown.high > 0 ? 100 : 0} className="h-2 bg-red-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Medium Priority</span>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 border">
                {priorityBreakdown.medium}
              </Badge>
            </div>
            <Progress value={priorityBreakdown.medium > 0 ? 100 : 0} className="h-2 bg-yellow-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low Priority</span>
              <Badge className="bg-green-100 text-green-800 border-green-300 border">{priorityBreakdown.low}</Badge>
            </div>
            <Progress value={priorityBreakdown.low > 0 ? 100 : 0} className="h-2 bg-green-200" />
          </div>
        </div>
      </Card>

      {/* Risk Assessment Insights */}
      {(findings.length > 0 || recommendations.length > 0) && (
        <Card className="p-6 border border-border bg-muted/30">
          <h3 className="text-lg font-semibold text-foreground mb-3">Risk Assessment Insights</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {findings.length === 0 && recommendations.length === 0 && <li>• No findings or actions recorded yet</li>}
            {findings.length > 0 && (
              <>
                <li>
                  • Total findings recorded: <span className="font-semibold text-foreground">{findings.length}</span>
                </li>
                {severityBreakdown.critical > 0 && (
                  <li>
                    • <span className="font-semibold text-red-600">Critical issues require immediate attention</span>
                  </li>
                )}
                {severityBreakdown.high > 0 && (
                  <li>
                    • <span className="font-semibold text-orange-600">High-risk findings should be prioritized</span>
                  </li>
                )}
              </>
            )}
            {recommendations.length > 0 && (
              <>
                <li>
                  • Total actions identified:{" "}
                  <span className="font-semibold text-foreground">{recommendations.length}</span>
                </li>
                {priorityBreakdown.high > 0 && (
                  <li>
                    •{" "}
                    <span className="font-semibold text-foreground">
                      {priorityBreakdown.high} high-priority actions need assignment
                    </span>
                  </li>
                )}
              </>
            )}
            {overallRiskScore > 0 && netRiskScore > 0 && (
              <li>
                • Effective mitigation can reduce risk by up to{" "}
                <span className="font-semibold text-foreground">
                  {Math.round(((overallRiskScore - netRiskScore) / overallRiskScore) * 100)}%
                </span>
              </li>
            )}
          </ul>
        </Card>
      )}
    </div>
  )
}
