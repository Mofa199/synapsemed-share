"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  BookOpen,
  FileText,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DxPauseSimulationPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("findings");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>("");

  // Case findings
  const caseFindings = [
    {
      id: "history",
      title: "History",
      content: [
        "55-year-old male with sudden onset chest pain",
        "Pain radiates to left arm and jaw",
        "Associated with diaphoresis and nausea",
        "Duration: 2 hours",
        "No relief with rest or antacids"
      ]
    },
    {
      id: "exam",
      title: "Physical Examination",
      content: [
        "BP: 160/95 mmHg, HR: 110 bpm (irregular), RR: 22/min",
        "Diaphoretic, appears uncomfortable",
        "Lungs: Clear bilaterally",
        "Heart: Tachycardic, no murmurs",
        "Abdomen: Soft, non-tender",
        "Neuro: Alert and oriented x3"
      ]
    },
    {
      id: "diagnostics",
      title: "Diagnostics",
      content: [
        "ECG: ST elevations in leads II, III, aVF",
        "Troponin I: 4.2 ng/mL (normal <0.04 ng/mL)",
        "CK-MB: 25 U/L (normal <5 U/L)",
        "Echocardiogram: LVEF 45%, hypokinesis of inferior wall"
      ]
    }
  ];

  // Differential diagnoses
  const differentialDiagnoses = [
    { id: "ami", name: "Acute Myocardial Infarction", likelihood: 95, evidence: "ST elevations, elevated troponin, wall motion abnormality" },
    { id: "ua", name: "Unstable Angina", likelihood: 70, evidence: "Ischemic chest pain, risk factors" },
    { id: "pe", name: "Pulmonary Embolism", likelihood: 40, evidence: "Pleuritic chest pain, tachycardia" },
    { id: "dissection", name: "Aortic Dissection", likelihood: 30, evidence: "Severe chest pain, hypertension" },
    { id: "pericarditis", name: "Pericarditis", likelihood: 25, evidence: "Chest pain, pericardial friction rub" },
    { id: "gerd", name: "GERD", likelihood: 20, evidence: "Chest pain, burning sensation" }
  ];

  // Expert top 3 diagnoses
  const expertDiagnoses = [
    { id: "ami", name: "Acute Myocardial Infarction", confidence: "High" },
    { id: "ua", name: "Unstable Angina", confidence: "Moderate" },
    { id: "pe", name: "Pulmonary Embolism", confidence: "Low" }
  ];

  // Illness scripts comparison
  const illnessScripts = {
    learner: {
      title: "Learner's Mental Model",
      content: "Middle-aged male with chest pain, elevated cardiac enzymes, ECG changes → AMI",
      strengths: ["Recognized STEMI pattern", "Ordered appropriate diagnostics"],
      areasForImprovement: ["Consider other life-threatening causes", "More detailed risk stratification"]
    },
    expert: {
      title: "Expert Mental Model",
      content: "STEMI with hemodynamic instability requiring immediate reperfusion therapy",
      approach: "Activate cardiac cath lab, administer aspirin, consider anticoagulation"
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Case Findings */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#213874]">Case Findings</h2>
          <p className="text-sm text-gray-600">Review key clinical information</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {caseFindings.map((section) => (
              <Card key={section.id}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-[#213874]" />
                      {section.title}
                    </CardTitle>
                    {expandedSection === section.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {expandedSection === section.id && (
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - DxPause Reflection */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-[#213874]">DxPause: Acute Myocardial Infarction</h1>
          <p className="text-gray-600">Reflect on your diagnostic reasoning</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Differential Diagnosis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-[#213874]" />
                Your Differential Diagnosis
              </CardTitle>
              <CardDescription>Rank your top diagnostic considerations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {differentialDiagnoses.map((dx, index) => (
                  <div 
                    key={dx.id} 
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{dx.name}</h4>
                      <p className="text-sm text-gray-600">{dx.evidence}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{dx.likelihood}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#213874] h-2 rounded-full" 
                          style={{ width: `${dx.likelihood}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expert Top 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Expert Top 3 Diagnoses
              </CardTitle>
              <CardDescription>Compare with expert diagnostic reasoning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rank your most likely diagnosis:
                  </label>
                  <Select value={selectedDiagnosis} onValueChange={setSelectedDiagnosis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your diagnosis" />
                    </SelectTrigger>
                    <SelectContent>
                      {differentialDiagnoses.map((dx) => (
                        <SelectItem key={dx.id} value={dx.id}>
                          {dx.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {expertDiagnoses.map((dx, index) => (
                    <div 
                      key={dx.id} 
                      className="flex items-center p-3 border rounded-lg bg-blue-50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#213874] flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{dx.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {dx.confidence} Confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Illness Script Comparison */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-[#213874]" />
                Illness Script Comparison
              </CardTitle>
              <CardDescription>Compare your mental model with expert reasoning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3 text-[#213874]">
                    {illnessScripts.learner.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{illnessScripts.learner.content}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-green-700 mb-1">Strengths:</h4>
                      <ul className="space-y-1">
                        {illnessScripts.learner.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-yellow-700 mb-1">Areas for Improvement:</h4>
                      <ul className="space-y-1">
                        {illnessScripts.learner.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-lg mb-3 text-[#213874]">
                    {illnessScripts.expert.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{illnessScripts.expert.content}</p>
                  
                  <div>
                    <h4 className="font-medium text-sm text-blue-700 mb-2">Expert Approach:</h4>
                    <p className="text-sm text-gray-700">{illnessScripts.expert.approach}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                Save Reflection
              </Button>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                Next: Management
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}