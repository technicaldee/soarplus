"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPermissions, getRoleDisplayName, getRoleDescription, type UserRole } from "@/lib/soar-permissions"

interface RoleSpecificDashboardProps {
  userRole: UserRole
  userName: string
  onStartAudit: () => void
  stats: {
    myAudits: number
    pendingApprovals: number
    completedAudits: number
  }
}

export function RoleSpecificDashboard({ userRole, userName, onStartAudit, stats }: RoleSpecificDashboardProps) {
  const permissions = getPermissions(userRole)
  const roleDisplay = getRoleDisplayName(userRole)
  const roleDescription = getRoleDescription(userRole)

  return (
    <div className="space-y-6">
      {/* Role Information */}
      <Card className="p-6 border border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{roleDisplay}</h2>
            <p className="text-sm text-muted-foreground mt-2">{roleDescription}</p>
            <p className="text-sm font-medium text-foreground mt-4">Welcome, {userName}</p>
          </div>
          <Badge className="bg-primary text-primary-foreground px-3 py-1">Active</Badge>
        </div>
      </Card>

      {/* Role-Specific Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {userRole === "operator" && (
          <>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Pending Self-Assessments</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.myAudits}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Action Items</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.pendingApprovals}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.completedAudits}</p>
            </Card>
          </>
        )}

        {userRole === "auditor" && (
          <>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Active Audits</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.myAudits}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Awaiting Findings</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.pendingApprovals}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Closed Audits</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.completedAudits}</p>
            </Card>
          </>
        )}

        {(userRole === "manager" || userRole === "director") && (
          <>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Under Review</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.pendingApprovals}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Requiring Approval</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.myAudits}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-muted-foreground">Approved CAR</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.completedAudits}</p>
            </Card>
          </>
        )}
      </div>

      {/* Role-Specific Actions */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Actions</h3>
        <div className="space-y-2">
          {permissions.canCreateAudit && (
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <p className="font-medium text-foreground">Create New Audit</p>
                <p className="text-sm text-muted-foreground">Start a new safety audit</p>
              </div>
              <Button onClick={onStartAudit} className="bg-primary text-primary-foreground">
                Create
              </Button>
            </div>
          )}

          {permissions.canApprove && (
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <p className="font-medium text-foreground">Review Pending Approvals</p>
                <p className="text-sm text-muted-foreground">
                  {userRole === "manager" ? "Approve corrective actions" : "Final authorization of corrective actions"}
                </p>
              </div>
              <Badge variant="outline">{stats.pendingApprovals} Pending</Badge>
            </div>
          )}

          {permissions.canGenerateReports && (
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <p className="font-medium text-foreground">Generate Reports</p>
                <p className="text-sm text-muted-foreground">Export audit reports and analytics</p>
              </div>
              <Badge variant="outline">Ready</Badge>
            </div>
          )}

          {permissions.canManageUsers && (
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <p className="font-medium text-foreground">Manage Users</p>
                <p className="text-sm text-muted-foreground">Configure user roles and permissions</p>
              </div>
              <Badge variant="outline">Admin</Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Permission Summary */}
      <Card className="p-6 border border-border bg-muted/50">
        <h3 className="text-sm font-semibold text-foreground mb-3">Your Permissions</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            {permissions.canEditAudit ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">✕</span>
            )}
            <span className="text-foreground">Edit Audits</span>
          </div>
          <div className="flex items-center gap-2">
            {permissions.canSign ? <span className="text-green-600">✓</span> : <span className="text-gray-400">✕</span>}
            <span className="text-foreground">Sign Documents</span>
          </div>
          <div className="flex items-center gap-2">
            {permissions.canApprove ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">✕</span>
            )}
            <span className="text-foreground">Approve Actions</span>
          </div>
          <div className="flex items-center gap-2">
            {permissions.canAdvancePhase ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">✕</span>
            )}
            <span className="text-foreground">Advance Phases</span>
          </div>
          <div className="flex items-center gap-2">
            {permissions.canGenerateReports ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">✕</span>
            )}
            <span className="text-foreground">Generate Reports</span>
          </div>
          <div className="flex items-center gap-2">
            {permissions.canManageUsers ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">✕</span>
            )}
            <span className="text-foreground">Manage Users</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
