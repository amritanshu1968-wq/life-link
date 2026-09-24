import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { HeartHandshake } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res: any = await authService.login({ email, password });
      if (res.success && res.data) {
        login(res.data.token, res.data.user);

        // Redirect based on user role
        switch (res.data.user.role) {
          case 'DONOR':
            navigate('/donor/dashboard');
            break;
          case 'REQUESTER':
            navigate('/requester/dashboard');
            break;
          case 'HOSPITAL':
            navigate('/hospital/dashboard');
            break;
          case 'BLOOD_BANK':
            navigate('/blood-bank/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <HeartHandshake className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Sign in to LIFE-LINK</h2>
          <p className="text-xs text-gray-500">Access your role-based emergency coordination portal.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lifelink.org"
              className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-red-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-red-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Admin Login Shortcut */}
        <div className="pt-4 border-t border-gray-100 text-xs">
          <p className="font-semibold text-gray-700 mb-2">System Administrator Account:</p>
          <div className="space-y-1 text-[11px] text-gray-600">
            <p>• Admin: <button onClick={() => { setEmail('admin@lifelink.org'); setPassword('Password@123'); }} className="text-red-600 underline font-semibold">admin@lifelink.org</button> (Password: Password@123)</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};
