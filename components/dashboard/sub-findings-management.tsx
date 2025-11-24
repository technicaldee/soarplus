"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SubFinding } from "@/lib/soar-complete-model"

interface SubFindingsManagementProps {
  parentFindingId: string
  subFindings: SubFinding[]
  onAddSubFinding: (description: string, riskLevel: string) => void
}

export function SubFindingsManagement({ parentFindingId, subFindings, onAddSubFinding }: SubFindingsManagementProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [description, setDescription] = useState("")
  const [riskLevel, setRiskLevel] = useState<"critical" | "high" | "medium" | "low">("high")

  const handleSubmit = () => {
    if (description.trim()) {
      onAddSubFinding(description, riskLevel)
      setDescription("")
      setRiskLevel("high")
      setIsAdding(false)
    }
  }

  const getRiskColor = (level: string) => {
    if (level === "critical") return "bg-red-100 text-red-800"
    if (level === "high") return "bg-orange-100 text-orange-800"
    if (level === "medium") return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Performance Creep & Sub-Findings</h3>

      {subFindings.length > 0 && (
        <div className="space-y-3 mb-6">
          {subFindings.map((sf) => (
            <div key={sf.id} className="p-3 bg-muted rounded border border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{sf.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">Status: {sf.status}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(sf.riskLevel)}`}>
                  {sf.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="space-y-4 p-4 bg-muted/50 rounded border border-dashed border-border">
          <div>
            <Label className="text-sm font-medium mb-2 block">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the performance creep or sub-finding..."
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Risk Level</Label>
            <Select value={riskLevel} onValueChange={(v) => setRiskLevel(v as any)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
              Add Sub-Finding
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          + Add Performance Creep / Sub-Finding
        </Button>
      )}
    </Card>
  )
}
