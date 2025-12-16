import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'club' | 'scout'>('club');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from navigation state if provided
  useEffect(() => {
    const state = location.state as { role?: 'club' | 'scout' };
    if (state?.role) {
      setSelectedRole(state.role);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, selectedRole);
      if (success) {
        navigate('/dashboard');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-pink-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Please sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-3">Login as:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('club')}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'club'
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Building className={`${selectedRole === 'club' ? 'text-blue-400' : 'text-gray-400'}`} size={20} />
              <div className="text-left">
                <div className={`font-medium ${selectedRole === 'club' ? 'text-blue-400' : 'text-gray-300'}`}>
                  Club
                </div>
                <div className="text-xs text-gray-400">Team Manager</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('scout')}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'scout'
                  ? 'border-green-500 bg-green-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Shield className={`${selectedRole === 'scout' ? 'text-green-400' : 'text-gray-400'}`} size={20} />
              <div className="text-left">
                <div className={`font-medium ${selectedRole === 'scout' ? 'text-green-400' : 'text-gray-300'}`}>
                  Scout
                </div>
                <div className="text-xs text-gray-400">Talent Hunter</div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-pink-400 hover:text-pink-300">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : `Sign In as ${selectedRole === 'club' ? 'Club' : 'Scout'}`}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/role-selection" className="text-pink-400 hover:text-pink-300">
            Sign up
          </Link>
        </div>

        <div className="mt-8">
          <div className="text-center text-gray-400 mb-4">Or continue with</div>
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-900 rounded"></div>
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium mb-2">Demo Credentials:</h4>
          <div className="text-gray-400 text-sm space-y-1">
            <p><strong>Club:</strong> club@demo.com / password123</p>
            <p><strong>Scout:</strong> scout@demo.com / password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;