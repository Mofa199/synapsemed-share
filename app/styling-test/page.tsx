import { Button } from "@/components/ui/button"

export default function StylingTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Styling Test Page</h1>
        <p className="mb-4">This page tests if Tailwind CSS is working correctly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-card text-card-foreground p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Card Component</h2>
            <p className="mb-4">This should have proper styling with background, border, and text colors.</p>
            <Button>Test Button</Button>
          </div>
          
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Secondary Background</h2>
            <p>This should have the secondary background color.</p>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </div>
    </div>
  )
}