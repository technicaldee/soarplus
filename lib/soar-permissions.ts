export type UserRole = "operator" | "auditor" | "manager" | "director" | "admin"

export interface PermissionSet {
  canCreateAudit: boolean
  canEditAudit: boolean
  canViewAudit: boolean
  canDeleteAudit: boolean
  canSign: boolean
  canApprove: boolean
  canAdvancePhase: boolean
  canViewAuditTrail: boolean
  canGenerateReports: boolean
  canManageUsers: boolean
  allowedPhases: string[]
  allowedAuditTypes: string[]
}

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, PermissionSet> = {
  operator: {
    canCreateAudit: false,
    canEditAudit: true,
    canViewAudit: true,
    canDeleteAudit: false,
    canSign: true,
    canApprove: false,
    canAdvancePhase: false,
    canViewAuditTrail: true,
    canGenerateReports: false,
    canManageUsers: false,
    allowedPhases: ["self-assessment", "action"],
    allowedAuditTypes: ["iosa", "faa-iasa", "case", "custom"],
  },

  auditor: {
    canCreateAudit: true,
    canEditAudit: true,
    canViewAudit: true,
    canDeleteAudit: false,
    canSign: true,
    canApprove: false,
    canAdvancePhase: true,
    canViewAuditTrail: true,
    canGenerateReports: true,
    canManageUsers: false,
    allowedPhases: ["audit", "analysis", "validation"],
    allowedAuditTypes: ["iosa", "faa-iasa", "case", "aoc", "custom"],
  },

  manager: {
    canCreateAudit: false,
    canEditAudit: true,
    canViewAudit: true,
    canDeleteAudit: false,
    canSign: true,
    canApprove: true,
    canAdvancePhase: true,
    canViewAuditTrail: true,
    canGenerateReports: true,
    canManageUsers: false,
    allowedPhases: ["preparation", "analysis", "action", "validation"],
    allowedAuditTypes: ["iosa", "faa-iasa", "case", "aoc", "custom"],
  },

  director: {
    canCreateAudit: false,
    canEditAudit: true,
    canViewAudit: true,
    canDeleteAudit: false,
    canSign: true,
    canApprove: true,
    canAdvancePhase: true,
    canViewAuditTrail: true,
    canGenerateReports: true,
    canManageUsers: false,
    allowedPhases: ["analysis", "action", "validation", "closed"],
    allowedAuditTypes: ["iosa", "faa-iasa", "case", "aoc", "custom"],
  },

  admin: {
    canCreateAudit: true,
    canEditAudit: true,
    canViewAudit: true,
    canDeleteAudit: true,
    canSign: true,
    canApprove: true,
    canAdvancePhase: true,
    canViewAuditTrail: true,
    canGenerateReports: true,
    canManageUsers: true,
    allowedPhases: ["preparation", "self-assessment", "audit", "analysis", "action", "validation", "closed"],
    allowedAuditTypes: ["iosa", "faa-iasa", "case", "aoc", "custom"],
  },
}

// Get permissions for a role
export const getPermissions = (role: UserRole): PermissionSet => {
  return ROLE_PERMISSIONS[role]
}

// Check if a user has permission to perform an action
export const hasPermission = (role: UserRole, action: keyof PermissionSet): boolean => {
  const permissions = getPermissions(role)
  const value = permissions[action]
  return typeof value === "boolean" ? value : false
}

// Check if a phase is allowed for a role
export const isPhaseAllowed = (role: UserRole, phase: string): boolean => {
  const permissions = getPermissions(role)
  return permissions.allowedPhases.includes(phase)
}

// Check if an audit type is allowed for a role
export const isAuditTypeAllowed = (role: UserRole, auditType: string): boolean => {
  const permissions = getPermissions(role)
  return permissions.allowedAuditTypes.includes(auditType)
}

// Get all accessible audit types for a role
export const getAccessibleAuditTypes = (role: UserRole): string[] => {
  return getPermissions(role).allowedAuditTypes
}

// Get all accessible phases for a role
export const getAccessiblePhases = (role: UserRole): string[] => {
  return getPermissions(role).allowedPhases
}

// Check if user can perform action on a specific audit
export const canUserAccessAudit = (
  role: UserRole,
  auditPhase: string,
  action: "view" | "edit" | "sign" | "approve" | "delete",
): boolean => {
  const permissions = getPermissions(role)

  switch (action) {
    case "view":
      return permissions.canViewAudit && isPhaseAllowed(role, auditPhase)
    case "edit":
      return permissions.canEditAudit && isPhaseAllowed(role, auditPhase)
    case "sign":
      return permissions.canSign && isPhaseAllowed(role, auditPhase)
    case "approve":
      return permissions.canApprove && isPhaseAllowed(role, auditPhase)
    case "delete":
      return permissions.canDeleteAudit && role === "admin"
    default:
      return false
  }
}

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    operator: "Operator",
    auditor: "Auditor",
    manager: "Responsible Manager",
    director: "Director of Safety",
    admin: "Administrator",
  }
  return displayNames[role]
}

// Get role description
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    operator: "Conducts internal self-assessments and responds to audit findings",
    auditor: "Conducts audits, creates findings, and manages the ROSI process",
    manager: "Responsible for corrective action implementation and acceptance",
    director: "Final approval authority for corrective actions and closures",
    admin: "Full system access including user management",
  }
  return descriptions[role]
}
