"use client"

import type React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { hasPermission, canUserAccessAudit, type UserRole } from "@/lib/soar-permissions"

interface RBACGuardProps {
  userRole: UserRole
  requiredPermission?: keyof import("@/lib/soar-permissions").PermissionSet
  auditPhase?: string
  action?: "view" | "edit" | "sign" | "approve" | "delete"
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RBACGuard({ userRole, requiredPermission, auditPhase, action, fallback, children }: RBACGuardProps) {
  let hasAccess = true

  if (requiredPermission) {
    hasAccess = hasPermission(userRole, requiredPermission)
  }

  if (auditPhase && action) {
    hasAccess = canUserAccessAudit(userRole, auditPhase, action)
  }

  if (!hasAccess) {
    return (
      fallback || (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            You do not have permission to access this feature. Contact your administrator.
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
