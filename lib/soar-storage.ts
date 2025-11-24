"use client"

import type { AuditRecord, ChecklistMaster, AuditQuestion, AuditType } from "./soar-data-model"

const KEYS = {
  AUDIT_TYPES: "soar_audit_types",
  CHECKLISTS: "soar_checklists",
  AUDIT_RECORDS: "soar_audit_records",
}

function initializeSampleData() {
  if (typeof window === "undefined") return
  if (localStorage.getItem(KEYS.AUDIT_TYPES)) return

  const auditTypes: AuditType[] = [
    {
      id: "type_iosa",
      name: "IATA IOSA",
      regulatoryBody: "IATA",
      description: "International Operational Safety Audit",
      version: "2024",
      effectiveDate: "2024-01-01",
    },
    {
      id: "type_faa",
      name: "FAA IASA",
      regulatoryBody: "FAA",
      description: "FAA International Air Safety Audit",
      version: "2024",
      effectiveDate: "2024-01-01",
    },
    {
      id: "type_case",
      name: "CASE Audit",
      regulatoryBody: "CASE",
      description: "Coordinating Agency for Supplier Evaluation",
      version: "2024",
      effectiveDate: "2024-01-01",
    },
  ]

  const sampleQuestions: AuditQuestion[] = [
    {
      id: "q_1001",
      checklistId: "checklist_iosa_2024",
      sequenceNumber: 1,
      questionType: "standard",
      riskRank: "critical",
      questionText:
        "Obtain and review a copy of the current FAA Agency or Transport Canada AMO (as applicable), Operational Specifications (if applicable), and IASA/Canadian approval documents (if applicable). Are they accurate?",
      references: ["Section 2 Civil Aviation Act 2006"],
    },
    {
      id: "q_1002",
      checklistId: "checklist_iosa_2024",
      sequenceNumber: 2,
      questionType: "standard",
      riskRank: "high",
      questionText: "Describe the roles and responsibilities of the operations and airworthiness inspectors",
      references: ["Section 3 Regulatory Requirements"],
    },
    {
      id: "q_1003",
      checklistId: "checklist_iosa_2024",
      sequenceNumber: 3,
      questionType: "recommended",
      riskRank: "medium",
      questionText: "Is there evidence of a structured training program for maintenance personnel?",
      references: ["Best Practice Guidance"],
    },
  ]

  const checklistMaster: ChecklistMaster = {
    id: "checklist_iosa_2024",
    auditTypeId: "type_iosa",
    version: "2024",
    approvalDate: "2024-01-01",
    questions: sampleQuestions,
    isActive: true,
  }

  localStorage.setItem(KEYS.AUDIT_TYPES, JSON.stringify(auditTypes))
  localStorage.setItem(KEYS.CHECKLISTS, JSON.stringify([checklistMaster]))
  localStorage.setItem(KEYS.AUDIT_RECORDS, JSON.stringify([]))
}

if (typeof window !== "undefined") {
  initializeSampleData()
}

export const getAuditTypes = (): AuditType[] => {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEYS.AUDIT_TYPES) || "[]")
  } catch {
    return []
  }
}

export const getChecklistsForAuditType = (auditTypeId: string): ChecklistMaster[] => {
  if (typeof window === "undefined") return []
  try {
    const checklists: ChecklistMaster[] = JSON.parse(localStorage.getItem(KEYS.CHECKLISTS) || "[]")
    return checklists.filter((c) => c.auditTypeId === auditTypeId && c.isActive)
  } catch {
    return []
  }
}

export const createAuditRecord = (data: Omit<AuditRecord, "id" | "createdAt" | "modificationLog">): AuditRecord => {
  const record: AuditRecord = {
    ...data,
    id: `audit_${Date.now()}`,
    createdAt: new Date().toISOString(),
    modificationLog: [],
  }

  const records: AuditRecord[] = getAllAuditRecords()
  records.push(record)

  try {
    localStorage.setItem(KEYS.AUDIT_RECORDS, JSON.stringify(records))
  } catch (error) {
    console.error("Error creating audit record:", error)
  }

  return record
}

export const getAllAuditRecords = (): AuditRecord[] => {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEYS.AUDIT_RECORDS) || "[]")
  } catch {
    return []
  }
}

export const getAuditRecordById = (id: string): AuditRecord | null => {
  const records = getAllAuditRecords()
  return records.find((r) => r.id === id) || null
}

export const updateAuditRecord = (id: string, updates: Partial<AuditRecord>): AuditRecord | null => {
  const records = getAllAuditRecords()
  const index = records.findIndex((r) => r.id === id)

  if (index === -1) return null

  const updated = { ...records[index], ...updates }
  records[index] = updated

  try {
    localStorage.setItem(KEYS.AUDIT_RECORDS, JSON.stringify(records))
  } catch (error) {
    console.error("Error updating audit record:", error)
  }

  return updated
}

export const deleteAuditRecord = (id: string): boolean => {
  const records = getAllAuditRecords()
  const filtered = records.filter((r) => r.id !== id)

  if (filtered.length === records.length) return false

  try {
    localStorage.setItem(KEYS.AUDIT_RECORDS, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error("Error deleting audit record:", error)
    return false
  }
}

export const getAuditStatistics = () => {
  const records = getAllAuditRecords()

  return {
    totalAudits: records.length,
    byPhase: {
      preparation: records.filter((r) => r.currentPhase === "preparation").length,
      selfAssessment: records.filter((r) => r.currentPhase === "self-assessment").length,
      audit: records.filter((r) => r.currentPhase === "audit").length,
      analysis: records.filter((r) => r.currentPhase === "analysis").length,
      action: records.filter((r) => r.currentPhase === "action").length,
      validation: records.filter((r) => r.currentPhase === "validation").length,
      closed: records.filter((r) => r.currentPhase === "closed").length,
    },
    averageNormalizedScore: records.reduce((sum, r) => sum + (r.normalizedScore || 0), 0) / (records.length || 1),
  }
}
