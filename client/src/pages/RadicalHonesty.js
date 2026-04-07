import { Link } from 'react-router-dom';
import { FiEye, FiDollarSign, FiAlertTriangle, FiShield, FiRefreshCw, FiChevronRight } from 'react-icons/fi';

export default function RadicalHonesty() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Our Promise
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Radical <span className="text-amber-200">Honesty</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-amber-100 leading-relaxed">
            Most companies hide behind fine print. We'd rather lose a sale than mislead you.
            Here's our commitment to complete transparency.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">The Problem We're Solving</h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Let's be honest about dishonesty in grocery shopping. We've all been there:
            </p>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6 space-y-4">
              {[
                '"70% OFF!" — but the base price was inflated 3x before the "sale"',
                '"Farm Fresh" — actually sitting in cold storage for 2 weeks',
                '"Organic" — with zero certification to back it up',
                'Hidden delivery fees that only show up at checkout',
                'Photos that look nothing like what actually arrives',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                  <p className="text-sm text-red-700 dark:text-red-300">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              We believe you deserve better. Here's what we do differently.
            </p>
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Our Commitments to You
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <FiDollarSign className="text-amber-600" size={28} />,
                title: 'Honest Pricing, Always',
                desc: 'We never inflate prices before a "sale." Our everyday prices are fair, and our discounts are real. We show you the actual price you pay — no games.',
                highlight: 'If you find the same product cheaper locally (with proof), we match it.',
              },
              {
                icon: <FiEye className="text-amber-600" size={28} />,
                title: 'Full Transparency on Sourcing',
                desc: 'Every product page shows where it comes from, when it was sourced, and how it was stored. If a vegetable was harvested 5 days ago, we tell you.',
                highlight: 'We\'re building source tracing so you can see the exact farm your produce came from.',
              },
              {
                icon: <FiShield className="text-amber-600" size={28} />,
                title: 'No Fake Reviews',
                desc: 'Every review on FreshCart is from a verified purchase. We never incentivize reviews, delete negative ones, or post fake positive ones.',
                highlight: 'Our review system is open-source and auditable.',
              },
              {
                icon: <FiRefreshCw className="text-amber-600" size={28} />,
                title: 'Easy, No-Questions Returns',
                desc: 'If something isn\'t right — the tomatoes are mushy, the milk is sour, the chips are stale — tell us. We refund or replace immediately.',
                highlight: 'No photos required. No return pickup fees. No "we\'ll get back to you in 7 days."',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">{item.desc}</p>
                <p className="text-sm font-medium text-primary bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  {item.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Numbers */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Numbers We're Proud Of
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: '99.2%', label: 'Orders Delivered On Time' },
            { number: '4.6/5', label: 'Average Customer Rating' },
            { number: '<2 hrs', label: 'Average Issue Resolution' },
            { number: '0', label: 'Fake Reviews (Ever)' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mistakes */}
      <section className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
            Mistakes We've Made
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
            Because honesty means owning our screw-ups too.
          </p>
          <div className="space-y-4">
            {[
              {
                when: 'Early 2024',
                mistake: 'We overpromised delivery times during our launch week. Orders were delayed by 2-3 hours.',
                fix: 'We now underpromise and overdeliver. Delivery estimates include buffer time.',
              },
              {
                when: 'Mid 2024',
                mistake: 'Our product photos were too "perfect" — customers felt misled when real items looked different.',
                fix: 'We switched to unedited, real photos taken at our warehouse. What you see is what arrives.',
              },
              {
                when: 'Late 2024',
                mistake: 'We listed a brand as "organic" based on the supplier\'s word without verifying certification.',
                fix: 'Every organic claim now requires valid certification. We audit quarterly.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded">
                    {item.when}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>What went wrong:</strong> {item.mistake}
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>What we did:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Hold Us Accountable</h2>
          <p className="text-amber-100 mb-8 text-lg">
            If we ever fall short of these promises, call us out. We mean it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/co-create" className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 font-semibold px-8 py-3 rounded-lg hover:bg-amber-50 transition">
              Report an Issue <FiChevronRight size={16} />
            </Link>
            <Link to="/products" className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition">
              Shop With Confidence
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
