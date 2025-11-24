"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AuditTrailEntry } from "@/lib/soar-complete-model"

interface AuditTrailViewerProps {
  entries: AuditTrailEntry[]
}

export function AuditTrailViewer({ entries }: AuditTrailViewerProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getActionBadgeColor = (action: string) => {
    if (action.includes("created")) return "bg-blue-100 text-blue-800"
    if (action.includes("signed")) return "bg-green-100 text-green-800"
    if (action.includes("approved")) return "bg-green-100 text-green-800"
    if (action.includes("rejected")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Audit Trail</h3>
      <div className="space-y-3">
        {sortedEntries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-4 p-3 bg-muted/50 rounded border border-border">
            <Badge className={getActionBadgeColor(entry.action)}>{entry.action}</Badge>
            <div className="flex-1">
              <p className="font-medium text-foreground">{entry.userName}</p>
              <p className="text-sm text-muted-foreground">
                {entry.action === "created" ? "Created audit" : entry.fieldChanged || "Modified audit"}
              </p>
              {entry.oldValue !== undefined && entry.newValue !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  Changed from "{entry.oldValue}" to "{entry.newValue}"
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
