"use client"

// ============================================================================
// AUDIT TRAIL & HISTORY TRACKING
// ============================================================================
export interface AuditTrailEntry {
  id: string
  auditId: string
  timestamp: string
  userId: string
  userName: string
  action: string // "created", "updated", "signed", "approved", etc.
  fieldChanged?: string
  oldValue?: any
  newValue?: any
}

// ============================================================================
// DIGITAL SIGNATURES & AUTHORIZATIONS
// ============================================================================
export interface DigitalSignature {
  id: string
  auditId: string
  phase: string
  signer: {
    name: string
    role: "operator" | "auditor" | "manager" | "director"
    email: string
  }
  timestamp: string
  signature: string // base64 encoded canvas signature
  accepted: boolean
  comments?: string
}

// ============================================================================
// SUB-FINDING FOR PERFORMANCE CREEP
// ============================================================================
export interface SubFinding {
  id: string
  parentFindingId: string
  description: string
  riskLevel: "critical" | "high" | "medium" | "low"
  createdAt: string
  status: "open" | "in-progress" | "resolved"
  trackedAt?: string // when performance creep was detected
}

// ============================================================================
// CHECKLIST VERSIONING & ARCHIVING
// ============================================================================
export interface ChecklistVersion {
  id: string
  checklistId: string
  version: number
  createdAt: string
  questions: AuditQuestion[]
  archivedAt?: string
  archivedBy?: string
  status: "active" | "archived"
}

export interface AuditQuestion {
  id: string
  number: string
  summary: string
  riskRank: "critical" | "high" | "medium" | "low"
  category: string
  standard: "required" | "recommended"
  references: string[]
}

// ============================================================================
// PHASE-BASED WORKFLOW WITH VALIDATION
// ============================================================================
export type AuditPhase = "preparation" | "self-assessment" | "audit" | "analysis" | "action" | "validation" | "closed"

export interface PhaseData {
  phase: AuditPhase
  status: "not-started" | "in-progress" | "completed" | "blocked"
  completedAt?: string
  completedBy?: string
}

// ============================================================================
// COMPLETE AUDIT RECORD WITH ALL SOAR+ FEATURES
// ============================================================================
export interface SOARAudit {
  // Basic Information
  id: string
  organizationName: string
  auditType: "iosa" | "faa-iasa" | "case" | "aoc" | "custom"
  auditDate: string
  createdAt: string
  createdBy: string
  updatedAt: string
  programType: "soar-plus" | "soar-aap"

  // Workflow Phase
  currentPhase: AuditPhase
  phaseHistory: PhaseData[]

  // Operator Self-Assessment (optional pre-audit)
  operatorSelfAssessment?: {
    completedAt: string
    completedBy: string
    findings: OperatorFinding[]
    score: number
    responses: Record<string, string>
  }

  // Audit Findings
  findings: AuditFinding[]
  subFindings: SubFinding[]

  // Risk Assessment & Prioritization
  riskAssessments: RiskAssessment[]

  // Corrective Actions
  correctiveActions: CorrectiveAction[]

  // Process Control
  processControl?: {
    description: string
    flowDiagram: string
    controls: string[]
    mitigatingFactors: string[]
  }

  // Implementation Validation
  implementationValidation?: {
    validatedAt: string
    validatedBy: string
    evidenceOfImplementation: string[]
    performanceCreepNotes: string
    finalScore: number
  }

  // Audit Scoring & Reporting
  normalizedScore: number // 0-100%
  riskProfile: {
    critical: number
    high: number
    medium: number
    low: number
  }

  // Digital Signatures & Authorizations
  signatures: DigitalSignature[]
  approvals: {
    operatorResponsibleManager?: DigitalSignature
    auditor?: DigitalSignature
    directorOfSafety?: DigitalSignature
  }

  // Audit Trail
  auditTrail: AuditTrailEntry[]

  // Checklist Version Reference
  checklistVersion: string
  checklistVersionId: string

  // Status & Closure
  status: "draft" | "in-progress" | "submitted" | "approved" | "closed"
  closedAt?: string
  closedBy?: string
}

// ============================================================================
// OPERATOR SELF-ASSESSMENT FINDINGS
// ============================================================================
export interface OperatorFinding {
  id: string
  questionNumber: string
  questionSummary: string
  operatorAssessment: string
  operatorResponse: string
  score: number
  evidenceAttached: boolean
}

// ============================================================================
// AUDIT FINDINGS WITH COMPLETE ROSI DATA
// ============================================================================
export interface AuditFinding {
  id: string
  questionNumber: string
  questionSummary: string
  auditorAssessment: string
  auditorScore: number
  status: "compliant" | "non-conformity" | "observation"
  evidence: string[]
  references: string[]

  // Comparison with operator self-assessment
  operatorSelfAssessmentComparison?: {
    operatorScore: number
    auditScore: number
    variance: number
    notes: string
  }

  // Root cause analysis
  rootCauseAnalysis?: {
    identifiedCauses: string[]
    analysisNotes: string
    depth: "symptom" | "process" | "systemic"
  }
}

// ============================================================================
// RISK ASSESSMENT & PRIORITIZATION
// ============================================================================
export interface RiskAssessment {
  id: string
  findingId: string
  probability: "low" | "medium" | "high"
  severity: "low" | "medium" | "high" | "critical"
  potentialImpact: number
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: {
    auditor?: string
    operatorMember?: string
    responsibleManager?: string
  }
  assessmentDate: string
  assessedBy: string
}

// ============================================================================
// CORRECTIVE ACTION REPORT (CAR) WITH FULL LIFECYCLE
// ============================================================================
export interface CorrectiveAction {
  id: string
  findingId: string
  riskAssessmentId: string

  // Proposed Action
  proposedAction: string
  safetyRiskAssessment: string
  residualRiskLevel: "critical" | "high" | "medium" | "low"

  // Controls & Acceptance
  controls: string[]
  responsibleManager: string
  managerAcceptanceSignature?: DigitalSignature
  managerAcceptanceDate?: string

  // Process Control Phase
  processDescription: string
  processFlow: string
  documentAffected: string[]
  implementationResponsibilities: string
  targetCompletionDate: string

  // CAR Acceptance Phase (dual signatures)
  documentationEvidence: string
  implementationEvidence: string
  trainingEvidence: string
  acceptanceSignatures: {
    responsibleManager?: DigitalSignature
    auditor?: DigitalSignature
  }
  acceptanceComments: string

  // Implementation Validation Phase
  validationDate?: string
  validatedBy?: string
  completenessConfirmed: boolean
  permanenceConfirmed: boolean
  performanceCreepObserved: boolean
  performanceCreepNotes?: string

  // Director of Safety Final Acceptance
  directorAcceptanceSignature?: DigitalSignature
  directorAcceptanceDate?: string
  finalStatus: "pending" | "accepted" | "requires-revision" | "complete"

  // Status & Lifecycle
  status: "proposed" | "approved" | "implementing" | "validating" | "complete" | "reopened"
  createdAt: string
  createdBy: string
  updatedAt: string
}

// ============================================================================
// REPORT & SCORING
// ============================================================================
export interface AuditReport {
  auditId: string
  generatedAt: string
  generatedBy: string
  normalizedScore: number // 0-100%
  riskProfile: {
    critical: number
    high: number
    medium: number
    low: number
  }
  findings: AuditFinding[]
  correctiveActions: CorrectiveAction[]
  recommendations: string[]
  executiveSummary: string
}
