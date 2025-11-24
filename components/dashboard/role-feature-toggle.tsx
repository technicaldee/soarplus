"use client"

import type React from "react"
import { hasPermission, type UserRole } from "@/lib/soar-permissions"

interface RoleFeatureToggleProps {
  userRole: UserRole
  permission: keyof import("@/lib/soar-permissions").PermissionSet
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleFeatureToggle({ userRole, permission, children, fallback }: RoleFeatureToggleProps) {
  const isVisible = hasPermission(userRole, permission)
  return isVisible ? <>{children}</> : <>{fallback}</> || null
}
