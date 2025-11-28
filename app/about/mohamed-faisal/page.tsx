"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MohamedFaisalBiography() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/about">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </Link>
          </Button>

          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 flex items-center justify-center p-8 bg-gray-50">
                {/* Founder image without frame/border */}
                <div className="relative">
                  <img 
                    src="/placeholder.svg?height=300&width=300&text=MF" 
                    alt="Mohamed Faisal MD" 
                    className="w-64 h-64 object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl text-[#213874] mb-2">Mohamed Faisal, MD</CardTitle>
                  <div className="text-xl text-[#f3ab1b]">
                    Founder & CEO, Synapse Med
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">
                      Dr. Mohamed Faisal is a renowned medical educator and technology innovator with over 20 years of experience in healthcare and digital learning. His passion for transforming medical education through technology led him to establish Synapse Med in 2018.
                    </p>
                    <h2 className="text-2xl font-bold text-[#213874] mt-8 mb-4">Professional Background</h2>
                    <p className="text-gray-700 mb-4">
                      Before founding Synapse Med, Dr. Faisal served as the Director of Digital Learning at a prestigious medical school, where he pioneered several AI-powered educational tools that significantly improved student outcomes. His research in medical informatics and educational technology has been published in numerous peer-reviewed journals.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Dr. Faisal holds an MD from Harvard Medical School and completed his residency in Internal Medicine at Johns Hopkins Hospital. He is board-certified in Internal Medicine and has additional certifications in Medical Informatics and Educational Technology.
                    </p>
                    <h2 className="text-2xl font-bold text-[#213874] mt-8 mb-4">Vision and Leadership</h2>
                    <p className="text-gray-700 mb-4">
                      Under his leadership, Synapse Med has grown to become one of the leading medical education platforms, serving over 50,000 students across medical, nursing, and pharmacy programs worldwide. His vision continues to drive innovation in healthcare education, making quality medical learning accessible to students globally.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Dr. Faisal is committed to bridging the gap between traditional medical education and cutting-edge technology. He believes that by leveraging AI and personalized learning approaches, we can create more effective and engaging educational experiences that better prepare healthcare professionals for real-world practice.
                    </p>
                    <h2 className="text-2xl font-bold text-[#213874] mt-8 mb-4">Personal Philosophy</h2>
                    <p className="text-gray-700 mb-4 italic">
                      "Education is the foundation of healthcare, and technology is the key to making it more accessible and effective. My mission is to ensure that every healthcare student, regardless of their background or location, has access to the highest quality education possible."
                    </p>
                    <h2 className="text-2xl font-bold text-[#213874] mt-8 mb-4">Research and Publications</h2>
                    <p className="text-gray-700 mb-4">
                      Dr. Faisal has authored over 50 peer-reviewed publications focusing on:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                      <li>Medical education technology</li>
                      <li>AI applications in healthcare learning</li>
                      <li>Personalized learning approaches</li>
                      <li>Gamification in medical education</li>
                      <li>Assessment and evaluation methods</li>
                    </ul>
                    <h2 className="text-2xl font-bold text-[#213874] mt-8 mb-4">Awards and Recognition</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                      <li>Excellence in Medical Education Technology Award (2022)</li>
                      <li>Innovation in Healthcare Education Award (2020)</li>
                      <li>Distinguished Service in Medical Informatics (2019)</li>
                      <li>Young Investigator Award, Medical Education Research (2017)</li>
                    </ul>
                    <h2 className="text-2xl font-bold text-[#213874] mt-8 mb-4">Contact</h2>
                    <p className="text-gray-700 mb-4">
                      For speaking engagements, partnerships, or media inquiries:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                      <li>Email: m.faisal@synapsemedical.com</li>
                      <li>LinkedIn: linkedin.com/in/mohamedfaisal-md</li>
                    </ul>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}