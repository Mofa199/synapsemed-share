"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface Mnemonic {
  id: string;
  conceptId: string;
  title: string;
  mnemonic: string;
  explanation: string;
  example?: string;
  category?: string;
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
  createdAt: Date;
}

export default function AdminMnemonicsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, verified, unverified
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMnemonics();
  }, []);

  const fetchMnemonics = async () => {
    try {
      const response = await fetch('/api/admin/mnemonics');
      if (response.ok) {
        const data = await response.json();
        setMnemonics(data);
      }
    } catch (error) {
      console.error('Error fetching mnemonics:', error);
      // Use mock data if API fails
      setMnemonics([
        {
          id: '1',
          conceptId: '1',
          title: 'Phases of Cardiac Cycle',
          mnemonic: 'A Is Very Important Forever',
          explanation: 'A = Atrial Systole\nI = Isovolumetric Contraction\nV = Ventricular Ejection\nI = Isovolumetric Relaxation\nF = (Ventricular) Filling',
          example: 'Remember: A Is Very Important Forever',
          category: 'Acronym',
          upvotes: 45,
          downvotes: 3,
          isVerified: true,
          createdAt: new Date()
        },
        {
          id: '2',
          conceptId: '1',
          title: 'Heart Sounds',
          mnemonic: 'Lub-Dub',
          explanation: 'Lub (S1) = AV valves closing\nDub (S2) = Semilunar valves closing',
          category: 'Sound-based',
          upvotes: 38,
          downvotes: 1,
          isVerified: false,
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (mnemonicId: string, verify: boolean) => {
    try {
      const response = await fetch('/api/admin/mnemonics/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mnemonicId,
          isVerified: verify
        })
      });

      if (response.ok) {
        setMnemonics(mnemonics.map(m => 
          m.id === mnemonicId ? { ...m, isVerified: verify } : m
        ));
        toast({
          title: verify ? "Mnemonic verified" : "Verification removed",
          description: verify 
            ? "This mnemonic is now marked as verified"
            : "This mnemonic is no longer verified",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (mnemonicId: string) => {
    if (!confirm('Are you sure you want to delete this mnemonic?')) return;

    try {
      const response = await fetch(`/api/admin/mnemonics?id=${mnemonicId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMnemonics(mnemonics.filter(m => m.id !== mnemonicId));
        toast({
          title: "Mnemonic deleted",
          description: "The mnemonic has been removed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete mnemonic",
        variant: "destructive"
      });
    }
  };

  const handleGenerateWithAI = async (conceptId: string) => {
    toast({
      title: "Generating mnemonics...",
      description: "AI is creating memory aids for this concept",
    });

    try {
      const response = await fetch('/api/admin/mnemonics/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptId })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "AI mnemonics generated",
          description: `${data.count} new mnemonics have been created`,
        });
        fetchMnemonics();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate mnemonics",
        variant: "destructive"
      });
    }
  };

  const filteredMnemonics = mnemonics.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.mnemonic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                          (filterStatus === 'verified' && m.isVerified) ||
                          (filterStatus === 'unverified' && !m.isVerified);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Mnemonics</h1>
        <p className="text-gray-600">Review, verify, and manage community-contributed mnemonics</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search mnemonics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Mnemonics</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Pending Review</option>
          </select>
          <Button
            onClick={() => router.push('/admin/content/mnemonics/add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Mnemonic
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mnemonics</p>
                <p className="text-2xl font-bold">{mnemonics.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {mnemonics.filter(m => m.isVerified).length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mnemonics.filter(m => !m.isVerified).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mnemonics List */}
      <div className="space-y-4">
        {filteredMnemonics.map((mnemonic) => (
          <Card key={mnemonic.id} className={`${
            mnemonic.isVerified ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-orange-500'
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{mnemonic.title}</CardTitle>
                    {mnemonic.isVerified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        Pending Review
                      </span>
                    )}
                    {mnemonic.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {mnemonic.category}
                      </span>
                    )}
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
                    <p className="font-semibold text-blue-900 text-lg">
                      {mnemonic.mnemonic}
                    </p>
                  </div>
                  <CardDescription className="whitespace-pre-line mb-2">
                    {mnemonic.explanation}
                  </CardDescription>
                  {mnemonic.example && (
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                      {mnemonic.example}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{mnemonic.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{mnemonic.downvotes}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!mnemonic.isVerified ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(mnemonic.id, true)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(mnemonic.id, false)}
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Unverify
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/content/mnemonics/edit/${mnemonic.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(mnemonic.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMnemonics.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No mnemonics found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={() => router.push('/admin/content/mnemonics/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Mnemonic
          </Button>
        </div>
      )}
    </div>
  );
}
