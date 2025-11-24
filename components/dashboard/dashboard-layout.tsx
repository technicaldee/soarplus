"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuditSelection } from "@/components/dashboard/audit-selection"
import { ProgramSelection } from "@/components/dashboard/program-selection"
import { RoleSpecificDashboard } from "@/components/dashboard/role-specific-dashboard"

interface DashboardLayoutProps {
  userRole: "auditor" | "operator" | "manager" | "director" | "administrator" | null
  userName: string
  onLogout: () => void
}

export function DashboardLayout({ userRole, userName, onLogout }: DashboardLayoutProps) {
  const [view, setView] = useState<"dashboard" | "audit" | "program">("dashboard")
  const [selectedProgram, setSelectedProgram] = useState<"soar-plus" | "soar-aap" | null>(null)
  const [stats, setStats] = useState({
    myAudits: 3,
    pendingApprovals: 2,
    completedAudits: 8,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {selectedProgram === "soar-aap" ? "SOAR AAP" : "SOAR+ Audit System"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {userRole === "auditor"
                ? "Auditor"
                : userRole === "operator"
                  ? "Operator"
                  : userRole === "manager"
                    ? "Responsible Manager"
                    : userRole === "director"
                      ? "Director of Safety"
                      : "Administrator"}{" "}
              • {userName}
            </p>
          </div>
          <Button variant="outline" onClick={onLogout} className="border-border bg-transparent">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === "dashboard" && (
          <RoleSpecificDashboard
            userRole={userRole}
            userName={userName}
            onStartAudit={() => setView("program")}
            stats={stats}
          />
        )}

        {view === "program" && (
          <ProgramSelection
            onSelectProgram={(program) => {
              setSelectedProgram(program)
              setView("audit")
            }}
          />
        )}

        {view === "audit" && (
          <AuditSelection
            userRole={userRole}
            selectedProgram={selectedProgram}
            onBack={() => {
              setView("dashboard")
              setSelectedProgram(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
