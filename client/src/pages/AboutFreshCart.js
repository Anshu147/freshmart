import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiHeart, FiUsers, FiDroplet, FiStar } from 'react-icons/fi';

export default function AboutFreshCart() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Who is <span className="text-green-200">FreshCart</span>?
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-green-100 leading-relaxed">
            We're not just another grocery app. We're a movement to bring honesty,
            freshness, and fairness back to the way India shops for everyday essentials.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              Born from a Simple Frustration
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                FreshCart started in 2024 when our founder, tired of wilted vegetables,
                misleading "fresh" labels, and hidden markups at local stores, decided
                there had to be a better way.
              </p>
              <p>
                We asked a simple question: <em>"Why can't grocery shopping be
                transparent, fair, and actually fresh?"</em>
              </p>
              <p>
                That question became FreshCart — a platform built on radical honesty,
                where what you see is exactly what you get. No inflated MRP tricks, no
                mystery sourcing, no "too good to be true" deals that aren't really deals.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-4">🛒</span>
            <p className="text-5xl font-bold text-primary mb-2">10K+</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Happy Customers</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiDroplet className="text-primary" size={28} />,
                title: 'Real Freshness',
                desc: 'We source directly from local farms and verified suppliers. No cold storage secrets — you get it fresh, or we tell you it\'s not.',
              },
              {
                icon: <FiShield className="text-primary" size={28} />,
                title: 'Honest Pricing',
                desc: 'No fake discounts, no inflated base prices. Our prices reflect real value, and we show you the math.',
              },
              {
                icon: <FiTruck className="text-primary" size={28} />,
                title: 'Reliable Delivery',
                desc: 'We deliver when we say we will. If there\'s a delay, you\'ll know before your order is late — not after.',
              },
              {
                icon: <FiHeart className="text-primary" size={28} />,
                title: 'Community First',
                desc: 'Every decision we make starts with "is this good for our customers?" — not our investors, not our margins.',
              },
              {
                icon: <FiUsers className="text-primary" size={28} />,
                title: 'Co-Creation',
                desc: 'We build FreshCart with our community, not just for them. Your feedback directly shapes our product roadmap.',
              },
              {
                icon: <FiStar className="text-primary" size={28} />,
                title: 'Quality Promise',
                desc: 'If something isn\'t right, we make it right. No hoops, no chatbots — just real people who care.',
              },
            ].map((value, i) => (
              <div key={i} className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          The People Behind FreshCart
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Amrita Sharma', role: 'Founder & CEO', emoji: '👩‍💼' },
            { name: 'Rahul Verma', role: 'Head of Sourcing', emoji: '👨‍🌾' },
            { name: 'Priya Patel', role: 'Customer Experience', emoji: '👩‍💻' },
            { name: 'Arjun Kumar', role: 'Tech & Product', emoji: '👨‍💻' },
          ].map((member, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-6 text-center shadow-sm">
              <span className="text-5xl block mb-4">{member.emoji}</span>
              <h3 className="font-semibold dark:text-white">{member.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-green-600 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Honest Grocery Shopping?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Join thousands who have switched to FreshCart.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition">
              Shop Now
            </Link>
            <Link to="/co-create" className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition">
              Co-Create With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
