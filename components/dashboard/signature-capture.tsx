"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SignatureCaptureProps {
  isOpen: boolean
  onClose: () => void
  onSign: (signature: string, name: string) => void
  role: "operator" | "auditor" | "manager" | "director"
}

export function SignatureCapture({ isOpen, onClose, onSign, role }: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signerName, setSignerName] = useState("")

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleSign = () => {
    const canvas = canvasRef.current
    if (!canvas || !signerName) return
    const signature = canvas.toDataURL()
    onSign(signature, signerName)
    clearSignature()
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignerName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Digital Signature - {role.charAt(0).toUpperCase() + role.slice(1)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="signer-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="signer-name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Signature</Label>
            <canvas
              ref={canvasRef}
              width={300}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border-2 border-dashed border-border rounded w-full bg-background cursor-crosshair mt-1"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={clearSignature}>
              Clear
            </Button>
            <Button onClick={handleSign} disabled={!signerName} className="bg-primary text-primary-foreground">
              Sign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
