"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getAuditById, updateAudit, getAuditTrail } from "@/lib/soar-complete-storage"
import type { SOARAudit } from "@/lib/soar-complete-model"

interface AuditFormProps {
  auditType: string
  userRole: "auditor" | "operator" | null
  onSubmit: (data: AuditFormData) => void
  onBack: () => void
  viewingAuditId?: string | null
}

interface AuditFormData {
  // Basic Info
  questionNumber: string
  questionSummary: string
  auditDate: string
  auditType: string

  // Auditor Assessment Tab
  auditorAssessment: string
  assessmentStatus: string
  auditorNotes: string
  auditorScore: number
  assessmentRiskScore: number
  auditorReferences: string[]
  selectedReference: string

  // Risk/Priority Tab
  probability: string
  severity: string
  potentialImpact: number
  priority: string
  assignedAuditor: string
  assignedOperator: string
  rootCause: string
  riskAuditorReferences: string[]
  selectedRiskReference: string

  // Safety Risk Assessment Tab
  proposedCorrectiveAction: string
  safetyRiskAssessment: string
  finalAction: string
  controls: string

  // Process/Co. Acceptance Tab
  processFlowDescription: string
  processDescription: string
  controlsMitigatingRisk: string
  responsibilityAssignment: string
  accountableManager: string
  directorOfSafety: string
  processDocuments: string[]

  // CAR Acceptance Tab
  documentationEvidence: string
  implementationEvidence: string
  trainingEvidence: string
  managerSignature: string
  auditorSignature: string

  // Operator Self-Assessment (optional pre-audit)
  operatorAssessment?: string
  operatorResponse?: string
  operatorScore?: number

  // Impact of Changes
  impactDescription: string
  validationStatus: string
}

const AUDIT_QUESTIONS = [
  {
    id: "1",
    number: "3.005",
    summary: "Describe the roles and responsibilities of the operations and the airworthiness inspection...",
  },
  {
    id: "2",
    number: "4.002",
    summary: "If the CAA does not have a training center, describe how and where training is provided...",
  },
  {
    id: "3",
    number: "5.007",
    summary: "Does the inspector technical guidance contain policy, procedures and standards for...",
  },
  {
    id: "4",
    number: "Certifications-1",
    summary: "Obtain and review a copy of the current FAA Air Agency or Transport Canada AMO...",
  },
]

const SEVERITY_LEVELS = ["Low", "Medium Low", "Medium", "Medium High", "High"]
const PROBABILITY_LEVELS = ["Low", "Medium Low", "Medium", "Medium High", "High"]
const PRIORITY_LEVELS = ["Low Priority", "Medium Priority", "High Priority"]
const ASSESSMENT_STATUS = [
  "Documented and Implemented",
  "Implemented, Not Documented",
  "Documented, Not Implemented",
  "Not Documented and Not Implemented",
  "N/A",
]

export function AuditForm({ auditType, userRole, onSubmit, onBack, viewingAuditId }: AuditFormProps) {
  const [activeTab, setActiveTab] = useState("auditor-assessment")
  const [isViewMode, setIsViewMode] = useState(false)
  const [auditRecord, setAuditRecord] = useState<SOARAudit | null>(null)
  const [currentPhase, setCurrentPhase] = useState("preparation")
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [auditTrail, setAuditTrail] = useState<any[]>([])

  const [formData, setFormData] = useState<AuditFormData>({
    questionNumber: "",
    questionSummary: "",
    auditDate: new Date().toISOString().split("T")[0],
    auditType: auditType,
    auditorAssessment: "",
    assessmentStatus: "",
    auditorNotes: "",
    auditorScore: 0,
    assessmentRiskScore: 0,
    auditorReferences: [
      "Section 2 Civil Aviation Act 2006",
      "Advisory circular",
      "CAA Book chapter 9",
    ],
    selectedReference: "",
    probability: "",
    severity: "",
    potentialImpact: 0,
    priority: "",
    assignedAuditor: "",
    assignedOperator: "",
    rootCause: "",
    riskAuditorReferences: [
      "CASE Audit Site",
      "Root Cause Analysis for Aviation Safety",
      "Risk Management",
      "Bowtie Risk Management",
    ],
    selectedRiskReference: "",
    proposedCorrectiveAction: "",
    safetyRiskAssessment: "",
    finalAction: "",
    controls: "",
    processFlowDescription: "",
    processDescription: "",
    controlsMitigatingRisk: "",
    responsibilityAssignment: "",
    accountableManager: "",
    directorOfSafety: "",
    processDocuments: [
      "Section 2 Civil Aviation Act 2006",
      "Advisory circular",
      "CAA Book chapter 9",
    ],
    documentationEvidence: "",
    implementationEvidence: "",
    trainingEvidence: "",
    managerSignature: "",
    auditorSignature: "",
    impactDescription: "",
    validationStatus: "",
  })

  useEffect(() => {
    if (viewingAuditId) {
      const existingAudit = getAuditById(viewingAuditId)
      if (existingAudit) {
        setAuditRecord(existingAudit)
        setCurrentPhase(existingAudit.currentPhase)
        setIsViewMode(true)
        // Load audit trail
        const trails = getAuditTrail(viewingAuditId)
        setAuditTrail(trails)
      }
    }
  }, [viewingAuditId])

  const phaseSequence = [
    "preparation",
    "self-assessment",
    "audit",
    "analysis",
    "action",
    "validation",
    "closed",
  ] as const

  const canAdvancePhase = (): boolean => {
    // Add phase-specific validation logic here
    return true
  }

  const advancePhase = () => {
    const currentIndex = phaseSequence.indexOf(currentPhase)
    if (currentIndex < phaseSequence.length - 1) {
      const nextPhase = phaseSequence[currentIndex + 1]
      setCurrentPhase(nextPhase)

      if (auditRecord) {
        // Assuming updateAuditRecord is still needed for updating the phase
        // Update the function call if necessary based on the actual implementation of getAuditById
        updateAudit(auditRecord.id, { currentPhase: nextPhase })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isViewMode) {
      alert("You are viewing a submitted audit. It cannot be modified.")
      return
    }
    onSubmit(formData)
  }

  const updateField = (field: keyof AuditFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{isViewMode ? "View Audit" : "SOAR+ Audit Form"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {auditType} • Phase: {currentPhase.replace("-", " ").toUpperCase()}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Selection */}
        <Card className="p-6 border border-border">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="question-number" className="text-sm font-medium text-foreground mb-2 block">
                IASA Question Number
              </Label>
              <Select
                value={formData.questionNumber}
                onValueChange={(value) => {
                  const question = AUDIT_QUESTIONS.find((q) => q.number === value)
                  if (question) {
                    updateField("questionNumber", value)
                    updateField("questionSummary", question.summary)
                  }
                }}
                disabled={isViewMode}
              >
                <SelectTrigger className="bg-input text-foreground border-border">
                  <SelectValue placeholder="Select question..." />
                </SelectTrigger>
                <SelectContent>
                  {AUDIT_QUESTIONS.map((q) => (
                    <SelectItem key={q.id} value={q.number}>
                      {q.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="question-summary" className="text-sm font-medium text-foreground mb-2 block">
                IASA Question Summary
              </Label>
              <Input
                id="question-summary"
                value={formData.questionSummary}
                onChange={(e) => updateField("questionSummary", e.target.value)}
                className="bg-input text-foreground border-border"
                placeholder="Question summary will appear here..."
                disabled={isViewMode}
              />
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-muted border border-border overflow-x-auto">
            <TabsTrigger value="auditor-assessment" className="text-xs">
              Auditor Assessment
            </TabsTrigger>
            <TabsTrigger value="risk-priority" className="text-xs">
              Risk/Priority
            </TabsTrigger>
            <TabsTrigger value="safety-assessment" className="text-xs">
              Safety Assessment
            </TabsTrigger>
            <TabsTrigger value="process-acceptance" className="text-xs">
              Process/Co. Accept
            </TabsTrigger>
            <TabsTrigger value="car-acceptance" className="text-xs">
              CAR Acceptance
            </TabsTrigger>
            <TabsTrigger value="impact-changes" className="text-xs">
              Impact of Changes
            </TabsTrigger>
            <TabsTrigger value="operator-assessment" className="text-xs">
              Operator Self-Assess
            </TabsTrigger>
          </TabsList>

          {/* Auditor Assessment Tab */}
          <TabsContent value="auditor-assessment" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Panel - IASA Question and References */}
              <div className="space-y-4">
                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">IASA Question</h3>
                  <div className="p-4 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 rounded-lg min-h-32">
                    <p className="text-sm text-foreground">
                      {formData.questionSummary || "Select a question to view details..."}
                    </p>
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">References</h3>
                  <div className="space-y-3">
                    <RadioGroup
                      value={formData.selectedReference || ""}
                      onValueChange={(v) => updateField("selectedReference", v)}
                      disabled={isViewMode}
                    >
                      {formData.auditorReferences.length > 0 ? (
                        <div className="space-y-2">
                          {formData.auditorReferences.map((ref, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <RadioGroupItem value={ref} id={`ref-${index}`} />
                              <Label htmlFor={`ref-${index}`} className="flex-1 cursor-pointer">
                                {ref}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No references added</p>
                      )}
                    </RadioGroup>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newRef = prompt("Enter regulatory reference:")
                          if (newRef) {
                            updateField("auditorReferences", [...formData.auditorReferences, newRef])
                          }
                        }}
                        disabled={isViewMode}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (formData.auditorReferences.length > 0 && formData.selectedReference) {
                            const refs = formData.auditorReferences.filter((r) => r !== formData.selectedReference)
                            updateField("auditorReferences", refs)
                            updateField("selectedReference", "")
                          } else if (formData.auditorReferences.length > 0) {
                            const refs = [...formData.auditorReferences]
                            refs.pop()
                            updateField("auditorReferences", refs)
                          }
                        }}
                        disabled={isViewMode || formData.auditorReferences.length === 0}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel - Assessment Status and Auditor Notes */}
              <div className="space-y-4">
                <Card className="p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Auditor Assessment</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        Assessment Status
                      </Label>
                      <RadioGroup
                        value={formData.assessmentStatus}
                        onValueChange={(v) => updateField("assessmentStatus", v)}
                        disabled={isViewMode}
                      >
                        {ASSESSMENT_STATUS.map((status) => (
                          <div key={status} className="flex items-center gap-2 mb-2">
                            <RadioGroupItem value={status} id={`status-${status}`} />
                            <Label htmlFor={`status-${status}`} className="font-normal cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">
                          Self-Analysis Score
                        </Label>
                        <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-300 rounded text-center">
                          <span className="text-lg font-semibold text-foreground">
                            {formData.auditorScore || 0}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">
                          Assessment Risk Score
                        </Label>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 rounded text-center">
                          <span className="text-lg font-semibold text-foreground">
                            {formData.assessmentRiskScore || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Auditor Notes</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Textarea
                    id="auditor-notes"
                    placeholder="Space provided to insert notes, questions or other information desired by the auditor"
                    value={formData.auditorNotes}
                    onChange={(e) => updateField("auditorNotes", e.target.value)}
                    className="bg-input border-border min-h-32"
                    disabled={isViewMode}
                  />
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Risk/Priority Tab */}
          <TabsContent value="risk-priority" className="space-y-6 mt-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Audit Process Step 1</h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Probability</Label>
                  <RadioGroup
                    value={formData.probability}
                    onValueChange={(v) => updateField("probability", v)}
                    disabled={isViewMode}
                  >
                    <div className="flex flex-wrap gap-4">
                      {PROBABILITY_LEVELS.map((level) => (
                        <div key={level} className="flex items-center gap-2">
                          <RadioGroupItem value={level} id={`prob-${level}`} />
                          <Label htmlFor={`prob-${level}`} className="font-normal cursor-pointer">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Severity</Label>
                  <RadioGroup
                    value={formData.severity}
                    onValueChange={(v) => updateField("severity", v)}
                    disabled={isViewMode}
                  >
                    <div className="flex flex-wrap gap-4">
                      {SEVERITY_LEVELS.map((level) => (
                        <div key={level} className="flex items-center gap-2">
                          <RadioGroupItem value={level} id={`sev-${level}`} />
                          <Label htmlFor={`sev-${level}`} className="font-normal cursor-pointer">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg">
                  <Label className="text-sm font-medium text-foreground mb-2 block">Potential Impact</Label>
                  <Input
                    type="number"
                    value={formData.potentialImpact}
                    onChange={(e) => updateField("potentialImpact", Number.parseInt(e.target.value))}
                    className="bg-input border-border text-red-600 font-semibold"
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Audit Process Step 2</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Priority</Label>
                    <RadioGroup
                      value={formData.priority}
                      onValueChange={(v) => updateField("priority", v)}
                      disabled={isViewMode}
                    >
                      <div className="flex flex-wrap gap-4">
                        {PRIORITY_LEVELS.map((p) => (
                          <div key={p} className="flex items-center gap-2">
                            <RadioGroupItem value={p} id={`priority-${p}`} />
                            <Label htmlFor={`priority-${p}`} className="font-normal cursor-pointer">
                              {p}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assigned-auditor" className="text-sm font-medium text-foreground mb-2 block">
                        Assigned Auditor
                      </Label>
                      <Select
                        value={formData.assignedAuditor}
                        onValueChange={(v) => updateField("assignedAuditor", v)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select auditor..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mike-manager">Mike Manager</SelectItem>
                          <SelectItem value="patrick-major">Patrick Major</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="assigned-operator" className="text-sm font-medium text-foreground mb-2 block">
                        Assigned Operator Member
                      </Label>
                      <Select
                        value={formData.assignedOperator}
                        onValueChange={(v) => updateField("assignedOperator", v)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select operator..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john-doe">John Doe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Auditor References</Label>
                    <div className="space-y-3">
                      <RadioGroup
                        value={formData.selectedRiskReference || ""}
                        onValueChange={(v) => updateField("selectedRiskReference", v)}
                        disabled={isViewMode}
                      >
                        {formData.riskAuditorReferences.length > 0 ? (
                          <div className="space-y-2">
                            {formData.riskAuditorReferences.map((ref, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                <RadioGroupItem value={ref} id={`risk-auditor-ref-${index}`} />
                                <Label htmlFor={`risk-auditor-ref-${index}`} className="flex-1 cursor-pointer">
                                  {ref}
                                </Label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No auditor references added</p>
                        )}
                      </RadioGroup>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newRef = prompt("Enter auditor reference:")
                            if (newRef) {
                              updateField("riskAuditorReferences", [...formData.riskAuditorReferences, newRef])
                            }
                          }}
                          disabled={isViewMode}
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (formData.riskAuditorReferences.length > 0 && formData.selectedRiskReference) {
                              const refs = formData.riskAuditorReferences.filter((r) => r !== formData.selectedRiskReference)
                              updateField("riskAuditorReferences", refs)
                              updateField("selectedRiskReference", "")
                            } else if (formData.riskAuditorReferences.length > 0) {
                              const refs = [...formData.riskAuditorReferences]
                              refs.pop()
                              updateField("riskAuditorReferences", refs)
                            }
                          }}
                          disabled={isViewMode || formData.riskAuditorReferences.length === 0}
                        >
                          Delete
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert("Validating references...")
                          }}
                          disabled={isViewMode}
                        >
                          Validate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Label htmlFor="root-cause" className="text-sm font-medium text-foreground mb-2 block">
                  Root Cause
                </Label>
                <Textarea
                  id="root-cause"
                  placeholder="An open entry block is provided for the Auditor to enter the Root Cause(s) for the failure of non-compliance. This block should be an open forum to be discussed with the Operator and additional notes added as needed. Even though the discussion may reveal options and answers to fulfilling the requirement of the answer, no deletions or adjustment to the findings should be made based on this block. All input is desired and required for full potential of the program to work properly."
                  value={formData.rootCause}
                  onChange={(e) => updateField("rootCause", e.target.value)}
                  className="bg-input border-border min-h-32"
                  disabled={isViewMode}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Safety Risk Assessment Tab */}
          <TabsContent value="safety-assessment" className="space-y-6 mt-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Safety Risk Assessment</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proposed-action" className="text-sm font-medium text-foreground mb-2 block">
                    Proposed Corrective Action
                  </Label>
                  <Textarea
                    id="proposed-action"
                    placeholder="Describe proposed corrective action..."
                    value={formData.proposedCorrectiveAction}
                    onChange={(e) => updateField("proposedCorrectiveAction", e.target.value)}
                    className="bg-input border-border min-h-24"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label htmlFor="safety-assessment" className="text-sm font-medium text-foreground mb-2 block">
                    Safety Risk Assessment
                  </Label>
                  <Textarea
                    id="safety-assessment"
                    placeholder="Assessment of residual risk levels..."
                    value={formData.safetyRiskAssessment}
                    onChange={(e) => updateField("safetyRiskAssessment", e.target.value)}
                    className="bg-input border-border min-h-24"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label htmlFor="final-action" className="text-sm font-medium text-foreground mb-2 block">
                    Final Action Including Controls and Risk
                  </Label>
                  <Textarea
                    id="final-action"
                    placeholder="Final action details..."
                    value={formData.finalAction}
                    onChange={(e) => updateField("finalAction", e.target.value)}
                    className="bg-input border-border min-h-24"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label htmlFor="manager-sig" className="text-sm font-medium text-foreground mb-2 block">
                    Responsible Manager Authorization & Signature
                  </Label>
                  <Input
                    id="manager-sig"
                    placeholder="Manager name and date..."
                    value={formData.managerSignature}
                    onChange={(e) => updateField("managerSignature", e.target.value)}
                    className="bg-input border-border"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Process/Co. Acceptance Tab */}
          <TabsContent value="process-acceptance" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Panel - Process Items with Checkboxes */}
              <div className="space-y-4">
                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Process Control Items</h3>
                  <div className="space-y-6">
                    {/* Process Flow/Depiction */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Checkbox
                          id="process-flow-check"
                          checked={formData.processFlowDescription.length > 0}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              updateField("processFlowDescription", "")
                            }
                          }}
                          disabled={isViewMode}
                        />
                        <Label htmlFor="process-flow-check" className="text-sm font-semibold text-foreground cursor-pointer">
                          Process Flow/Depiction
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {formData.processDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <RadioGroupItem value={doc} id={`process-flow-${index}`} checked={true} />
                            <Label htmlFor={`process-flow-${index}`} className="flex-1 cursor-pointer text-sm">
                              {doc}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Checkbox
                          id="description-check"
                          checked={formData.processDescription.length > 0}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              updateField("processDescription", "")
                            }
                          }}
                          disabled={isViewMode}
                        />
                        <Label htmlFor="description-check" className="text-sm font-semibold text-foreground cursor-pointer">
                          Description
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {formData.processDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <RadioGroupItem value={doc} id={`description-${index}`} checked={index === 1} />
                            <Label htmlFor={`description-${index}`} className="flex-1 cursor-pointer text-sm">
                              {doc}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controls Mitigating Risk */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Checkbox
                          id="controls-check"
                          checked={formData.controlsMitigatingRisk.length > 0}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              updateField("controlsMitigatingRisk", "")
                            }
                          }}
                          disabled={isViewMode}
                        />
                        <Label htmlFor="controls-check" className="text-sm font-semibold text-foreground cursor-pointer">
                          Controls Mitigating Risk
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {formData.processDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <RadioGroupItem value={doc} id={`controls-${index}`} checked={index === 0 || index === 1} />
                            <Label htmlFor={`controls-${index}`} className="flex-1 cursor-pointer text-sm">
                              {doc}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignment of Responsibility/Authority */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Checkbox
                          id="responsibility-check"
                          checked={formData.responsibilityAssignment.length > 0}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              updateField("responsibilityAssignment", "")
                            }
                          }}
                          disabled={isViewMode}
                        />
                        <Label htmlFor="responsibility-check" className="text-sm font-semibold text-foreground cursor-pointer">
                          Assignment of Responsibility/Authority
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {formData.processDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <RadioGroupItem value={doc} id={`responsibility-${index}`} checked={index === 0} />
                            <Label htmlFor={`responsibility-${index}`} className="flex-1 cursor-pointer text-sm">
                              {doc}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Authorizations */}
                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Authorizations</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Checkbox id="accountable-manager-check" disabled={isViewMode} />
                        <Label htmlFor="accountable-manager-check" className="text-sm text-foreground cursor-pointer">
                          The corrective action herein described meets company requirements for acceptable levels of risk.
                        </Label>
                      </div>
                      <div className="ml-6 mt-2 space-y-2">
                        <Input
                          placeholder="Signature"
                          value={formData.accountableManager}
                          onChange={(e) => updateField("accountableManager", e.target.value)}
                          className="bg-input border-border"
                          disabled={isViewMode}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Checkbox id="director-safety-check" disabled={isViewMode} />
                        <Label htmlFor="director-safety-check" className="text-sm text-foreground cursor-pointer">
                          The accountable manager is authorized by the company to accept the process and level of risk described above.
                        </Label>
                      </div>
                      <div className="ml-6 mt-2 space-y-2">
                        <Input
                          placeholder="Signature"
                          value={formData.directorOfSafety}
                          onChange={(e) => updateField("directorOfSafety", e.target.value)}
                          className="bg-input border-border"
                          disabled={isViewMode}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel - Process Documents */}
              <div>
                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Process Documents</h3>
                  <div className="space-y-3">
                    {formData.processDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {formData.processDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <Checkbox
                              id={`process-doc-${index}`}
                              checked={true}
                              disabled={isViewMode}
                            />
                            <Label htmlFor={`process-doc-${index}`} className="flex-1 cursor-pointer text-sm">
                              {doc}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No process documents added</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDoc = prompt("Enter process document:")
                          if (newDoc) {
                            updateField("processDocuments", [...formData.processDocuments, newDoc])
                          }
                        }}
                        disabled={isViewMode}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (formData.processDocuments.length > 0) {
                            const docs = [...formData.processDocuments]
                            docs.pop()
                            updateField("processDocuments", docs)
                          }
                        }}
                        disabled={isViewMode || formData.processDocuments.length === 0}
                      >
                        Delete
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          alert("Validating process documents...")
                        }}
                        disabled={isViewMode}
                      >
                        Validate
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* CAR Acceptance Tab */}
          <TabsContent value="car-acceptance" className="space-y-6 mt-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Corrective Action Report (CAR) Acceptance</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <Checkbox />
                    Evidence of Documentation
                  </Label>
                  <Textarea
                    placeholder="Documentation discussion verbiage..."
                    value={formData.documentationEvidence}
                    onChange={(e) => updateField("documentationEvidence", e.target.value)}
                    className="bg-input border-border min-h-20"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <Checkbox />
                    Evidence of Implementation
                  </Label>
                  <Textarea
                    placeholder="Implementation discussion verbiage..."
                    value={formData.implementationEvidence}
                    onChange={(e) => updateField("implementationEvidence", e.target.value)}
                    className="bg-input border-border min-h-20"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <Checkbox />
                    Evidence of Training
                  </Label>
                  <Textarea
                    placeholder="Training discussion verbiage..."
                    value={formData.trainingEvidence}
                    onChange={(e) => updateField("trainingEvidence", e.target.value)}
                    className="bg-input border-border min-h-20"
                    disabled={isViewMode}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manager-signature" className="text-sm font-medium text-foreground mb-2 block">
                      Responsible Manager & Auditor Acceptance
                    </Label>
                    <Input
                      id="manager-signature"
                      placeholder="Manager signature..."
                      value={formData.managerSignature}
                      onChange={(e) => updateField("managerSignature", e.target.value)}
                      className="bg-input border-border"
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="auditor-signature" className="text-sm font-medium text-foreground mb-2 block">
                      Auditor Signature
                    </Label>
                    <Input
                      id="auditor-signature"
                      placeholder="Auditor signature..."
                      value={formData.auditorSignature}
                      onChange={(e) => updateField("auditorSignature", e.target.value)}
                      className="bg-input border-border"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Impact of Changes Tab */}
          <TabsContent value="impact-changes" className="space-y-6 mt-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Impact of Changes & Validation</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="impact-desc" className="text-sm font-medium text-foreground mb-2 block">
                    Impact Description
                  </Label>
                  <Textarea
                    id="impact-desc"
                    placeholder="Describe the impact of changes..."
                    value={formData.impactDescription}
                    onChange={(e) => updateField("impactDescription", e.target.value)}
                    className="bg-input border-border min-h-24"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Validation & Follow-Through Status
                  </Label>
                  <RadioGroup
                    value={formData.validationStatus}
                    onValueChange={(v) => updateField("validationStatus", v)}
                    disabled={isViewMode}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <RadioGroupItem value="not-started" id="val-not-started" />
                      <Label htmlFor="val-not-started" className="font-normal cursor-pointer">
                        Not Started
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <RadioGroupItem value="in-progress" id="val-in-progress" />
                      <Label htmlFor="val-in-progress" className="font-normal cursor-pointer">
                        In Progress
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <RadioGroupItem value="complete" id="val-complete" />
                      <Label htmlFor="val-complete" className="font-normal cursor-pointer">
                        Complete
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Operator Self-Assessment Tab */}
          <TabsContent value="operator-assessment" className="space-y-6 mt-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Operator Self-Assessment (Optional Pre-Audit)
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operator-assessment" className="text-sm font-medium text-foreground mb-2 block">
                    Operator Assessment
                  </Label>
                  <Textarea
                    id="operator-assessment"
                    placeholder="Operator internal evaluation..."
                    value={formData.operatorAssessment || ""}
                    onChange={(e) => updateField("operatorAssessment", e.target.value)}
                    className="bg-input border-border min-h-24"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label htmlFor="operator-response" className="text-sm font-medium text-foreground mb-2 block">
                    Operator Response & Documentation
                  </Label>
                  <Textarea
                    id="operator-response"
                    placeholder="Operator response to findings..."
                    value={formData.operatorResponse || ""}
                    onChange={(e) => updateField("operatorResponse", e.target.value)}
                    className="bg-input border-border min-h-24"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <Label htmlFor="operator-score" className="text-sm font-medium text-foreground mb-2 block">
                    Self-Analysis Score
                  </Label>
                  <Input
                    id="operator-score"
                    type="number"
                    value={formData.operatorScore || 0}
                    onChange={(e) => updateField("operatorScore", Number.parseInt(e.target.value))}
                    className="bg-input border-border"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Audit Trail and Signatures */}
        {isViewMode && (
          <Card className="p-6 border border-border bg-muted/50">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Audit Trail */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Audit Trail</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {auditTrail.map((entry) => (
                    <div key={entry.id} className="text-sm p-2 bg-background rounded border border-border">
                      <p className="font-medium text-foreground">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.userName} • {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Signatures */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Signatures & Approvals</h4>
                <div className="space-y-2">
                  {auditRecord?.signatures.map((sig) => (
                    <div key={sig.id} className="text-sm p-2 bg-background rounded border border-green-200">
                      <p className="font-medium text-foreground">{sig.signer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sig.signer.role} • {new Date(sig.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {auditRecord?.signatures.length === 0 && (
                    <p className="text-sm text-muted-foreground">No signatures yet</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex gap-3 justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-3">
            {!isViewMode && (
              <>
                <Button variant="outline">Save as Draft</Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Audit
                </Button>
                <Button variant="outline" onClick={advancePhase} disabled={!canAdvancePhase()}>
                  Advance Phase
                </Button>
              </>
            )}
            {isViewMode && (
              <Button variant="outline" disabled>
                View Only
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
