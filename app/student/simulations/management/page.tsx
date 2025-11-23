"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Stethoscope, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  FileText,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  User,
  Heart,
  Zap
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ManagementSimulationPage() {
  const [additionalDiagnostics, setAdditionalDiagnostics] = useState([
    { id: 1, name: "Serial Troponins", ordered: true },
    { id: 2, name: "Continuous ECG Monitoring", ordered: true }
  ]);
  
  const [treatments, setTreatments] = useState([
    { id: 1, name: "Aspirin 325mg PO", administered: true },
    { id: 2, name: "Nitroglycerin SL", administered: false },
    { id: 3, name: "Heparin IV", administered: false }
  ]);
  
  const [counseling, setCounseling] = useState("Explain the diagnosis and treatment plan. Discuss lifestyle modifications including diet and exercise. Emphasize medication compliance.");
  const [urgency, setUrgency] = useState("urgent");
  const [concern, setConcern] = useState(true);

  const addDiagnostic = (name: string) => {
    setAdditionalDiagnostics([
      ...additionalDiagnostics,
      { id: Date.now(), name, ordered: true }
    ]);
  };

  const removeDiagnostic = (id: number) => {
    setAdditionalDiagnostics(additionalDiagnostics.filter(d => d.id !== id));
  };

  const toggleDiagnostic = (id: number) => {
    setAdditionalDiagnostics(
      additionalDiagnostics.map(d => 
        d.id === id ? { ...d, ordered: !d.ordered } : d
      )
    );
  };

  const addTreatment = (name: string) => {
    setTreatments([
      ...treatments,
      { id: Date.now(), name, administered: false }
    ]);
  };

  const removeTreatment = (id: number) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };

  const toggleTreatment = (id: number) => {
    setTreatments(
      treatments.map(t => 
        t.id === id ? { ...t, administered: !t.administered } : t
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Management Options */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#213874]">Management Options</h2>
          <p className="text-sm text-gray-600">Select interventions for this case</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Referrals */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-[#213874]" />
                Referrals
              </h3>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="icu">Intensive Care</SelectItem>
                    <SelectItem value="surgery">Cardiothoracic Surgery</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Referral
                </Button>
              </div>
            </div>

            {/* Additional Diagnostics */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Stethoscope className="h-4 w-4 mr-2 text-[#213874]" />
                Additional Diagnostics
              </h3>
              <div className="space-y-2">
                <Select onValueChange={addDiagnostic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add diagnostic test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serial ECGs">Serial ECGs</SelectItem>
                    <SelectItem value="Arterial Blood Gas">Arterial Blood Gas</SelectItem>
                    <SelectItem value="Chest X-ray">Chest X-ray</SelectItem>
                    <SelectItem value="Complete Metabolic Panel">Complete Metabolic Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Treatments */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                Treatments
              </h3>
              <div className="space-y-2">
                <Select onValueChange={addTreatment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morphine IV">Morphine IV</SelectItem>
                    <SelectItem value="Beta-blocker IV">Beta-blocker IV</SelectItem>
                    <SelectItem value="ACE Inhibitor PO">ACE Inhibitor PO</SelectItem>
                    <SelectItem value="Statin Therapy">Statin Therapy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Counseling Topics */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-[#213874]" />
                Counseling Topics
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Medication Compliance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Diet and Lifestyle
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Exercise Recommendations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Risk Factor Modification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Management Plan */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-[#213874]">Management: Acute Myocardial Infarction</h1>
          <p className="text-gray-600">Develop a comprehensive treatment plan</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Additional Diagnostics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-[#213874]" />
                Additional Diagnostics
              </CardTitle>
              <CardDescription>Tests to monitor patient progress</CardDescription>
            </CardHeader>
            <CardContent>
              {additionalDiagnostics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Stethoscope className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No additional diagnostics ordered</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {additionalDiagnostics.map((diagnostic) => (
                    <div 
                      key={diagnostic.id} 
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={diagnostic.ordered}
                          onChange={() => toggleDiagnostic(diagnostic.id)}
                          className="h-4 w-4 text-[#213874] rounded"
                        />
                        <span className="ml-3 font-medium">{diagnostic.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDiagnostic(diagnostic.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Treatments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Treatments
              </CardTitle>
              <CardDescription>Medications and interventions</CardDescription>
            </CardHeader>
            <CardContent>
              {treatments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No treatments ordered</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {treatments.map((treatment) => (
                    <div 
                      key={treatment.id} 
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={treatment.administered}
                          onChange={() => toggleTreatment(treatment.id)}
                          className="h-4 w-4 text-[#213874] rounded"
                        />
                        <span className="ml-3 font-medium">{treatment.name}</span>
                        {treatment.administered && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTreatment(treatment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Counseling & Patient Education */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#213874]" />
                Counseling & Patient Education
              </CardTitle>
              <CardDescription>Document patient education and counseling</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Document counseling provided to the patient..."
                value={counseling}
                onChange={(e) => setCounseling(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Medication Education
                </Button>
                <Button variant="outline" size="sm">
                  Lifestyle Modifications
                </Button>
                <Button variant="outline" size="sm">
                  Follow-up Appointments
                </Button>
                <Button variant="outline" size="sm">
                  Warning Signs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timing & Urgency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#213874]" />
                Timing & Urgency
              </CardTitle>
              <CardDescription>Specify treatment urgency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Urgency Level</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="semi-urgent">Semi-Urgent</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Degree of Concern</Label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${concern ? 'text-red-600' : 'text-green-600'}`}>
                      {concern ? 'High' : 'Low'}
                    </span>
                    <Switch
                      checked={concern}
                      onCheckedChange={setConcern}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Decision Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Clinical Decision Support
              </CardTitle>
              <CardDescription>Guidelines and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="font-medium text-sm">STEMI Protocol</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Activate cardiac catheterization lab within 90 minutes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="font-medium text-sm">Dual Antiplatelet Therapy</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Aspirin + P2Y12 inhibitor recommended
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="font-medium text-sm">Contraindications</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Review for bleeding risks before anticoagulation
                    </p>
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
                Save Draft
              </Button>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                Submit Case for Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}