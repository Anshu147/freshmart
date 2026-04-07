import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiZap, FiSend, FiCheckCircle, FiUsers, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CoCreate() {
  const [form, setForm] = useState({ name: '', email: '', type: 'feedback', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would POST to an API
    toast.success('Thank you! Your input matters to us.');
    setSubmitted(true);
    setForm({ name: '', email: '', type: 'feedback', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Build With Us
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Co-Create <span className="text-purple-200">FreshCart</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-purple-100 leading-relaxed">
            FreshCart isn't built in a boardroom — it's built by the people who use it.
            Your ideas, feedback, and voice directly shape what we become.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How Co-Creation Works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: <FiMessageSquare className="text-purple-600" size={32} />,
              step: '01',
              title: 'Share Your Idea',
              desc: 'Tell us what you love, what frustrates you, or what you wish existed. No idea is too small or too wild.',
            },
            {
              icon: <FiUsers className="text-purple-600" size={32} />,
              step: '02',
              title: 'Community Votes',
              desc: 'The community upvotes ideas they care about. The most popular ones go straight to our product team.',
            },
            {
              icon: <FiCheckCircle className="text-purple-600" size={32} />,
              step: '03',
              title: 'We Build It Together',
              desc: 'We keep you in the loop as we build. Test early versions, give feedback, and see your idea come to life.',
            },
          ].map((item, i) => (
            <div key={i} className="relative bg-white dark:bg-dark-card rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                {item.step}
              </span>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 mt-2">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What people have co-created */}
      <section className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Ideas That Became Reality
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                emoji: '📦',
                title: 'Eco-Friendly Packaging',
                desc: 'You asked for less plastic. We switched to compostable bags for fruits and vegetables.',
                author: 'Suggested by 47 community members',
              },
              {
                emoji: '⏰',
                title: '30-Minute Delivery Slots',
                desc: 'Instead of vague "morning" windows, you now pick exact 30-minute slots.',
                author: 'Suggested by Priya M., Mumbai',
              },
              {
                emoji: '🏷️',
                title: 'No Fake Discounts',
                desc: 'Our radical honesty pricing was born from community frustration with inflated MRPs.',
                author: 'Suggested by 120+ community members',
              },
              {
                emoji: '🥗',
                title: 'Recipe-Based Shopping',
                desc: 'Add all ingredients for a recipe to cart in one click — straight from community recipe posts.',
                author: 'Suggested by Arjun K., Delhi',
              },
              {
                emoji: '📱',
                title: 'Dark Mode',
                desc: 'Because late-night grocery browsing is real. Our entire app now supports dark mode.',
                author: 'Suggested by 89 community members',
              },
              {
                emoji: <FiZap className="text-primary" size={24} />,
                title: 'Your Idea Next?',
                desc: 'Submit your idea below. The next feature we ship could be yours.',
                author: '',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-sm">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <h3 className="font-semibold mb-1 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                {item.author && (
                  <p className="text-xs text-primary mt-3 font-medium">{item.author}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Form */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">Share Your Idea</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Every great product started as someone's wild idea.
        </p>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
            <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">Thank You!</h3>
            <p className="text-green-600 dark:text-green-300">Your idea has been submitted. We read every single one.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-sm space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="input-field"
            >
              <option value="feedback">Feedback</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="seller">Want to Sell on FreshCart</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Tell us your idea, feedback, or anything else..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="input-field"
            />
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiSend size={16} />
              Submit
            </button>
          </form>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <FiTruck className="mx-auto mb-4" size={40} />
          <h2 className="text-2xl font-bold mb-3">Want to Sell on FreshCart?</h2>
          <p className="text-purple-100 mb-6">
            We're always looking for honest, quality-driven sellers and farmers to join our platform.
          </p>
          <p className="text-purple-200 text-sm">
            Select "Want to Sell on FreshCart" in the form above and tell us about your business.
          </p>
        </div>
      </section>
    </div>
  );
}
