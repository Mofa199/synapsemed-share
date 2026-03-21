import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#213874] mb-8">Privacy Policy</h1>
        <div className="prose max-w-none bg-white p-8 rounded-xl shadow-sm">
          <p className="text-gray-600 mb-4">Last Updated: March 21, 2026</p>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">1. Data Collection</h2>
            <p>We collect information you provide directly to us when you create an account, update your profile, or use our interactive features.</p>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Data</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, and to personalize your learning experience.</p>
          </section>
          <p className="text-sm text-gray-500 mt-8 italic">Note: This is a placeholder document. Please replace with actual legal terms.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
