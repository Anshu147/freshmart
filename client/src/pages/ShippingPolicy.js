import { Link } from 'react-router-dom';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Shipping Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2025</p>

      <div className="prose dark:text-gray-300 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">1. Delivery Areas</h2>
          <p>We currently deliver in select cities across India. Enter your pincode on the checkout page to confirm delivery availability in your area.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">2. Delivery Timings</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Standard Delivery:</strong> Within 24 hours of order placement</li>
            <li><strong>Express Delivery:</strong> Within 2 hours (available in select pin codes)</li>
            <li>Delivery slots are available from 7:00 AM to 10:00 PM, 7 days a week</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">3. Shipping Charges</h2>
          <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Orders above ₹299</span>
                <span className="font-semibold text-primary">FREE</span>
              </li>
              <li className="flex justify-between">
                <span>Orders below ₹299</span>
                <span className="font-semibold">₹29</span>
              </li>
              <li className="flex justify-between">
                <span>Express Delivery (2-hour)</span>
                <span className="font-semibold">₹49</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">4. Order Tracking</h2>
          <p>Once your order is shipped, you'll receive a tracking update via SMS and email. You can also track your order in real-time from the <strong>My Orders</strong> section.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">5. Packaging</h2>
          <p>We use eco-friendly, recyclable packaging. Perishable items are packed in insulated bags to maintain freshness during transit.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">6. Delivery Issues</h2>
          <p>If you experience any delivery issues — wrong items, missing products, or damaged packaging — please report it within 24 hours. We'll resolve it promptly. See our <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> for details.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold dark:text-white mb-2">7. Contact</h2>
          <p>For shipping queries, email <strong>delivery@freshcart.com</strong></p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t dark:border-gray-700">
        <Link to="/" className="text-primary font-medium text-sm hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}
