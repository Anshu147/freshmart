import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2025</p>

      <div className="prose dark:text-gray-300 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">1. Acceptance of Terms</h2>
          <p>By using FreshCart, you agree to these terms. If you don't agree, please don't use our service. It's that simple.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">2. Account Responsibility</h2>
          <p>You are responsible for keeping your account credentials secure. If you notice unauthorized activity, notify us immediately at <strong>support@freshcart.com</strong>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">3. Orders & Pricing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are listed in Indian Rupees (INR) and include applicable taxes</li>
            <li>Prices may change without prior notice, but confirmed orders will be honored at the price shown at checkout</li>
            <li>We reserve the right to cancel orders due to stock unavailability or pricing errors</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">4. Delivery</h2>
          <p>Delivery times are estimates, not guarantees. We do our best to meet them and will notify you of any delays. Delivery is currently available only in select cities.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">5. Product Quality</h2>
          <p>We strive for the highest quality, but fresh produce is natural and may vary slightly in appearance. If something is genuinely off-quality, our <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> applies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">6. Prohibited Activities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Using the platform for fraudulent purposes</li>
            <li>Placing orders with no intention of receiving them</li>
            <li>Abusing our refund or return policy</li>
            <li>Attempting to hack, scrape, or disrupt our systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">7. Limitation of Liability</h2>
          <p>FreshCart's liability is limited to the amount paid for the product or service in question. We are not liable for indirect or consequential damages.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">8. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of FreshCart after changes means you accept the updated terms. Major changes will be communicated via email.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">9. Contact</h2>
          <p>Questions about these terms? Email us at <strong>legal@freshcart.com</strong></p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t dark:border-gray-700">
        <Link to="/" className="text-primary font-medium text-sm hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}
