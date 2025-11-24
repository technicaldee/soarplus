"use client"

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

export interface AuditRecord {
  id: string
  organizationName: string
  auditDate: string
  auditScope: string
  auditorName: string
  findings: Finding[]
  recommendations: Recommendation[]
  overallRating: string
  submittedAt: string
}

const STORAGE_KEY = "soar_plus_audits"

// Get all audit records
export const getAllAudits = (): AuditRecord[] => {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading audits from storage:", error)
    return []
  }
}

// Get a single audit record
export const getAuditById = (id: string): AuditRecord | null => {
  const audits = getAllAudits()
  return audits.find((audit) => audit.id === id) || null
}

// Save a new audit record
export const saveAudit = (auditData: Omit<AuditRecord, "id" | "submittedAt">): AuditRecord => {
  const audits = getAllAudits()

  const newAudit: AuditRecord = {
    id: `audit_${Date.now()}`,
    ...auditData,
    submittedAt: new Date().toISOString(),
  }

  audits.push(newAudit)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audits))
    return newAudit
  } catch (error) {
    console.error("Error saving audit to storage:", error)
    throw error
  }
}

// Update an existing audit record
export const updateAudit = (
  id: string,
  updates: Partial<Omit<AuditRecord, "id" | "submittedAt">>,
): AuditRecord | null => {
  const audits = getAllAudits()
  const index = audits.findIndex((audit) => audit.id === id)

  if (index === -1) return null

  const updatedAudit = {
    ...audits[index],
    ...updates,
  }

  audits[index] = updatedAudit

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audits))
    return updatedAudit
  } catch (error) {
    console.error("Error updating audit in storage:", error)
    throw error
  }
}

// Delete an audit record
export const deleteAudit = (id: string): boolean => {
  const audits = getAllAudits()
  const filteredAudits = audits.filter((audit) => audit.id !== id)

  if (filteredAudits.length === audits.length) return false

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAudits))
    return true
  } catch (error) {
    console.error("Error deleting audit from storage:", error)
    throw error
  }
}

// Get audit history with pagination
export const getAuditHistory = (page = 1, pageSize = 10) => {
  const audits = getAllAudits()
  const sorted = [...audits].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  const total = sorted.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const items = sorted.slice(startIndex, endIndex)

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// Get statistics
export const getAuditStatistics = () => {
  const audits = getAllAudits()

  if (audits.length === 0) {
    return {
      totalAudits: 0,
      totalFindings: 0,
      criticalFindings: 0,
      highFindings: 0,
      averageRiskScore: 0,
      organizations: [],
    }
  }

  const SEVERITY_WEIGHTS = { low: 1, medium: 3, high: 7, critical: 10 }
  const PRIORITY_WEIGHTS = { low: 1, medium: 3, high: 5 }

  let totalFindings = 0
  let criticalFindings = 0
  let highFindings = 0
  let totalRiskScore = 0
  const organizationsSet = new Set<string>()

  audits.forEach((audit) => {
    totalFindings += audit.findings.length
    criticalFindings += audit.findings.filter((f) => f.severity === "critical").length
    highFindings += audit.findings.filter((f) => f.severity === "high").length

    const overallRisk = audit.findings.reduce((sum, finding) => sum + SEVERITY_WEIGHTS[finding.severity], 0)
    const actionScore = audit.recommendations.reduce((sum, rec) => sum + PRIORITY_WEIGHTS[rec.priority], 0)
    const netRisk = Math.max(0, overallRisk - actionScore * 0.7)
    totalRiskScore += netRisk

    organizationsSet.add(audit.organizationName)
  })

  return {
    totalAudits: audits.length,
    totalFindings,
    criticalFindings,
    highFindings,
    averageRiskScore: audits.length > 0 ? totalRiskScore / audits.length : 0,
    organizations: Array.from(organizationsSet),
  }
}

// Clear all data (for testing/reset)
export const clearAllAudits = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing audits from storage:", error)
  }
}
