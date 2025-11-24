"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getAuditStatistics } from "@/lib/audit-storage"
import { BarChart3, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"

export function AuditStats() {
  const [stats, setStats] = useState({
    totalAudits: 0,
    totalFindings: 0,
    criticalFindings: 0,
    highFindings: 0,
    averageRiskScore: 0,
    organizations: [] as string[],
  })

  useEffect(() => {
    const statistics = getAuditStatistics()
    setStats(statistics)
  }, [])

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Audits</span>
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground">{stats.totalAudits}</p>
      </Card>

      <Card className="p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Findings</span>
          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground">{stats.totalFindings}</p>
      </Card>

      <Card className="p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Critical Issues</span>
          <AlertCircle className="w-4 h-4 text-red-600" />
        </div>
        <p className="text-2xl font-bold text-red-600">{stats.criticalFindings}</p>
      </Card>

      <Card className="p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">High Issues</span>
          <AlertCircle className="w-4 h-4 text-orange-600" />
        </div>
        <p className="text-2xl font-bold text-orange-600">{stats.highFindings}</p>
      </Card>

      <Card className="p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Avg Risk Score</span>
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground">{Math.round(stats.averageRiskScore)}</p>
      </Card>
    </div>
  )
}
