import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">FreshCart</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Create your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="input-field" placeholder="Min 6 characters" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
