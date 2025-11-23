export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-blue-500 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Tailwind CSS Test</h1>
      <p className="text-lg">If you see this text in blue with white text, Tailwind is working.</p>
      <div className="mt-4 p-4 bg-red-500 rounded-lg">
        <p>This should have a red background and be rounded.</p>
      </div>
      <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition-colors">
        This should be a green button
      </button>
    </div>
  )
}