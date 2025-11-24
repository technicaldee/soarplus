"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface LoginPageProps {
  onLogin: (role: "auditor" | "operator", name: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<"auditor" | "operator" | null>(null)
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !userName.trim() || !password.trim()) {
      return
    }
    onLogin(selectedRole, userName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">SOAR+ Audit System</h1>
          <p className="text-muted-foreground">Aviation Safety Management Platform</p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Select Your Role</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left border border-border hover:bg-primary hover:text-primary-foreground bg-transparent"
                onClick={() => setSelectedRole("auditor")}
              >
                <div>
                  <div className="font-semibold">Auditor</div>
                  <div className="text-xs opacity-75">Conduct and manage audits</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left border border-border hover:bg-primary hover:text-primary-foreground bg-transparent"
                onClick={() => setSelectedRole("operator")}
              >
                <div>
                  <div className="font-semibold">Operator</div>
                  <div className="text-xs opacity-75">View and respond to audits</div>
                </div>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 border border-border">
            <Button
              variant="ghost"
              className="mb-4 text-primary hover:bg-transparent hover:text-primary/80"
              onClick={() => {
                setSelectedRole(null)
                setUserName("")
                setPassword("")
              }}
            >
              ← Back to Role Selection
            </Button>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {selectedRole === "auditor" ? "Auditor" : "Operator"} Name
                </label>
                <Input
                  type="text"
                  placeholder={selectedRole === "auditor" ? "Patrick Major" : "John Doe"}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-input text-foreground border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input text-foreground border-border"
                />
              </div>

              <Button
                type="submit"
                disabled={!userName.trim() || !password.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              Demo credentials: Any username and password
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
