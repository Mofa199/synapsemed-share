"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CurriculumModuleSelectProps {
  curriculumId: string
  moduleId: string
  onCurriculumChange: (value: string) => void
  onModuleChange: (value: string) => void
}

export function CurriculumModuleSelect({
  curriculumId,
  moduleId,
  onCurriculumChange,
  onModuleChange
}: CurriculumModuleSelectProps) {
  const [curriculums, setCurriculums] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [isLoadingCurriculums, setIsLoadingCurriculums] = useState(false)
  const [isLoadingModules, setIsLoadingModules] = useState(false)

  // Fetch curriculums on mount
  useEffect(() => {
    const fetchCurriculums = async () => {
      setIsLoadingCurriculums(true)
      try {
        const res = await fetch('/api/admin/curriculums')
        const data = await res.json()
        if (data.success && data.data) {
          setCurriculums(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch curriculums", error)
      } finally {
        setIsLoadingCurriculums(false)
      }
    }
    fetchCurriculums()
  }, [])

  // Fetch modules when curriculumId changes
  useEffect(() => {
    if (!curriculumId) {
      setModules([])
      return
    }

    const fetchModules = async () => {
      setIsLoadingModules(true)
      try {
        // Find the selected curriculum to get its modules directly if populated
        const selectedCurriculum = curriculums.find(c => c.id === curriculumId)
        if (selectedCurriculum?.modules) {
          setModules(selectedCurriculum.modules)
        } else {
          // Fallback to fetching
          const res = await fetch(`/api/admin/modules?curriculumId=${curriculumId}`)
          const data = await res.json()
          if (data.success && data.data) {
            setModules(data.data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch modules", error)
      } finally {
        setIsLoadingModules(false)
      }
    }
    fetchModules()
  }, [curriculumId, curriculums])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Curriculum (Optional)</Label>
        <Select 
          value={curriculumId || "none"} 
          onValueChange={(val) => {
            const newValue = val === "none" ? "" : val
            onCurriculumChange(newValue)
            onModuleChange("") // Reset module when curriculum changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingCurriculums ? "Loading..." : "Select curriculum"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {curriculums.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Module (Optional)</Label>
        <Select 
          value={moduleId || "none"} 
          onValueChange={(val) => onModuleChange(val === "none" ? "" : val)}
          disabled={!curriculumId || modules.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingModules ? "Loading..." : (!curriculumId ? "Select a curriculum first" : "Select module")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {modules.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
