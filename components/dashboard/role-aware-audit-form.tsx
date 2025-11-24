"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { hasPermission, isPhaseAllowed, getRoleDisplayName, type UserRole } from "@/lib/soar-permissions"

interface RoleAwareAuditFormProps {
  userRole: UserRole
  currentPhase: string
  children: React.ReactNode
}

export function RoleAwareAuditForm({ userRole, currentPhase, children }: RoleAwareAuditFormProps) {
  const canEdit = hasPermission(userRole, "canEditAudit")
  const canAdvance = hasPermission(userRole, "canAdvancePhase")
  const phaseAllowed = isPhaseAllowed(userRole, currentPhase)

  return (
    <div className="space-y-4">
      {/* Role and Phase Information */}
      <Card className="p-4 border border-border bg-muted/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Your Role</p>
            <Badge className="mt-1 bg-primary text-primary-foreground">{getRoleDisplayName(userRole)}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Phase</p>
            <Badge variant="outline" className="mt-1">
              {currentPhase.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Permissions</p>
            <p className="text-sm font-medium text-foreground mt-1">
              {canEdit ? "Can Edit" : "View Only"}
              {canAdvance && " • Can Advance"}
            </p>
          </div>
        </div>
      </Card>

      {/* Access Warning */}
      {!phaseAllowed && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            You cannot perform actions in this phase. Your role is only allowed to work in specific audit phases.
          </AlertDescription>
        </Alert>
      )}

      {!canEdit && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            You have view-only access to this audit. Contact your administrator to request edit permissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Form Content */}
      <div className={!canEdit ? "opacity-70 pointer-events-none" : ""}>{children}</div>
    </div>
  )
}
