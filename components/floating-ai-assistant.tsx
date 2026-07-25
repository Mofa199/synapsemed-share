"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Brain, FileText, HelpCircle, Star, Sparkles, X, MessageSquare, Calendar, CheckCircle2, ArrowRight, Zap, Bot, Target } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface FloatingAIAssistantProps {
  context?: string
  studentLevel?: string
}

export function FloatingAIAssistant({ context = 'general', studentLevel }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [questionInput, setQuestionInput] = useState('')
  const [flashcardTopic, setFlashcardTopic] = useState('')
  const [examTopic, setExamTopic] = useState('')
  const [studyPlanTopic, setStudyPlanTopic] = useState('')
  const [examQuestions, setExamQuestions] = useState(5)
  const [results, setResults] = useState<any>(null)
  const [currentService, setCurrentService] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('ask')
  const { toast } = useToast()

  const callAIService = async (service: string, data: any) => {
    setLoading(service)
    setResults(null)
    setCurrentService(null)
    
    try {
      let pageContent = '';
      if (typeof window !== 'undefined') {
        const bodyText = document.body.innerText || '';
        pageContent = bodyText.substring(0, 8000);
      }

      const response = await fetch(`/api/ai/${service}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          context,
          studentLevel,
          pageContent
        }),
      })

      if (!response.ok) throw new Error('AI service request failed')

      const result = await response.json()
      setResults(result)
      setCurrentService(service)
      
      toast({
        title: "Intelligence Synchronized",
        description: `Neural response synthesized via Gemini.`,
      })
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "Failed to connect to AI grid. Please retry.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleAskQuestion = () => {
    if (!questionInput.trim()) return
    callAIService('answer', { question: questionInput })
  }

  const handleGenerateFlashcards = () => {
    if (!flashcardTopic.trim()) return
    callAIService('flashcards', { topic: flashcardTopic, count: 5 })
  }

  const handleGenerateExam = () => {
    if (!examTopic.trim()) return
    callAIService('exam-questions', { topic: examTopic, count: examQuestions })
  }

  const handleGenerateStudyPlan = () => {
    if (!studyPlanTopic.trim()) return
    callAIService('study-plan', { topic: studyPlanTopic })
  }

  const handleGetRecommendations = () => {
    callAIService('recommendations', { currentContext: context, level: studentLevel })
  }

  const renderResults = () => {
    if (!results || !currentService) return null

    return (
      <div className="flex-1 flex flex-col min-h-0 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-2 mb-3 md:mb-4 flex-shrink-0">
           <Zap className="w-3 h-3 md:w-4 md:h-4 text-[#f3ab1b]" />
           <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#213874]/50">Neural Response Grid</span>
        </div>
        
        <div className="flex-1 min-h-0 bg-white shadow-sm rounded-2xl md:rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col">
           <ScrollArea className="flex-1 h-full">
              <div className="p-5 md:p-10 space-y-6 md:space-y-8">
                 {currentService === 'answer' && (
                    <div className="space-y-4 md:space-y-6">
                       <div className="text-[#213874] text-xs md:text-sm leading-[1.8] md:leading-[2] font-medium whitespace-pre-wrap">
                          {results.answer}
                       </div>
                       {results.sources && (
                         <div className="pt-6 md:pt-8 border-t border-gray-100">
                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#f3ab1b] mb-3 md:mb-4">Verified Sources:</p>
                            <div className="flex flex-wrap gap-2">
                               {results.sources.map((s: string, i: number) => (
                                 <Badge key={i} variant="outline" className="text-[9px] md:text-[10px] bg-gray-50 border-gray-200 text-gray-500 py-1 md:py-1.5 px-3 md:px-4 rounded-full">
                                    {s}
                                 </Badge>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                 )}

                 {currentService === 'flashcards' && (
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                       {results.flashcards?.map((card: any, idx: number) => (
                         <div key={idx} className="bg-gray-50/50 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 hover:border-[#f3ab1b]/30 transition-all duration-300 space-y-3 md:space-y-4 group">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#f3ab1b]" />
                               <p className="text-[9px] md:text-[10px] font-black text-[#213874] uppercase tracking-widest">Neural Card {idx + 1}</p>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-[#213874] leading-relaxed">{card.front}</p>
                            <div className="pl-4 md:pl-6 border-l-2 border-[#1a6ac3]/10 py-1">
                               <p className="text-[11px] md:text-xs text-gray-500/80 leading-relaxed font-medium">{card.back}</p>
                            </div>
                            {card.hint && (
                              <div className="flex items-center gap-2 pt-1 md:pt-2">
                                 <Sparkles className="w-3 h-3 text-[#f3ab1b]" />
                                 <p className="text-[9px] md:text-[10px] text-[#f3ab1b] font-bold italic">Strategy: {card.hint}</p>
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                 )}

                 {currentService === 'exam-questions' && (
                    <div className="space-y-6 md:space-y-8">
                       {results.questions?.map((q: any, idx: number) => (
                         <div key={idx} className="bg-gray-50/50 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 space-y-4 md:space-y-6 shadow-sm">
                            <p className="text-xs md:text-sm font-bold text-[#213874] leading-relaxed">{idx+1}. {q.question}</p>
                            <div className="grid grid-cols-1 gap-2 md:gap-3">
                               {q.options?.map((opt: string, i: number) => (
                                 <div key={i} className={`text-[11px] md:text-xs p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-300 ${i === q.correctAnswer ? 'bg-[#213874] text-white border-[#213874] shadow-xl shadow-[#213874]/20' : 'bg-white border-gray-100 text-gray-500'}`}>
                                    <div className="flex items-center justify-between gap-2">
                                       <span className="font-bold">{String.fromCharCode(65+i)}. {opt}</span>
                                       {i === q.correctAnswer && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#f3ab1b] flex-shrink-0" />}
                                    </div>
                                 </div>
                               ))}
                            </div>
                            {q.explanation && (
                              <div className="p-4 md:p-6 bg-[#1a6ac3]/5 rounded-xl md:rounded-2xl border border-[#1a6ac3]/10 space-y-2">
                                 <div className="flex items-center gap-2">
                                    <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1a6ac3]" />
                                    <p className="text-[9px] md:text-[10px] font-black text-[#1a6ac3] uppercase tracking-widest">Clinical Rationale</p>
                                 </div>
                                 <p className="text-[10px] md:text-[11px] text-[#213874]/80 leading-relaxed font-medium">{q.explanation}</p>
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                 )}

                 {currentService === 'study-plan' && (
                    <div className="space-y-8 md:space-y-10">
                       <div className="space-y-2">
                          <h3 className="text-lg md:text-xl font-black text-[#213874] tracking-tight">{results.title}</h3>
                          <p className="text-[10px] md:text-xs text-gray-400 font-medium">Neural synthesis completed for your study path.</p>
                       </div>
                       
                       {results.weeks?.map((week: any, idx: number) => (
                         <div key={idx} className="space-y-4 md:space-y-6">
                            <div className="flex items-center gap-3 md:gap-4">
                               <Badge className="bg-[#213874] text-white h-7 md:h-8 px-3 md:px-4 rounded-full font-bold text-[9px] md:text-[11px]">Week {week.week}</Badge>
                               <span className="text-xs md:text-sm font-black text-[#213874] tracking-wide">{week.focus}</span>
                               <div className="h-px flex-1 bg-gray-100" />
                            </div>
                            <div className="grid gap-3 md:gap-4 pl-3 md:pl-4 border-l-2 border-gray-50">
                               {week.tasks?.map((t: any, i: number) => (
                                 <div key={i} className="bg-white p-4 md:p-5 rounded-xl md:rounded-[1.5rem] border border-gray-100 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-[#213874]/5 p-2 md:p-3 rounded-lg md:rounded-xl border border-[#213874]/10 text-[9px] md:text-[10px] font-black text-[#213874] min-w-[50px] md:min-w-[60px] text-center uppercase tracking-widest">
                                       {t.day.substring(0,3)}
                                    </div>
                                    <div className="space-y-0.5 md:space-y-1">
                                       <p className="text-[11px] md:text-xs font-bold text-[#213874] leading-tight">{t.task}</p>
                                       <div className="flex items-center gap-2">
                                          <Badge variant="ghost" className="text-[8px] md:text-[9px] p-0 font-bold text-gray-400">Target: {t.resource}</Badge>
                                       </div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-auto text-gray-200" />
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                 )}

                 {currentService === 'recommendations' && (
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                       {results.recommendations?.map((rec: any, idx: number) => (
                         <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm border-l-[6px] md:border-l-8 border-l-[#f3ab1b] space-y-3 md:space-y-4 hover:shadow-xl hover:shadow-[#213874]/5 transition-all">
                            <div className="flex items-center justify-between gap-4">
                               <h4 className="text-sm md:text-base font-black text-[#213874]">{rec.title}</h4>
                               <Badge className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest h-5 md:h-6 px-2 md:px-3 rounded-full flex-shrink-0 ${rec.priority === 'high' ? 'bg-red-500 text-white' : 'bg-[#1a6ac3] text-white'}`}>
                                  {rec.priority}
                               </Badge>
                            </div>
                            <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed font-medium">{rec.description}</p>
                            {rec.resources && (
                              <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                                 {rec.resources.map((res: string, i: number) => (
                                   <Badge key={i} variant="outline" className="text-[8px] md:text-[9px] font-black text-[#1a6ac3] bg-[#1a6ac3]/5 border-[#1a6ac3]/20 py-0.5 md:py-1 px-2 md:px-3">
                                      {res.toUpperCase()}
                                   </Badge>
                                 ))}
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                 )}
              </div>
           </ScrollArea>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-2xl h-14 w-14 md:h-16 md:w-16 shadow-2xl hover:scale-110 transition-all duration-500 bg-[#213874] text-white border-2 border-white/20"
        >
          <Bot className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
        <div className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-[#f3ab1b] rounded-full border-2 border-white flex items-center justify-center animate-bounce">
          <span className="text-[7px] md:text-[8px] text-[#213874] font-black">AI</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl h-[95vh] md:h-[85vh] w-[95vw] md:w-full bg-[#f4f4f6] border-none rounded-2xl md:rounded-[3rem] p-0 overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
          <DialogHeader className="sr-only">
            <DialogTitle>SynapseMed Neural AI Assistant</DialogTitle>
            <DialogDescription>Your AI-powered medical learning companion</DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col p-5 md:p-12 min-h-0">
             {/* Sticky Header */}
             <div className="flex items-center justify-between mb-6 md:mb-10 flex-shrink-0">
                <div className="space-y-1">
                   <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-2.5 bg-[#213874] rounded-xl md:rounded-2xl text-white shadow-2xl shadow-[#213874]/30">
                         <Bot className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-3xl font-black tracking-tighter text-[#213874]">Neural <span className="text-[#1a6ac3]">AI</span></h2>
                        <div className="flex items-center gap-2 mt-0.5">
                           <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse" />
                           <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em]">Grid v1.5</p>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                   <Badge className="hidden lg:flex bg-white text-[#213874] border border-gray-100 font-black px-5 py-2 rounded-full shadow-sm text-[10px] uppercase tracking-widest">
                      Gemini Neural Core
                   </Badge>
                   <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-gray-200">
                      <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                   </Button>
                </div>
             </div>

             <div className="flex-1 flex flex-col min-h-0">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-12 min-h-0 h-full">
                   {/* Left Panel: Inputs */}
                   <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4 md:gap-8 flex-shrink-0 min-h-0 md:h-full max-h-[40vh] md:max-h-full">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 h-full">
                         <TabsList className="bg-white border border-gray-100 p-1 md:p-1.5 rounded-xl md:rounded-2xl w-full grid grid-cols-5 gap-0.5 md:gap-1 mb-4 md:mb-8 shadow-sm flex-shrink-0">
                            {[
                              { id: 'ask', icon: MessageSquare },
                              { id: 'flashcards', icon: FileText },
                              { id: 'exam', icon: Target },
                              { id: 'plan', icon: Calendar },
                              { id: 'recommend', icon: Star },
                            ].map(tab => (
                              <TabsTrigger key={tab.id} value={tab.id} className="rounded-lg md:rounded-xl py-1.5 md:py-2.5 data-[state=active]:bg-[#213874] data-[state=active]:text-white text-gray-400 transition-all">
                                 <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                              </TabsTrigger>
                            ))}
                         </TabsList>

                         <div className="flex-1 min-h-0 bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 h-full pr-2 md:pr-4">
                               <TabsContent value="ask" className="space-y-4 md:space-y-6 m-0 animate-in fade-in duration-500">
                                  <div className="space-y-4 md:space-y-6">
                                     <div className="space-y-1 md:space-y-2">
                                        <h3 className="text-[9px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.2em]">Neural Clinical Query</h3>
                                        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium">Deep synthesis of clinical vectors.</p>
                                     </div>
                                     <Textarea
                                       placeholder="Analyze clinical case..."
                                       value={questionInput}
                                       onChange={(e) => setQuestionInput(e.target.value)}
                                       className="bg-gray-50 border-none rounded-xl md:rounded-[1.5rem] h-24 md:h-48 focus:ring-2 focus:ring-[#213874]/10 text-[#213874] text-xs md:text-sm font-medium placeholder:text-gray-300 resize-none p-3 md:p-5"
                                     />
                                     <Button onClick={handleAskQuestion} disabled={loading === 'answer'} className="w-full h-12 md:h-16 bg-[#213874] hover:bg-[#1a6ac3] text-white font-black rounded-xl md:rounded-2xl shadow-2xl shadow-[#213874]/20 transition-all uppercase tracking-widest text-[9px] md:text-[11px]">
                                        {loading === 'answer' ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Zap className="w-3 h-3 md:w-4 md:h-4 text-[#f3ab1b]" /> Run Synthesis</div>}
                                     </Button>
                                  </div>
                               </TabsContent>

                               <TabsContent value="flashcards" className="space-y-4 md:space-y-6 m-0 animate-in fade-in duration-500">
                                  <div className="space-y-4 md:space-y-6">
                                     <div className="space-y-1 md:space-y-2">
                                        <h3 className="text-[9px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.2em]">Recall Generation</h3>
                                        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium">Build active recall nodes.</p>
                                     </div>
                                     <Input
                                       placeholder="Topic..."
                                       value={flashcardTopic}
                                       onChange={(e) => setFlashcardTopic(e.target.value)}
                                       className="bg-gray-50 border-none h-12 md:h-16 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#213874]/10 text-[#213874] text-xs md:text-sm font-bold px-4 md:px-6 shadow-inner"
                                     />
                                     <Button onClick={handleGenerateFlashcards} disabled={loading === 'flashcards'} className="w-full h-12 md:h-16 bg-[#213874] hover:bg-[#1a6ac3] text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[9px] md:text-[11px]">
                                        {loading === 'flashcards' ? <Loader2 className="animate-spin" /> : "Synthesize Cards"}
                                     </Button>
                                  </div>
                               </TabsContent>

                               <TabsContent value="exam" className="space-y-4 md:space-y-6 m-0">
                                  <div className="space-y-4 md:space-y-6">
                                     <div className="space-y-1 md:space-y-2">
                                        <h3 className="text-[9px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.2em]">MCQ Synthesis</h3>
                                        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium">Generate clinical testing nodes.</p>
                                     </div>
                                     <Input
                                       placeholder="Subject..."
                                       value={examTopic}
                                       onChange={(e) => setExamTopic(e.target.value)}
                                       className="bg-gray-50 border-none h-12 md:h-16 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#213874]/10 text-[#213874] text-xs md:text-sm font-bold px-4 md:px-6"
                                     />
                                     <Button onClick={handleGenerateExam} disabled={loading === 'exam-questions'} className="w-full h-12 md:h-16 bg-[#213874] hover:bg-[#1a6ac3] text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[9px] md:text-[11px]">
                                        {loading === 'exam-questions' ? <Loader2 className="animate-spin" /> : "Build Exam Matrix"}
                                     </Button>
                                  </div>
                               </TabsContent>

                               <TabsContent value="plan" className="space-y-4 md:space-y-6 m-0">
                                  <div className="space-y-4 md:space-y-6">
                                     <div className="space-y-1 md:space-y-2">
                                        <h3 className="text-[9px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.2em]">Path Synthesis</h3>
                                        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium">Adaptive learning paths.</p>
                                     </div>
                                     <Input
                                       placeholder="Learning Goal..."
                                       value={studyPlanTopic}
                                       onChange={(e) => setStudyPlanTopic(e.target.value)}
                                       className="bg-gray-50 border-none h-12 md:h-16 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#213874]/10 text-[#213874] text-xs md:text-sm font-bold px-4 md:px-6"
                                     />
                                     <Button onClick={handleGenerateStudyPlan} disabled={loading === 'study-plan'} className="w-full h-12 md:h-16 bg-[#213874] hover:bg-[#1a6ac3] text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[9px] md:text-[11px]">
                                        {loading === 'study-plan' ? <Loader2 className="animate-spin" /> : "Synthesize Path"}
                                     </Button>
                                  </div>
                               </TabsContent>

                               <TabsContent value="recommend" className="space-y-4 md:space-y-6 m-0">
                                  <div className="space-y-4 md:space-y-6">
                                     <div className="space-y-1 md:space-y-2">
                                        <h3 className="text-[9px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.2em]">Neural Tips</h3>
                                        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium leading-relaxed">Personalized clinical tips.</p>
                                     </div>
                                     <div className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-[2rem] border border-gray-100 flex items-center justify-center">
                                        <Brain className="w-8 h-8 md:w-12 md:h-12 text-[#213874]/10" />
                                     </div>
                                     <Button onClick={handleGetRecommendations} disabled={loading === 'recommendations'} className="w-full h-12 md:h-16 bg-[#213874] hover:bg-[#1a6ac3] text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[9px] md:text-[11px]">
                                        {loading === 'recommendations' ? <Loader2 className="animate-spin" /> : "Run Insights"}
                                     </Button>
                                  </div>
                               </TabsContent>
                            </ScrollArea>
                         </div>
                      </Tabs>
                   </div>

                   {/* Right Panel: Scrollable Results */}
                   <div className="flex-1 min-h-0 bg-white/40 rounded-2xl md:rounded-[3rem] p-0.5 md:p-1 border border-white/50 flex flex-col shadow-inner backdrop-blur-sm h-full overflow-hidden">
                      <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
                        {loading ? (
                           <div className="flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-8 p-6">
                              <div className="relative scale-75 md:scale-100">
                                 <div className="absolute -inset-8 bg-[#213874]/5 rounded-full animate-ping" />
                                 <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-[#213874]/10" />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <Bot className="w-4 h-4 md:w-6 md:h-6 text-[#213874] animate-pulse" />
                                 </div>
                              </div>
                              <div className="text-center space-y-1 md:space-y-2">
                                 <p className="text-[10px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.3em] md:tracking-[0.5em]">Neural Processing</p>
                                 <p className="text-[10px] md:text-xs text-gray-400 font-medium animate-pulse">Analyzing vectors via Gemini...</p>
                              </div>
                           </div>
                        ) : results ? (
                           renderResults()
                        ) : (
                           <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center space-y-6 md:space-y-8 opacity-40">
                              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-xl border border-gray-50 scale-75 md:scale-100">
                                 <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-[#213874]" />
                              </div>
                              <div className="max-w-[240px] md:max-w-[280px] space-y-2 md:space-y-3">
                                 <p className="text-[10px] md:text-[11px] font-black text-[#213874] uppercase tracking-[0.2em] md:tracking-[0.3em]">Awaiting Command</p>
                                 <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed font-bold">Initialize synthesis to generate medical content.</p>
                              </div>
                           </div>
                        )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}