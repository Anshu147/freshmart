import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Refund Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2025</p>

      <div className="prose dark:text-gray-300 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">1. Our Promise</h2>
          <p>If you're not happy with the quality of any product, we'll replace it or refund it — no questions asked. This is part of our Radical Honesty commitment.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">2. Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Refund requests must be made within 24 hours of delivery</li>
            <li>Products must be unused and in original packaging (perishables excluded from this — just tell us what was wrong)</li>
            <li>Photos help but are not required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">3. How to Request a Refund</h2>
          <ul className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>My Orders</strong> in your account</li>
            <li>Select the order and click <strong>"Report Issue"</strong></li>
            <li>Describe the problem and submit</li>
            <li>We review and process within 2 hours</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">4. Refund Methods</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Original Payment:</strong> Refunded to your payment method within 5–7 business days</li>
            <li><strong>FreshCart Wallet:</strong> Instant credit to your wallet for faster resolution</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">5. Non-Refundable Items</h2>
          <p>Products purchased during clearance sales or with store credit may have different refund terms, which will be clearly stated at the time of purchase.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">6. Cancellation</h2>
          <p>Orders can be cancelled before they are shipped. Once shipped, a refund will be processed after the item is returned or delivery is refused.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">7. Contact</h2>
          <p>For refund queries, email <strong>support@freshcart.com</strong></p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t dark:border-gray-700">
        <Link to="/" className="text-primary font-medium text-sm hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}
