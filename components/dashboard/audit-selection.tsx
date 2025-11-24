"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuditForm } from "@/components/dashboard/audit-form"
import { getAllAudits, saveAudit, deleteAudit } from "@/lib/audit-storage"
import { Trash2, Eye, Settings, Clipboard, Wrench, Plane, Users, Shield } from "lucide-react"

interface AuditSelectionProps {
  userRole: "auditor" | "operator" | null
  selectedProgram: "soar-plus" | "soar-aap" | null
  onBack: () => void
}

const SOAR_PLUS_AUDIT_TYPES = [
  {
    id: "systems-audit",
    name: "Systems Audit",
    description: "Comprehensive audit of aviation systems and procedures",
    icon: Settings,
    standard: "IOSA",
  },
  {
    id: "work-process-audit",
    name: "Work Process Audit",
    description: "Audit of work processes and operational procedures",
    icon: Clipboard,
    standard: "FAA IASA",
  },
  {
    id: "support-systems-audit",
    name: "Support Systems Audit",
    description: "Audit of support and ancillary systems",
    icon: Wrench,
    standard: "CASE",
  },
]

const SOAR_AAP_AUDIT_TYPES = [
  {
    id: "fdm-analysis",
    name: "Flight Data Monitoring",
    description: "Analyze flight data for SOP compliance and safety events",
    icon: Plane,
    standard: "FDM",
  },
  {
    id: "pilot-assessment",
    name: "Pilot Assessment",
    description: "Evaluate pilot performance and airmanship attributes",
    icon: Users,
    standard: "Airmanship",
  },
  {
    id: "asset-protection",
    name: "Asset Protection",
    description: "Monitor compliance with lease and operational requirements",
    icon: Shield,
    standard: "Lease/AOC",
  },
]

export function AuditSelection({ userRole, selectedProgram, onBack }: AuditSelectionProps) {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [auditHistory, setAuditHistory] = useState<any[]>([])
  const [viewingAuditId, setViewingAuditId] = useState<string | null>(null)

  useEffect(() => {
    loadAuditHistory()
  }, [])

  const loadAuditHistory = () => {
    const audits = getAllAudits()
    setAuditHistory(audits)
  }

  const handleAuditSubmit = (data: any) => {
    try {
      saveAudit({
        organizationName: data.organizationName,
        auditDate: data.auditDate,
        auditScope: data.auditScope,
        auditorName: data.auditorName,
        findings: data.findings,
        recommendations: data.recommendations,
        overallRating: data.overallRating,
      })
      loadAuditHistory()
      setShowForm(false)
      setSelectedAudit(null)
      alert("Audit submitted and saved successfully!")
    } catch (error) {
      alert("Error saving audit. Please try again.")
    }
  }

  const handleDeleteAudit = (id: string) => {
    if (window.confirm("Are you sure you want to delete this audit?")) {
      deleteAudit(id)
      loadAuditHistory()
    }
  }

  const handleViewAudit = (auditId: string) => {
    setSelectedAudit("systems-audit")
    setViewingAuditId(auditId)
    setShowForm(true)
  }

  const auditTypes = selectedProgram === "soar-aap" ? SOAR_AAP_AUDIT_TYPES : SOAR_PLUS_AUDIT_TYPES

  if (showForm && selectedAudit) {
    return (
      <AuditForm
        auditType={auditTypes.find((a) => a.id === selectedAudit)?.name || ""}
        userRole={userRole}
        onSubmit={handleAuditSubmit}
        viewingAuditId={viewingAuditId}
        onBack={() => {
          setShowForm(false)
          setSelectedAudit(null)
          setViewingAuditId(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Select Audit Type</h2>
        <div className="flex gap-2">
          {auditHistory.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="border-border bg-transparent"
            >
              {showHistory ? "Hide History" : "View History"}
            </Button>
          )}
          <Button variant="outline" onClick={onBack} className="border-border bg-transparent">
            Back
          </Button>
        </div>
      </div>

      {showHistory && auditHistory.length > 0 && (
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Audits</h3>
          <div className="space-y-3">
            {auditHistory.slice(0, 5).map((audit) => (
              <div
                key={audit.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{audit.organizationName}</p>
                  <p className="text-sm text-muted-foreground">
                    {audit.auditScope} • {new Date(audit.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAudit(audit.id)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAudit(audit.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">{auditHistory.length} total audit(s) saved</p>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {auditTypes.map((audit) => {
          const IconComponent = audit.icon
          return (
            <Card
              key={audit.id}
              className={`p-6 cursor-pointer transition-all border ${
                selectedAudit === audit.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedAudit(audit.id)}
            >
              <IconComponent className="w-8 h-8 mb-3 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{audit.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{audit.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    selectedAudit === audit.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {selectedAudit === audit.id ? "Selected" : "Available"}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedAudit && (
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={() => setSelectedAudit(null)} className="border-border">
            Cancel
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowForm(true)}>
            Start Audit
          </Button>
        </div>
      )}
    </div>
  )
}
