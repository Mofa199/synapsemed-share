"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  BookOpen,
  Download,
  Printer,
  Share2,
  BarChart3,
  Brain,
  Heart,
  Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CaseReportPage() {
  const [activeTab, setActiveTab] = useState("summary");

  // Mock data for the case report
  const caseData = {
    title: "Acute Myocardial Infarction",
    patient: {
      age: 55,
      gender: "Male",
      chiefComplaint: "Chest pain with radiation to left arm",
      duration: "2 hours"
    },
    diagnosticAccuracy: {
      learner: 92,
      expert: 95
    },
    illnessScriptMatch: 88,
    managementPlan: {
      completeness: 90,
      appropriateness: 85
    }
  };

  // Patient report recap
  const patientReport = `
    55-year-old male presents with acute onset chest pain radiating to left arm, 
    diaphoresis, and nausea for the past 2 hours. Patient appears uncomfortable 
    with vital signs showing hypertension and tachycardia. ECG reveals ST elevations 
    in leads II, III, and aVF. Cardiac enzymes are significantly elevated with 
    troponin I at 4.2 ng/mL and CK-MB at 25 U/L. Echocardiogram shows LVEF of 45% 
    with hypokinesis of the inferior wall.
  `;

  // Diagnostic comparison
  const diagnosticComparison = [
    { 
      category: "History Taking", 
      learner: 95, 
      expert: 98,
      feedback: "Excellent history taking with attention to key features"
    },
    { 
      category: "Physical Examination", 
      learner: 85, 
      expert: 90,
      feedback: "Good examination but could include more detailed cardiovascular assessment"
    },
    { 
      category: "Diagnostic Reasoning", 
      learner: 92, 
      expert: 95,
      feedback: "Strong diagnostic approach with appropriate test ordering"
    },
    { 
      category: "Differential Diagnosis", 
      learner: 88, 
      expert: 92,
      feedback: "Comprehensive differential but consider less common causes"
    }
  ];

  // Management comparison
  const managementComparison = [
    { 
      category: "Immediate Interventions", 
      learner: 90, 
      expert: 95,
      feedback: "Appropriate immediate care but consider earlier pain management"
    },
    { 
      category: "Medication Orders", 
      learner: 85, 
      expert: 90,
      feedback: "Good medication selection but missing some guideline recommendations"
    },
    { 
      category: "Patient Education", 
      learner: 80, 
      expert: 85,
      feedback: "Adequate counseling but could be more comprehensive"
    },
    { 
      category: "Disposition Planning", 
      learner: 95, 
      expert: 95,
      feedback: "Excellent disposition planning with appropriate referrals"
    }
  ];

  // Expert feedback
  const expertFeedback = [
    {
      id: 1,
      category: "Strengths",
      points: [
        "Recognized STEMI pattern on ECG promptly",
        "Ordered appropriate cardiac enzymes",
        "Identified key physical findings",
        "Developed comprehensive management plan"
      ]
    },
    {
      id: 2,
      category: "Areas for Improvement",
      points: [
        "Consider bedside echocardiography earlier",
        "Include more detailed pain assessment",
        "Document patient risk factors more thoroughly",
        "Consider psychiatric consultation for anxiety"
      ]
    },
    {
      id: 3,
      category: "Learning Points",
      points: [
        "STEMI requires immediate reperfusion therapy",
        "Time is muscle - door-to-balloon time should be <90 minutes",
        "Dual antiplatelet therapy is essential in STEMI",
        "Risk stratification helps guide management"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#213874]">Case Report: {caseData.title}</h1>
              <p className="text-gray-600 mt-1">Review your performance and expert feedback</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{caseData.diagnosticAccuracy.learner}%</p>
                  <p className="text-sm text-gray-600">Diagnostic Accuracy</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Your Score</span>
                  <span>Expert: {caseData.diagnosticAccuracy.expert}%</span>
                </div>
                <Progress 
                  value={caseData.diagnosticAccuracy.learner} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{caseData.illnessScriptMatch}%</p>
                  <p className="text-sm text-gray-600">Illness Script Match</p>
                </div>
              </div>
              <div className="mt-3">
                <Progress 
                  value={caseData.illnessScriptMatch} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{caseData.managementPlan.completeness}%</p>
                  <p className="text-sm text-gray-600">Plan Completeness</p>
                </div>
              </div>
              <div className="mt-3">
                <Progress 
                  value={caseData.managementPlan.completeness} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-3 mr-4">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{caseData.managementPlan.appropriateness}%</p>
                  <p className="text-sm text-gray-600">Plan Appropriateness</p>
                </div>
              </div>
              <div className="mt-3">
                <Progress 
                  value={caseData.managementPlan.appropriateness} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "summary"
                  ? "border-[#213874] text-[#213874]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "diagnostics"
                  ? "border-[#213874] text-[#213874]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("diagnostics")}
            >
              Diagnostic Comparison
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "management"
                  ? "border-[#213874] text-[#213874]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("management")}
            >
              Management Review
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "feedback"
                  ? "border-[#213874] text-[#213874]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("feedback")}
            >
              Expert Feedback
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-[#213874]" />
                    Patient Report Recap
                  </CardTitle>
                  <CardDescription>Summary of the clinical case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{patientReport}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Patient</h4>
                      <p className="text-sm text-gray-600">{caseData.patient.age}-year-old {caseData.patient.gender}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Chief Complaint</h4>
                      <p className="text-sm text-gray-600">{caseData.patient.chiefComplaint}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Duration</h4>
                      <p className="text-sm text-gray-600">{caseData.patient.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Diagnosis</h4>
                      <p className="text-sm text-gray-600">{caseData.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Case Type</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Cardiology
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Difficulty</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Intermediate
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "diagnostics" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-[#213874]" />
                  Diagnostic Accuracy Comparison
                </CardTitle>
                <CardDescription>Your performance vs. expert standard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {diagnosticComparison.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">{item.category}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Your Score</p>
                            <p className="text-lg font-bold text-[#213874]">{item.learner}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Expert</p>
                            <p className="text-lg font-bold text-gray-900">{item.expert}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                        <div className="relative h-2 bg-gray-200 rounded-full">
                          <div 
                            className="absolute top-0 left-0 h-2 bg-[#213874] rounded-full" 
                            style={{ width: `${item.learner}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gray-400 rounded-full" 
                            style={{ width: `${item.expert}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 ml-2">{item.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "management" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Management Plan Review
                </CardTitle>
                <CardDescription>Evaluation of your treatment approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {managementComparison.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">{item.category}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Your Score</p>
                            <p className="text-lg font-bold text-[#213874]">{item.learner}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Expert</p>
                            <p className="text-lg font-bold text-gray-900">{item.expert}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                        <div className="relative h-2 bg-gray-200 rounded-full">
                          <div 
                            className="absolute top-0 left-0 h-2 bg-[#213874] rounded-full" 
                            style={{ width: `${item.learner}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gray-400 rounded-full" 
                            style={{ width: `${item.expert}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 ml-2">{item.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "feedback" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-[#213874]" />
                    Expert Feedback to Improve Learning Outcomes
                  </CardTitle>
                  <CardDescription>Detailed guidance for clinical improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {expertFeedback.map((section) => (
                      <div key={section.id}>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">{section.category}</h3>
                        <ul className="space-y-2">
                          {section.points.map((point, index) => (
                            <li key={index} className="flex items-start">
                              {section.category === "Strengths" ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : section.category === "Areas for Improvement" ? (
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="ml-3 text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Overall Performance</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#213874] h-2.5 rounded-full" 
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <p className="text-right text-sm text-gray-600 mt-1">90% Proficiency</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Knowledge Application</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <p className="text-right text-sm text-gray-600 mt-1">85% Applied</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Clinical Reasoning</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                        <p className="text-right text-sm text-gray-600 mt-1">92% Logical</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Review Cardiology Module
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        Practice Similar Cases
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Progress Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline">
            Previous Case
          </Button>
          <div className="space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}