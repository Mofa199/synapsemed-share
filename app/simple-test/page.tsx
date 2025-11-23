export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-700 text-center mb-6">
          If you see this text styled with Tailwind CSS, then it's working!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Blue Button
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Green Button
          </button>
        </div>
      </div>
    </div>
  )
}