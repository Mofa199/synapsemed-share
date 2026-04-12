"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Play, 
  Clock, 
  Star, 
  BookOpen, 
  Heart, 
  Share2, 
  Filter,
  Search,
  Trophy,
  Award,
  Stethoscope,
  Brain,
  Activity,
  Eye,
  Ear,
  Baby,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function PatientSimulationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<number[]>([]);

  const simulations = [
    { 
      id: 1, 
      title: "Acute Myocardial Infarction", 
      specialty: "Cardiology", 
      difficulty: "Advanced",
      duration: "25 min",
      rating: 4.8,
      reviews: 124,
      description: "Manage a patient presenting with chest pain and ECG changes consistent with STEMI.",
      tags: ["STEMI", "ACS", "Intervention"],
      completed: true,
      score: 85
    },
    { 
      id: 2, 
      title: "Community-Acquired Pneumonia", 
      specialty: "Pulmonology", 
      difficulty: "Intermediate",
      duration: "20 min",
      rating: 4.6,
      reviews: 98,
      description: "Diagnose and treat a patient with fever, cough, and consolidation on chest X-ray.",
      tags: ["Infection", "Antibiotics", "Diagnosis"],
      completed: true,
      score: 92
    },
    { 
      id: 3, 
      title: "Diabetic Ketoacidosis", 
      specialty: "Endocrinology", 
      difficulty: "Advanced",
      duration: "30 min",
      rating: 4.9,
      reviews: 156,
      description: "Manage a patient with type 1 diabetes presenting with altered mental status.",
      tags: ["Diabetes", "Metabolic", "Emergency"],
      completed: false,
      score: 0
    },
    { 
      id: 4, 
      title: "Acute Appendicitis", 
      specialty: "Surgery", 
      difficulty: "Intermediate",
      duration: "18 min",
      rating: 4.7,
      reviews: 87,
      description: "Diagnose and manage a patient with right lower quadrant abdominal pain.",
      tags: ["Abdominal", "Surgery", "Diagnosis"],
      completed: false,
      score: 0
    },
    { 
      id: 5, 
      title: "Anaphylaxis", 
      specialty: "Emergency Medicine", 
      difficulty: "Beginner",
      duration: "15 min",
      rating: 4.5,
      reviews: 76,
      description: "Recognize and treat a patient with severe allergic reaction.",
      tags: ["Allergy", "Emergency", "Treatment"],
      completed: false,
      score: 0
    },
    { 
      id: 6, 
      title: "Stroke Assessment", 
      specialty: "Neurology", 
      difficulty: "Advanced",
      duration: "22 min",
      rating: 4.8,
      reviews: 142,
      description: "Evaluate and manage a patient with acute neurological deficit.",
      tags: ["Neurology", "Stroke", "Thrombolytics"],
      completed: false,
      score: 0
    },
  ];

  const specialties = [
    { name: "All", count: 24 },
    { name: "Cardiology", count: 5 },
    { name: "Pulmonology", count: 4 },
    { name: "Endocrinology", count: 3 },
    { name: "Surgery", count: 6 },
    { name: "Emergency Medicine", count: 4 },
    { name: "Neurology", count: 2 },
  ];

  const features = [
    {
      icon: Users,
      title: "Realistic Patient Cases",
      description: "Interactive clinical scenarios based on real medical cases"
    },
    {
      icon: Brain,
      title: "Step-by-Step Clinical Reasoning",
      description: "Guided approach to differential diagnosis and management"
    },
    {
      icon: BookOpen,
      title: "Expert Feedback & Reports",
      description: "Detailed performance analysis with learning recommendations"
    },
    {
      icon: Stethoscope,
      title: "Interactive Diagnostics",
      description: "Order and interpret lab tests, imaging, and procedures"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Medical Student",
      content: "synapsemed simulations helped me prepare for my clinical rotations. The realistic cases and immediate feedback were invaluable.",
      rating: 5
    },
    {
      name: "Prof. Michael Chen",
      role: "Residency Program Director",
      content: "Our residents consistently show improved diagnostic skills after using synapsemed. It's become an essential part of our training curriculum.",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Nursing Student",
      content: "The patient simulations are incredibly realistic. I feel much more confident in my clinical decision-making abilities.",
      rating: 4
    }
  ];

  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sim.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === "All" || sim.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Sort simulations based on selected option
  const sortedSimulations = [...filteredSimulations].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "duration") {
      const aMin = parseInt(a.duration);
      const bMin = parseInt(b.duration);
      return aMin - bMin;
    }
    if (sortBy === "difficulty") {
      const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
      return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - 
             difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
    }
    return 0;
  });

  const handleFavorite = (simId: number) => {
    if (favorites.includes(simId)) {
      setFavorites(favorites.filter(id => id !== simId));
      toast({
        title: "Removed from favorites",
        description: "Simulation removed from your favorites list"
      });
    } else {
      setFavorites([...favorites, simId]);
      toast({
        title: "Added to favorites",
        description: "Simulation added to your favorites list"
      });
    }
  };

  const handleShare = (sim: typeof simulations[0]) => {
    if (navigator.share) {
      navigator.share({
        title: sim.title,
        text: sim.description,
      url: typeof window !== 'undefined' ? window.location.href + `/${sim.id}` : ""
      }).catch(() => {
        copyToClipboard(sim);
      });
    } else {
      copyToClipboard(sim);
    }
  };

  const copyToClipboard = (sim: typeof simulations[0]) => {
    const url = typeof window !== 'undefined' ? window.location.href + `/${sim.id}` : "";
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Simulation link copied to clipboard"
    });
  };

  const handleViewCase = (simId: number) => {
    router.push(`/student/simulations/${simId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#213874] to-[#1a6ac3] text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              synapsemed – Interactive Clinical Reasoning Practice
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
              Empowering learners to think like clinicians through realistic patient simulations.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <Button size="lg" className="bg-white text-[#213874] hover:bg-gray-100 w-full sm:w-auto" asChild>
                <Link href="/student/simulations/triage">
                  <Play className="h-5 w-5 mr-2" />
                  Start a Case
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="/about">
                  For Educators
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div id="features" className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#213874] mb-3 md:mb-4">Why Choose synapsemed?</h2>
        <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-8 md:mb-12 px-4">
          Our platform provides comprehensive clinical reasoning training through interactive patient simulations.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#213874] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#213874] mb-2">15,000+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#213874] mb-2">500+</div>
              <div className="text-gray-600">Clinical Cases</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#213874] mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#213874] mb-2">24/7</div>
              <div className="text-gray-600">Access Anytime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#213874] mb-4">What Our Users Say</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Hear from medical students, residents, and educators who have transformed their clinical reasoning skills.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < testimonial.rating 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Simulations Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#213874] mb-4">Explore Clinical Cases</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Browse our extensive library of patient simulations across multiple specialties.
          </p>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search simulations..."
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <select 
                  className="border border-gray-300 rounded-md p-3"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Shortest Duration</option>
                  <option value="difficulty">By Difficulty</option>
                </select>
              </div>
            </div>

            {/* Specialty Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSpecialty === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty("All")}
              >
                All Specialties
              </Button>
              {specialties.slice(1).map((specialty) => (
                <Button
                  key={specialty.name}
                  variant={selectedSpecialty === specialty.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty.name)}
                >
                  {specialty.name} ({specialty.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Simulations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {sortedSimulations.map((sim) => (
              <Card key={sim.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-base md:text-lg">
                        <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="line-clamp-1">{sim.title}</span>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{sim.description}</CardDescription>
                    </div>
                    {sim.completed && (
                      <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex-shrink-0">
                        <Trophy className="h-3 w-3 mr-1" />
                        Done
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {sim.specialty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {sim.duration}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      sim.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                      sim.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {sim.difficulty}
                    </span>
                    <div className="flex items-center text-xs text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="ml-1">{sim.rating} ({sim.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sim.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {sim.completed ? (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your Score</span>
                        <span className="font-bold">{sim.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            sim.score >= 90 ? 'bg-green-500' : 
                            sim.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${sim.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <Button className="flex-1" onClick={() => handleViewCase(sim.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      {sim.completed ? "Review Case" : "Start Simulation"}
                    </Button>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleFavorite(sim.id)}
                        className={favorites.includes(sim.id) ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(sim.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleShare(sim)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedSimulations.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No simulations found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#213874] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Clinical Skills?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of medical professionals who trust synapsemed for their clinical reasoning training.
          </p>
          <Button size="lg" className="bg-[#f3ab1b] text-[#213874] hover:bg-yellow-400" asChild>
            <Link href="/student/simulations/triage">
              <Play className="h-5 w-5 mr-2" />
              Start Your First Case
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}