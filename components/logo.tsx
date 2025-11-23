"use client"

import type React from "react"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={`${currentSize} ${className} relative`}>
      <Image
        src="/logo.png"
        alt="SynapseMed Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}