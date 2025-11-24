"use client"

import type {
  SOARAudit,
  AuditTrailEntry,
  DigitalSignature,
  ChecklistVersion,
  SubFinding,
  AuditPhase, // Declare AuditPhase here
} from "./soar-complete-model"

const STORAGE_KEY_AUDITS = "soar_complete_audits"
const STORAGE_KEY_CHECKLISTS = "soar_complete_checklists"
const STORAGE_KEY_TRAIL = "soar_complete_trail"

// ============================================================================
// AUDIT OPERATIONS
// ============================================================================

export const getAllAudits = (): SOARAudit[] => {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY_AUDITS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading audits:", error)
    return []
  }
}

export const getAuditById = (id: string): SOARAudit | null => {
  const audits = getAllAudits()
  return audits.find((a) => a.id === id) || null
}

export const createAudit = (data: Partial<SOARAudit>): SOARAudit => {
  const audits = getAllAudits()
  const newAudit: SOARAudit = {
    id: `audit_${Date.now()}`,
    organizationName: data.organizationName || "Unknown",
    auditType: data.auditType || "custom",
    auditDate: data.auditDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: data.createdBy || "system",
    updatedAt: new Date().toISOString(),
    programType: data.programType || "soar-plus",
    currentPhase: "preparation",
    phaseHistory: [{ phase: "preparation", status: "in-progress" }],
    findings: [],
    subFindings: [],
    riskAssessments: [],
    correctiveActions: [],
    normalizedScore: 0,
    riskProfile: { critical: 0, high: 0, medium: 0, low: 0 },
    signatures: [],
    approvals: {},
    auditTrail: [],
    checklistVersion: "1.0",
    checklistVersionId: `checklist_${data.auditType}_v1`,
    status: "draft",
    ...data,
  }

  audits.push(newAudit)
  localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(audits))

  // Log creation in audit trail
  addAuditTrailEntry(newAudit.id, data.createdBy || "system", "created", "Audit created")

  return newAudit
}

export const updateAudit = (id: string, updates: Partial<SOARAudit>, userId: string): SOARAudit | null => {
  const audits = getAllAudits()
  const index = audits.findIndex((a) => a.id === id)
  if (index === -1) return null

  const updatedAudit = {
    ...audits[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  audits[index] = updatedAudit
  localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(audits))

  // Log update in audit trail
  Object.keys(updates).forEach((key) => {
    if (key !== "auditTrail" && key !== "updatedAt") {
      addAuditTrailEntry(
        id,
        userId,
        `updated_${key}`,
        `${key} updated`,
        key,
        audits[index][key as keyof SOARAudit],
        updates[key as keyof SOARAudit],
      )
    }
  })

  return updatedAudit
}

export const deleteAudit = (id: string): boolean => {
  const audits = getAllAudits()
  const filtered = audits.filter((a) => a.id !== id)
  if (filtered.length === audits.length) return false
  localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(filtered))
  return true
}

// ============================================================================
// PHASE MANAGEMENT
// ============================================================================

export const advancePhase = (auditId: string, userId: string): AuditPhase | null => {
  const audit = getAuditById(auditId)
  if (!audit) return null

  const phases: AuditPhase[] = ["preparation", "self-assessment", "audit", "analysis", "action", "validation", "closed"]

  const currentIndex = phases.indexOf(audit.currentPhase)
  if (currentIndex === -1 || currentIndex >= phases.length - 1) return null

  const nextPhase = phases[currentIndex + 1]
  const updated = updateAudit(
    auditId,
    {
      currentPhase: nextPhase,
      phaseHistory: [
        ...audit.phaseHistory,
        {
          phase: nextPhase,
          status: "in-progress",
          completedAt: new Date().toISOString(),
          completedBy: userId,
        },
      ],
    },
    userId,
  )

  return updated?.currentPhase || null
}

// ============================================================================
// DIGITAL SIGNATURES
// ============================================================================

export const addSignature = (
  auditId: string,
  signature: Omit<DigitalSignature, "id" | "timestamp">,
): DigitalSignature | null => {
  const audit = getAuditById(auditId)
  if (!audit) return null

  const newSignature: DigitalSignature = {
    ...signature,
    id: `sig_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }

  const updated = updateAudit(
    auditId,
    {
      signatures: [...audit.signatures, newSignature],
    },
    signature.signer.name,
  )

  return updated ? newSignature : null
}

// ============================================================================
// AUDIT TRAIL TRACKING
// ============================================================================

export const addAuditTrailEntry = (
  auditId: string,
  userId: string,
  action: string,
  description: string,
  fieldChanged?: string,
  oldValue?: any,
  newValue?: any,
): void => {
  const audit = getAuditById(auditId)
  if (!audit) return

  const entry: AuditTrailEntry = {
    id: `trail_${Date.now()}`,
    auditId,
    timestamp: new Date().toISOString(),
    userId,
    userName: userId,
    action,
    fieldChanged,
    oldValue,
    newValue,
  }

  const trails = getAllAuditTrails()
  trails.push(entry)
  localStorage.setItem(STORAGE_KEY_TRAIL, JSON.stringify(trails))
}

export const getAllAuditTrails = (): AuditTrailEntry[] => {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY_TRAIL)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading audit trails:", error)
    return []
  }
}

export const getAuditTrail = (auditId: string): AuditTrailEntry[] => {
  const trails = getAllAuditTrails()
  return trails.filter((t) => t.auditId === auditId)
}

// ============================================================================
// SUB-FINDING MANAGEMENT (PERFORMANCE CREEP)
// ============================================================================

export const createSubFinding = (
  auditId: string,
  parentFindingId: string,
  subFinding: Omit<SubFinding, "id" | "createdAt">,
): SubFinding | null => {
  const audit = getAuditById(auditId)
  if (!audit) return null

  const newSubFinding: SubFinding = {
    ...subFinding,
    id: `subfinding_${Date.now()}`,
    createdAt: new Date().toISOString(),
    parentFindingId,
  }

  updateAudit(auditId, { subFindings: [...audit.subFindings, newSubFinding] }, "system")
  return newSubFinding
}

// ============================================================================
// CHECKLIST VERSIONING
// ============================================================================

export const createChecklistVersion = (version: Omit<ChecklistVersion, "id">): ChecklistVersion => {
  const checklists = getChecklists()
  const newVersion: ChecklistVersion = {
    ...version,
    id: `checklist_version_${Date.now()}`,
  }

  checklists.push(newVersion)
  localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(checklists))
  return newVersion
}

export const getChecklists = (): ChecklistVersion[] => {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY_CHECKLISTS)
    return data ? JSON.parse(data) : initializeDefaultChecklists()
  } catch (error) {
    console.error("Error reading checklists:", error)
    return initializeDefaultChecklists()
  }
}

export const initializeDefaultChecklists = (): ChecklistVersion[] => {
  const defaultChecklists: ChecklistVersion[] = [
    {
      id: "checklist_iosa_v1",
      checklistId: "iosa",
      version: 1,
      createdAt: new Date().toISOString(),
      status: "active",
      questions: [
        {
          id: "q1",
          number: "3.005",
          summary: "Describe the roles and responsibilities of operations and airworthiness inspection",
          riskRank: "critical",
          category: "Organization",
          standard: "required",
          references: ["IATA IOSA"],
        },
        {
          id: "q2",
          number: "4.002",
          summary: "Training center procedures and oversight",
          riskRank: "high",
          category: "Training",
          standard: "required",
          references: ["IATA IOSA"],
        },
      ],
    },
    {
      id: "checklist_faa_v1",
      checklistId: "faa",
      version: 1,
      createdAt: new Date().toISOString(),
      status: "active",
      questions: [
        {
          id: "q3",
          number: "5.007",
          summary: "Inspector technical guidance and standards",
          riskRank: "high",
          category: "Operations",
          standard: "required",
          references: ["FAA Regulations"],
        },
      ],
    },
  ]

  localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(defaultChecklists))
  return defaultChecklists
}

// ============================================================================
// SCORING & REPORTING
// ============================================================================

export const calculateNormalizedScore = (audit: SOARAudit): number => {
  if (audit.findings.length === 0) return 100

  const severityWeights = { critical: 10, high: 7, medium: 3, low: 1 }
  const riskMap = { critical: 10, high: 7, medium: 3, low: 1 }

  let totalDeductions = 0

  // Deduct based on findings
  audit.findings.forEach((finding) => {
    const severity = finding.status === "compliant" ? "low" : "high"
    totalDeductions += severityWeights[severity as keyof typeof severityWeights]
  })

  // Reduce deductions based on corrective actions
  audit.correctiveActions.forEach((action) => {
    if (action.finalStatus === "complete") {
      totalDeductions *= 0.5
    }
  })

  const score = Math.max(0, 100 - totalDeductions)
  return Math.round(score)
}

export const updateRiskProfile = (audit: SOARAudit): SOARAudit => {
  const profile = { critical: 0, high: 0, medium: 0, low: 0 }

  audit.riskAssessments.forEach((ra) => {
    profile[ra.priority as keyof typeof profile] += 1
  })

  return {
    ...audit,
    riskProfile: profile,
    normalizedScore: calculateNormalizedScore(audit),
  }
}

// ============================================================================
// REPORTING
// ============================================================================

export const generateAuditReport = (auditId: string) => {
  const audit = getAuditById(auditId)
  if (!audit) return null

  return {
    auditId: audit.id,
    generatedAt: new Date().toISOString(),
    generatedBy: "system",
    normalizedScore: audit.normalizedScore,
    riskProfile: audit.riskProfile,
    totalFindings: audit.findings.length,
    totalCorrectiveActions: audit.correctiveActions.length,
    completedCorrectiveActions: audit.correctiveActions.filter((a) => a.finalStatus === "complete").length,
    signaturesCollected: audit.signatures.length,
    auditTrailEntries: getAuditTrail(auditId).length,
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

export const getAuditHistory = (page = 1, pageSize = 10) => {
  const audits = getAllAudits()
  const sorted = [...audits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const total = sorted.length
  const items = sorted.slice((page - 1) * pageSize, page * pageSize)

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export const getAuditStatistics = () => {
  const audits = getAllAudits()

  return {
    totalAudits: audits.length,
    draftAudits: audits.filter((a) => a.status === "draft").length,
    inProgressAudits: audits.filter((a) => a.status === "in-progress").length,
    completedAudits: audits.filter((a) => a.status === "closed").length,
    totalFindings: audits.reduce((sum, a) => sum + a.findings.length, 0),
    averageScore: audits.length > 0 ? audits.reduce((sum, a) => sum + a.normalizedScore, 0) / audits.length : 0,
  }
}
