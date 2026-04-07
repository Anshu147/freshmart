import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2025</p>

      <div className="prose dark:text-gray-300 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly — your name, email, phone number, delivery address, and payment details when you create an account or place an order.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and deliver your orders</li>
            <li>To communicate order updates and support</li>
            <li>To improve our products and services</li>
            <li>To send promotional offers (only with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">3. Data Sharing</h2>
          <p>We never sell your personal data. We share information only with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Delivery partners to fulfill your orders</li>
            <li>Payment processors for secure transactions</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">4. Data Security</h2>
          <p>We use industry-standard encryption and security practices to protect your data. Passwords are hashed and never stored in plain text.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">5. Cookies</h2>
          <p>We use cookies to keep you logged in, remember your preferences (like dark mode), and analyze site usage. You can disable cookies in your browser settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">6. Your Rights</h2>
          <p>You can request to view, update, or delete your personal data at any time by contacting us. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">7. Contact</h2>
          <p>For any privacy-related questions, reach us at <strong>privacy@freshcart.com</strong></p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t dark:border-gray-700">
        <Link to="/" className="text-primary font-medium text-sm hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}
