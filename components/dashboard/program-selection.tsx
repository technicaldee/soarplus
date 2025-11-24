"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Plane } from "lucide-react"

interface ProgramSelectionProps {
  onSelectProgram: (program: "soar-plus" | "soar-aap") => void
}

export function ProgramSelection({ onSelectProgram }: ProgramSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Safety Operations Audit & Resolution</h1>
        <p className="text-lg text-muted-foreground">Select your program to get started</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* SOAR+ Card */}
        <Card className="p-8 border border-border hover:border-primary/50 transition-all cursor-pointer">
          <div className="space-y-4 h-full" onClick={() => onSelectProgram("soar-plus")}>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-blue-600" />
              <h2 className="text-2xl font-bold text-foreground">SOAR+</h2>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Standards-Based Audit & ROSI Process</p>

            <div className="space-y-3 py-4 border-y border-border">
              <h3 className="font-semibold text-foreground text-sm">Capabilities:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Risk-ranked audit questions (pre-assessed)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Operator self-assessment (optional pre-audit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Complete ROSI process (root cause → corrective action → validation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Normalized scoring (0-100%) with ROI quantification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Performance creep monitoring & sub-finding process</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Supported Standards:</p>
              <div className="flex flex-wrap gap-2">
                {["IOSA", "FAA IASA", "CASE", "DoD", "ICAO"].map((std) => (
                  <span key={std} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {std}
                  </span>
                ))}
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">Start SOAR+ Audit</Button>
          </div>
        </Card>

        {/* SOAR AAP Card */}
        <Card className="p-8 border border-border hover:border-primary/50 transition-all cursor-pointer">
          <div className="space-y-4 h-full" onClick={() => onSelectProgram("soar-aap")}>
            <div className="flex items-center gap-3">
              <Plane className="w-10 h-10 text-green-600" />
              <h2 className="text-2xl font-bold text-foreground">SOAR AAP</h2>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Airmanship Assurance & Asset Protection</p>

            <div className="space-y-3 py-4 border-y border-border">
              <h3 className="font-semibold text-foreground text-sm">Capabilities:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Flight Data Monitoring (FDM) analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>SOP compliance verification (ground & airborne)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Pilot assessment & airmanship training tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Real-time flight operations quality assurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Asset protection & lease compliance monitoring</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Applicable To:</p>
              <div className="flex flex-wrap gap-2">
                {["Fixed-Wing", "Helicopters", "AMOs", "Training Centers"].map((app) => (
                  <span key={app} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
              Start SOAR AAP Assessment
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-muted/30 border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>SOAR+</strong> is best for standards-based compliance audits with comprehensive resolution of safety
          issues tracking.
          <strong className="ml-4">SOAR AAP</strong> is best for operational flight data monitoring, pilot training
          optimization, and asset protection.
        </p>
      </Card>
    </div>
  )
}
