import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) { toast.error('Please enter your name'); setLoading(false); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); setLoading(false); return; }
        await register(name, email, password);
        toast.success('Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Logged in successfully!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">FreshCart</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {isSignup ? 'Create your account' : 'Welcome back! Login to continue'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name — only for signup */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field pl-11"
                    placeholder="Enter your full name"
                    autoFocus={isSignup}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  autoFocus={!isSignup}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-11"
                  placeholder={isSignup ? 'Min 6 characters' : 'Enter your password'}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading
                ? (isSignup ? 'Creating account...' : 'Logging in...')
                : (isSignup ? 'Sign Up' : 'Login')
              }
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setName(''); setEmail(''); setPassword(''); }}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
