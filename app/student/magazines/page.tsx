"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Library,
  Calendar,
  Eye,
  Loader2,
  FileText
} from "lucide-react";

export default function StudentMagazinesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [magazines, setMagazines] = useState<any[]>([]);

  const categories = ["All", "Medical", "Research", "News", "Student Life"];

  useEffect(() => {
    fetchMagazines();
  }, [selectedCategory]);

  const fetchMagazines = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/magazines?category=${selectedCategory}`);
      const data = await response.json();
      
      if (data.success) {
        setMagazines(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching magazines:', error);
      toast({
        title: "Error",
        description: "Failed to load magazines",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMagazines = magazines.filter(mag => 
    mag.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (mag.description && mag.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-[#213874] text-white pt-16 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Library className="h-8 w-8 text-blue-300" />
            <h1 className="text-3xl md:text-4xl font-bold">Medical Magazines</h1>
          </div>
          <p className="text-blue-100 max-w-2xl text-lg">
            Stay updated with the latest in medical science, university news, and student research.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10">
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search magazines, topics, or issues..."
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category ? "bg-[#213874]" : "bg-white"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
          </div>
        ) : filteredMagazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMagazines.map((mag) => (
              <Card key={mag.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border-0 shadow-md">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {mag.coverUrl ? (
                    <img 
                      src={mag.coverUrl} 
                      alt={mag.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#213874] to-blue-900 text-white">
                      <Library className="h-16 w-16 mb-4 opacity-50" />
                      <span className="font-serif text-2xl font-bold px-4 text-center">{mag.title}</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#213874] font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                    {mag.category || "General"}
                  </div>
                  {mag.issue && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                      Issue {mag.issue}
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {mag.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {mag.description || "No description available for this issue."}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{mag.publishedAt ? new Date(mag.publishedAt).toLocaleDateString() : 'Unknown Date'}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      <span>{mag.articles?.length || 0} articles</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-5 pt-0">
                  <Button className="w-full bg-[#213874] hover:bg-blue-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Issue
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-20 text-center border-dashed">
            <CardContent>
              <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-900 mb-2">No magazines found</p>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any magazines matching "{searchQuery}" in the {selectedCategory} category.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
