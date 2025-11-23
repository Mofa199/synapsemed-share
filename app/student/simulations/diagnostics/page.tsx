"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Heart, 
  Zap,
  Eye,
  Ear,
  Stethoscope,
  Baby,
  Shield,
  Radio,
  Droplets,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Search
} from "lucide-react";

export default function DiagnosticsSimulationPage() {
  const [orderedTests, setOrderedTests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Available diagnostic tests
  const diagnosticCategories = [
    {
      id: "lab",
      name: "Laboratory Tests",
      icon: Droplets,
      tests: [
        { id: "cbc", name: "Complete Blood Count", description: "Assesses overall health and detects disorders", time: "30 min" },
        { id: "cmp", name: "Comprehensive Metabolic Panel", description: "Evaluates organ function and electrolyte balance", time: "45 min" },
        { id: "cardiac", name: "Cardiac Enzymes", description: "Detects heart muscle damage", time: "60 min" },
        { id: "troponin", name: "Troponin I", description: "Specific marker for myocardial injury", time: "45 min" },
        { id: "ckmb", name: "CK-MB", description: "Cardiac-specific creatine kinase", time: "30 min" },
        { id: "d-dimer", name: "D-Dimer", description: "Detects blood clot breakdown products", time: "20 min" },
      ]
    },
    {
      id: "imaging",
      name: "Imaging",
      icon: Radio,
      tests: [
        { id: "chest-xray", name: "Chest X-ray", description: "Visualizes heart, lungs, and chest structures", time: "15 min" },
        { id: "ct-chest", name: "CT Chest with Contrast", description: "Detailed imaging of chest structures", time: "30 min" },
        { id: "ct-coronary", name: "CT Coronary Angiography", description: "Visualizes coronary arteries", time: "45 min" },
        { id: "echo", name: "Echocardiogram", description: "Ultrasound of the heart", time: "20 min" },
      ]
    },
    {
      id: "microbiology",
      name: "Microbiology",
      icon: Shield,
      tests: [
        { id: "blood-culture", name: "Blood Cultures", description: "Detects bloodstream infections", time: "24 hrs" },
        { id: "urine-culture", name: "Urine Culture", description: "Detects urinary tract infections", time: "48 hrs" },
      ]
    }
  ];

  const orderTest = (testId: string) => {
    if (!orderedTests.includes(testId)) {
      setOrderedTests([...orderedTests, testId]);
    }
  };

  const removeTest = (testId: string) => {
    setOrderedTests(orderedTests.filter(id => id !== testId));
  };

  // Mock test results
  const testResults = {
    "troponin": {
      name: "Troponin I",
      result: "4.2 ng/mL",
      normal: "<0.04 ng/mL",
      interpretation: "Significantly elevated, indicating myocardial injury",
      status: "critical"
    },
    "ckmb": {
      name: "CK-MB",
      result: "25 U/L",
      normal: "<5 U/L",
      interpretation: "Elevated, suggesting cardiac muscle damage",
      status: "abnormal"
    },
    "echo": {
      name: "Echocardiogram",
      result: "LVEF 45%, hypokinesis of inferior wall",
      normal: "LVEF >55%",
      interpretation: "Reduced ejection fraction with regional wall motion abnormality",
      status: "abnormal"
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Available Tests */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#213874]">Diagnostic Tests</h2>
          <p className="text-sm text-gray-600">Select tests to order for this case</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tests..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Test Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {diagnosticCategories.map((category) => {
              const Icon = category.icon;
              const filteredTests = category.tests.filter(test => 
                test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                test.description.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              if (filteredTests.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <div className="flex items-center mb-3">
                    <Icon className="h-5 w-5 text-[#213874] mr-2" />
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {filteredTests.map((test) => (
                      <Card 
                        key={test.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => orderTest(test.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{test.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{test.description}</p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {test.time}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Ordered Tests and Results */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-[#213874]">Diagnostics: Acute Myocardial Infarction</h1>
          <p className="text-gray-600">Order tests and review results</p>
        </div>

        {/* Ordered Tests */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Ordered Tests ({orderedTests.length})</h2>
            <Button size="sm" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Results
            </Button>
          </div>
          
          {orderedTests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No tests ordered yet</p>
              <p className="text-sm mt-1">Select tests from the panel on the left</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orderedTests.map((testId) => {
                // Find the test in all categories
                let test = null;
                for (const category of diagnosticCategories) {
                  const found = category.tests.find(t => t.id === testId);
                  if (found) {
                    test = found;
                    break;
                  }
                }
                
                if (!test) return null;
                
                const result = testResults[testId as keyof typeof testResults];
                
                return (
                  <Card key={testId} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeTest(testId)}
                    >
                      <XCircle className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="text-md flex items-center">
                        {result ? (
                          result.status === "critical" ? (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          ) : result.status === "abnormal" ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          )
                        ) : (
                          <Activity className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        {test.name}
                      </CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {result ? (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Result:</span>
                            <span className={`font-mono ${
                              result.status === "critical" ? "text-red-600" :
                              result.status === "abnormal" ? "text-yellow-600" :
                              "text-green-600"
                            }`}>
                              {result.result}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2 text-sm">
                            <span>Normal:</span>
                            <span className="font-mono text-gray-600">{result.normal}</span>
                          </div>
                          <div className="text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium">Interpretation:</span>
                            <p className="mt-1 text-gray-700">{result.interpretation}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#213874] mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Processing results...</p>
                          <p className="text-xs text-gray-500 mt-1">{test.time}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="flex-1 flex flex-col p-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-[#213874]" />
                Diagnostic Summary
              </CardTitle>
              <CardDescription>Review your diagnostic approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <textarea
                    className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm"
                    placeholder="Document your diagnostic reasoning and findings..."
                    defaultValue="Based on the patient's presentation of chest pain with radiation to the left arm, diaphoresis, and nausea, I ordered cardiac enzymes and an echocardiogram. The elevated troponin and CK-MB along with the echocardiogram showing hypokinesis of the inferior wall strongly support the diagnosis of acute myocardial infarction."
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      Previous
                    </Button>
                    <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                      Next: DxPause
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}