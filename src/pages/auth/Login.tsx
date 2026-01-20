import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Shield, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'club' | 'scout' | 'player'>('club');
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from navigation state if provided
  useEffect(() => {
    const state = location.state as { role?: 'club' | 'scout' | 'player' };
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

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(selectedRole);
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
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('club')}
              className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'club'
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Building className={`${selectedRole === 'club' ? 'text-blue-400' : 'text-gray-400'}`} size={24} />
              <div className="text-center">
                <div className={`font-medium ${selectedRole === 'club' ? 'text-blue-400' : 'text-gray-300'}`}>
                  Club
                </div>
                <div className="text-xs text-gray-400">Manager</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('scout')}
              className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'scout'
                  ? 'border-green-500 bg-green-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Shield className={`${selectedRole === 'scout' ? 'text-green-400' : 'text-gray-400'}`} size={24} />
              <div className="text-center">
                <div className={`font-medium ${selectedRole === 'scout' ? 'text-green-400' : 'text-gray-300'}`}>
                  Scout
                </div>
                <div className="text-xs text-gray-400">Hunter</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('player')}
              className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'player'
                  ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <User className={`${selectedRole === 'player' ? 'text-purple-400' : 'text-gray-400'}`} size={24} />
              <div className="text-center">
                <div className={`font-medium ${selectedRole === 'player' ? 'text-purple-400' : 'text-gray-300'}`}>
                  Player
                </div>
                <div className="text-xs text-gray-400">Athlete</div>
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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

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
            {loading ? 'Signing in...' : `Sign In as ${selectedRole === 'club' ? 'Club' : selectedRole === 'scout' ? 'Scout' : 'Player'}`}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/role-selection" className="text-pink-400 hover:text-pink-300">
            Sign up
          </Link>
        </div>

        <div className="mt-8">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium mb-2">Test Credentials:</h4>
          <div className="text-gray-400 text-sm space-y-1">
            <p><strong>Club:</strong> admin@manchesterunited.com / ClubAdmin2024!</p>
            <p><strong>Scout:</strong> john.thompson@scout.com / Scout2024!</p>
            <p><strong>Player:</strong> david.wilson@player.com / Player2024!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;