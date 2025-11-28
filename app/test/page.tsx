export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a test page to check if styling is working.</p>
      <div className="bg-card text-card-foreground p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Card Component</h2>
        <p>This is a card component with proper styling.</p>
      </div>
    </div>
  )
}