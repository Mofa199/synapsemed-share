"use client"

import React, { useEffect, useState } from 'react'

export function Medical3DCharacters() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate positions based on scroll
  const medicalStudentY = Math.sin(scrollY * 0.01) * 20
  const nurseY = Math.sin(scrollY * 0.01 + 2) * 15
  const pharmacistY = Math.sin(scrollY * 0.01 + 4) * 25

  const medicalStudentX = Math.cos(scrollY * 0.005) * 10
  const nurseX = Math.cos(scrollY * 0.008) * 8
  const pharmacistX = Math.cos(scrollY * 0.006) * 12

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Medical Student */}
      <div 
        className="absolute transition-all duration-300 ease-out"
        style={{
          left: `calc(20% + ${medicalStudentX}px)`,
          top: `calc(30% + ${medicalStudentY}px)`,
          transform: `rotate(${scrollY * 0.1}deg)`
        }}
      >
        <div className="relative">
          {/* Medical Student SVG */}
          <svg width="80" height="120" viewBox="0 0 80 120" className="drop-shadow-lg">
            {/* Head */}
            <circle cx="40" cy="20" r="12" fill="#f4a261" stroke="#2d3748" strokeWidth="2"/>
            {/* Hair */}
            <path d="M28 12 Q40 8 52 12 Q48 16 40 16 Q32 16 28 12" fill="#4a5568"/>
            {/* Eyes */}
            <circle cx="36" cy="18" r="2" fill="#2d3748"/>
            <circle cx="44" cy="18" r="2" fill="#2d3748"/>
            {/* Smile */}
            <path d="M36 22 Q40 25 44 22" stroke="#2d3748" strokeWidth="1.5" fill="none"/>
            
            {/* Body - Lab Coat */}
            <rect x="25" y="32" width="30" height="50" fill="#f8f8f8" stroke="#e2e8f0" strokeWidth="2" rx="4"/>
            {/* Shirt underneath */}
            <rect x="30" y="35" width="20" height="20" fill="#3182ce" rx="2"/>
            {/* Lab coat buttons */}
            <circle cx="35" cy="45" r="2" fill="#cbd5e0"/>
            <circle cx="35" cy="55" r="2" fill="#cbd5e0"/>
            <circle cx="35" cy="65" r="2" fill="#cbd5e0"/>
            
            {/* Stethoscope */}
            <path d="M32 40 Q28 45 32 50" stroke="#2d3748" strokeWidth="3" fill="none"/>
            <circle cx="32" cy="52" r="3" fill="#2d3748"/>
            <path d="M32 50 Q40 48 45 40" stroke="#2d3748" strokeWidth="2" fill="none"/>
            
            {/* Arms */}
            <rect x="15" y="40" width="8" height="25" fill="#f4a261" rx="4"/>
            <rect x="57" y="40" width="8" height="25" fill="#f4a261" rx="4"/>
            
            {/* Hands */}
            <circle cx="19" cy="67" r="4" fill="#f4a261"/>
            <circle cx="61" cy="67" r="4" fill="#f4a261"/>
            
            {/* Medical book in hand */}
            <rect x="15" y="65" width="8" height="6" fill="#e53e3e" rx="1"/>
            <rect x="16" y="66" width="6" height="1" fill="#fff"/>
            
            {/* Legs */}
            <rect x="32" y="82" width="8" height="25" fill="#2d3748" rx="4"/>
            <rect x="42" y="82" width="8" height="25" fill="#2d3748" rx="4"/>
            
            {/* Feet */}
            <ellipse cx="36" cy="110" rx="6" ry="3" fill="#1a202c"/>
            <ellipse cx="46" cy="110" rx="6" ry="3" fill="#1a202c"/>
          </svg>
          
          {/* Medical Student Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-[#213874] shadow">
            Medical Student
          </div>
        </div>
      </div>

      {/* Nurse */}
      <div 
        className="absolute transition-all duration-300 ease-out"
        style={{
          right: `calc(25% + ${nurseX}px)`,
          top: `calc(40% + ${nurseY}px)`,
          transform: `rotate(${-scrollY * 0.08}deg)`
        }}
      >
        <div className="relative">
          {/* Nurse SVG */}
          <svg width="80" height="120" viewBox="0 0 80 120" className="drop-shadow-lg">
            {/* Head */}
            <circle cx="40" cy="20" r="12" fill="#f4a261" stroke="#2d3748" strokeWidth="2"/>
            {/* Hair */}
            <path d="M28 10 Q40 6 52 10 Q52 18 40 18 Q28 18 28 10" fill="#8b4513"/>
            {/* Nurse cap */}
            <path d="M30 12 Q40 8 50 12 Q48 15 40 15 Q32 15 30 12" fill="#f8f8f8" stroke="#e2e8f0"/>
            <rect x="38" y="10" width="4" height="2" fill="#e53e3e"/>
            {/* Eyes */}
            <circle cx="36" cy="18" r="2" fill="#2d3748"/>
            <circle cx="44" cy="18" r="2" fill="#2d3748"/>
            {/* Smile */}
            <path d="M36 22 Q40 25 44 22" stroke="#2d3748" strokeWidth="1.5" fill="none"/>
            
            {/* Body - Scrubs */}
            <rect x="25" y="32" width="30" height="50" fill="#38a169" stroke="#2f855a" strokeWidth="2" rx="4"/>
            {/* Scrub details */}
            <rect x="28" y="35" width="24" height="3" fill="#2f855a" rx="1"/>
            <circle cx="35" cy="45" r="1" fill="#2f855a"/>
            <circle cx="45" cy="45" r="1" fill="#2f855a"/>
            
            {/* Badge */}
            <rect x="32" y="40" width="16" height="8" fill="#f8f8f8" stroke="#e2e8f0" rx="2"/>
            <rect x="34" y="42" width="12" height="1" fill="#2d3748"/>
            <rect x="34" y="44" width="8" height="1" fill="#2d3748"/>
            
            {/* Arms */}
            <rect x="15" y="40" width="8" height="25" fill="#f4a261" rx="4"/>
            <rect x="57" y="40" width="8" height="25" fill="#f4a261" rx="4"/>
            
            {/* Hands */}
            <circle cx="19" cy="67" r="4" fill="#f4a261"/>
            <circle cx="61" cy="67" r="4" fill="#f4a261"/>
            
            {/* Medical syringe */}
            <rect x="58" y="62" width="2" height="10" fill="#e2e8f0"/>
            <circle cx="59" cy="60" r="2" fill="#e2e8f0"/>
            <rect x="58.5" y="58" width="1" height="3" fill="#4299e1"/>
            
            {/* Legs */}
            <rect x="32" y="82" width="8" height="25" fill="#f8f8f8" rx="4"/>
            <rect x="42" y="82" width="8" height="25" fill="#f8f8f8" rx="4"/>
            
            {/* Feet - nursing shoes */}
            <ellipse cx="36" cy="110" rx="6" ry="3" fill="#f8f8f8"/>
            <ellipse cx="46" cy="110" rx="6" ry="3" fill="#f8f8f8"/>
          </svg>
          
          {/* Nurse Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-[#213874] shadow">
            Nurse
          </div>
        </div>
      </div>

      {/* Pharmacist */}
      <div 
        className="absolute transition-all duration-300 ease-out"
        style={{
          left: `calc(70% + ${pharmacistX}px)`,
          bottom: `calc(20% + ${pharmacistY}px)`,
          transform: `rotate(${scrollY * 0.06}deg)`
        }}
      >
        <div className="relative">
          {/* Pharmacist SVG */}
          <svg width="80" height="120" viewBox="0 0 80 120" className="drop-shadow-lg">
            {/* Head */}
            <circle cx="40" cy="20" r="12" fill="#f4a261" stroke="#2d3748" strokeWidth="2"/>
            {/* Hair */}
            <path d="M28 8 Q40 4 52 8 Q52 16 40 16 Q28 16 28 8" fill="#2d3748"/>
            {/* Glasses */}
            <circle cx="36" cy="18" r="5" fill="none" stroke="#2d3748" strokeWidth="1"/>
            <circle cx="44" cy="18" r="5" fill="none" stroke="#2d3748" strokeWidth="1"/>
            <line x1="41" y1="18" x2="39" y2="18" stroke="#2d3748" strokeWidth="1"/>
            {/* Eyes */}
            <circle cx="36" cy="18" r="2" fill="#2d3748"/>
            <circle cx="44" cy="18" r="2" fill="#2d3748"/>
            {/* Smile */}
            <path d="M36 22 Q40 25 44 22" stroke="#2d3748" strokeWidth="1.5" fill="none"/>
            
            {/* Body - Pharmacy coat */}
            <rect x="25" y="32" width="30" height="50" fill="#f8f8f8" stroke="#e2e8f0" strokeWidth="2" rx="4"/>
            {/* Shirt underneath */}
            <rect x="30" y="35" width="20" height="20" fill="#805ad5" rx="2"/>
            {/* Pharmacy coat buttons */}
            <circle cx="45" cy="45" r="2" fill="#cbd5e0"/>
            <circle cx="45" cy="55" r="2" fill="#cbd5e0"/>
            <circle cx="45" cy="65" r="2" fill="#cbd5e0"/>
            
            {/* Pharmacy badge */}
            <rect x="28" y="38" width="12" height="12" fill="#f8f8f8" stroke="#e2e8f0" rx="2"/>
            <path d="M32 42 L34 44 L38 40" stroke="#38a169" strokeWidth="2" fill="none"/>
            <text x="32" y="48" fontSize="4" fill="#2d3748">Rx</text>
            
            {/* Arms */}
            <rect x="15" y="40" width="8" height="25" fill="#f4a261" rx="4"/>
            <rect x="57" y="40" width="8" height="25" fill="#f4a261" rx="4"/>
            
            {/* Hands */}
            <circle cx="19" cy="67" r="4" fill="#f4a261"/>
            <circle cx="61" cy="67" r="4" fill="#f4a261"/>
            
            {/* Prescription bottle */}
            <rect x="15" y="62" width="6" height="10" fill="#ff8c42" rx="1"/>
            <rect x="16" y="60" width="4" height="3" fill="#f8f8f8" rx="1"/>
            <rect x="17" y="64" width="2" height="1" fill="#f8f8f8"/>
            <rect x="17" y="66" width="2" height="1" fill="#f8f8f8"/>
            <rect x="17" y="68" width="2" height="1" fill="#f8f8f8"/>
            
            {/* Legs */}
            <rect x="32" y="82" width="8" height="25" fill="#4a5568" rx="4"/>
            <rect x="42" y="82" width="8" height="25" fill="#4a5568" rx="4"/>
            
            {/* Feet */}
            <ellipse cx="36" cy="110" rx="6" ry="3" fill="#2d3748"/>
            <ellipse cx="46" cy="110" rx="6" ry="3" fill="#2d3748"/>
          </svg>
          
          {/* Pharmacist Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-[#213874] shadow">
            Pharmacist
          </div>
        </div>
      </div>
    </div>
  )
}