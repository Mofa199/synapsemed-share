"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";

import React from "react";

export default function EditMnemonicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = (React.use(params) as any);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    conceptId: "",
    title: "",
    mnemonic: "",
    explanation: "",
    example: "",
    category: "Acronym",
    isVerified: true
  });

  // Fetch existing mnemonic data
  useEffect(() => {
    const fetchMnemonic = async () => {
      try {
        const response = await fetch(`/api/admin/mnemonics?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          // Find the specific mnemonic by ID
          const mnemonic = data.find((m: any) => m.id === id);
          if (mnemonic) {
            setFormData({
              conceptId: mnemonic.conceptId,
              title: mnemonic.title,
              mnemonic: mnemonic.mnemonic,
              explanation: mnemonic.explanation,
              example: mnemonic.example || "",
              category: mnemonic.category || "Acronym",
              isVerified: mnemonic.isVerified
            });
          }
        }
      } catch (error) {
        console.error('Error fetching mnemonic:', error);
        toast({
          title: "Error",
          description: "Failed to load mnemonic data",
          variant: "destructive"
        });
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchMnemonic();
    }
  }, [id]);

  const handleGenerateWithAI = async () => {
    if (!formData.title) {
      toast({
        title: "Missing information",
        description: "Please enter a title/topic first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    toast({
      title: "Generating mnemonic...",
      description: "AI is creating a memory aid for this topic",
    });

    try {
      const response = await fetch('/api/ai/generate-mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.title
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          mnemonic: data.mnemonic,
          explanation: data.explanation,
          example: data.example || prev.example,
          category: data.category || prev.category
        }));
        toast({
          title: "Mnemonic generated!",
          description: "AI has created a mnemonic. Review and edit as needed.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate mnemonic with AI",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.mnemonic || !formData.explanation) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/mnemonics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Mnemonic updated",
          description: "The mnemonic has been updated successfully",
        });
        router.push('/admin/content/mnemonics');
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update mnemonic",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update mnemonic",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Mnemonics
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Mnemonic</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Concept ID <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter concept ID (e.g., 1)"
                value={formData.conceptId}
                onChange={(e) => setFormData({ ...formData, conceptId: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                The concept this mnemonic belongs to
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Phases of Cardiac Cycle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={aiGenerating || !formData.title}
                  variant="outline"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {aiGenerating ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mnemonic Phrase <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., A Is Very Important Forever"
                value={formData.mnemonic}
                onChange={(e) => setFormData({ ...formData, mnemonic: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Explanation <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Explain what each letter/word stands for..."
                rows={6}
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Example (Optional)
              </label>
              <Textarea
                placeholder="How to use this mnemonic..."
                rows={3}
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Acronym">Acronym</option>
                <option value="Rhyme">Rhyme</option>
                <option value="Visual">Visual</option>
                <option value="Sound-based">Sound-based</option>
                <option value="Story">Story</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="verified" className="text-sm">
                Mark as verified (admin-approved)
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Update Mnemonic'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}