"use client"

// SOAR+ Complete Data Model

export interface AuditType {
  id: string
  name: string
  regulatoryBody: string
  description: string
  version: string
  effectiveDate: string
}

export interface AuditQuestion {
  id: string
  checklistId: string
  sequenceNumber: number
  questionType: "standard" | "recommended"
  riskRank: "critical" | "high" | "medium" | "low"
  questionText: string
  guidance?: string
  references?: string[]
}

export interface ChecklistMaster {
  id: string
  auditTypeId: string
  version: string
  approvalDate: string
  questions: AuditQuestion[]
  isActive: boolean
}

export interface OperatorSelfAssessment {
  id: string
  questionId: string
  auditId: string
  complianceStatus: "compliant" | "non-compliant" | "partial" | "not-applicable"
  selfScore: number
  manualLocation: string
  responseText?: string
  timestamp: string
  user: string
}

export interface AuditorAssessment {
  id: string
  questionId: string
  auditId: string
  auditorId: string
  complianceStatus: "compliant" | "non-compliant" | "partial" | "not-applicable"
  complianceScore: number
  comments: string
  findingSeverity?: "catastrophic" | "hazardous" | "major" | "minor" | "negligible"
  timestamp: string
  digitalSignature?: string
}

export interface HazardRiskWorksheet {
  id: string
  auditId: string
  questionId: string
  rootCauses: string[]
  probability: "frequent" | "occasional" | "remote" | "improbable" | "extremely-improbable"
  severity: "catastrophic" | "hazardous" | "major" | "minor" | "negligible"
  priorityRanking: "critical" | "high" | "medium" | "low"
  assignedTeamMembers: string[]
}

export interface CorrectiveAction {
  id: string
  auditId: string
  proposedActions: string
  controls: string
  acceptedRisks: string
  residualRiskRating: "high" | "medium" | "low"
  responsibleManager: string
  managerSignature?: string
  status: "proposed" | "approved" | "implementing" | "completed"
}

export interface ProcessControlPlan {
  id: string
  auditId: string
  description: string
  affectedDocuments: string[]
  responsiblePersonnel: string[]
  criticalFactors: string
  directorSignature?: string
}

export interface CARAcceptance {
  id: string
  auditId: string
  documentationEvidence: string
  implementationEvidence: string
  trainingEvidence: string
  operatorSignature?: string
  auditorSignature?: string
  status: "pending" | "accepted" | "rejected"
}

export interface ImplementationValidation {
  id: string
  auditId: string
  impactOfChanges: string
  performanceCreepNotes: string
  wasRootCauseAddressed: "yes" | "no" | "partial"
  directorSignature?: string
  completionDate?: string
  status: "pending" | "validated" | "rejected"
}

export interface AuditRecord {
  id: string
  companyName: string
  auditType: string
  auditDate: string
  auditorName: string

  currentPhase: "preparation" | "self-assessment" | "audit" | "analysis" | "action" | "validation" | "closed"

  // Assessments
  operatorSelfAssessments: OperatorSelfAssessment[]
  auditorAssessments: AuditorAssessment[]

  // Risk and Actions
  findings: HazardRiskWorksheet[]
  correctiveActions: CorrectiveAction[]
  processPlans: ProcessControlPlan[]
  carAcceptances: CARAcceptance[]
  validations: ImplementationValidation[]

  // Scoring
  normalizedScore?: number

  // Timeline
  createdAt: string
  submittedAt?: string
  completedAt?: string

  // Audit trail
  modificationLog: Array<{
    timestamp: string
    user: string
    action: string
    changes: Record<string, any>
  }>
}
