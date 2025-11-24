"use client"

import { useState } from "react"
import { LoginPage } from "@/components/auth/login-page"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

type UserRole = "auditor" | "operator" | null

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState("")

  const handleLogin = (role: "auditor" | "operator", name: string) => {
    setUserRole(role)
    setUserName(name)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setUserName("")
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardLayout userRole={userRole} userName={userName} onLogout={handleLogout} />
}
