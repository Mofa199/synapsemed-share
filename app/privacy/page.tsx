import { Navigation } from "@/components/navigation"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-bold text-[#213874] mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: July 2026</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-[#213874] mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you register for an account, subscribe to our WhatsApp notifications, or communicate with us. This includes your name, email address, phone number, and educational background.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#213874] mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide, maintain, and improve our educational services</li>
                <li>Send you technical notices and OTP verifications</li>
                <li>Communicate with you via WhatsApp for daily quizzes (if opted-in)</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#213874] mb-4">3. Data Security & Storage</h2>
              <p>We implement appropriate technical and organizational security measures (including rate limiting and data sanitization) to protect your personal information against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure. Your data is stored securely on our dedicated servers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#213874] mb-4">4. WhatsApp Communications</h2>
              <p>By opting into our WhatsApp services, you agree to receive automated messages containing study materials and quizzes. You can opt-out at any time by replying "STOP" to our WhatsApp number.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#213874] mb-4">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@synapsemed.co.tz.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
