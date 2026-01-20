import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Shield, Globe, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SearchableDropdown from '../../components/SearchableDropdown';
import { countries } from '../../data/countries';

const ScoutSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fifaLicenceNumber: '',
    email: '',
    countryCode: '+91',
    phone: '',
    country: '',
    preferredLeague: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    const phoneWithCode = `${formData.countryCode} ${formData.phone}`;
    const success = await signup({
      ...formData,
      phone: phoneWithCode,
      role: 'scout'
    });
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      alert('Signup failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const countryCodeOptions = countries.map(country => ({
    value: country.dialCode,
    label: country.dialCode,
    icon: country.flag,
    subtitle: country.name
  }));

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Form Steps */}
      <div className="w-1/3 bg-pink-600 p-8 flex flex-col">
        <Link to="/role-selection" className="flex items-center text-white mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back
        </Link>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Personal details</div>
              <div className="text-pink-100 text-sm">Your name and contact information</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">FIFA Licence</div>
              <div className="text-pink-100 text-sm">Enter your FIFA licence number</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Preferences</div>
              <div className="text-pink-100 text-sm">Select your preferred regions</div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-white text-sm">© sportsreels 2024</div>
          <div className="text-pink-100 text-sm">help@sportsreels.com</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Create a Scout Account</h1>
            <p className="text-gray-400 mb-8">Welcome! Please enter your details.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <input
                type="text"
                name="fifaLicenceNumber"
                placeholder="FIFA Licence Number"
                value={formData.fifaLicenceNumber}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                required
              />

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mobile Number
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <SearchableDropdown
                      options={countryCodeOptions}
                      value={formData.countryCode}
                      onChange={(value) => handleDropdownChange('countryCode', value)}
                      placeholder="Code"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="">Select Country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="es">Spain</option>
                  <option value="it">Italy</option>
                  <option value="br">Brazil</option>
                  <option value="ar">Argentina</option>
                </select>

                <input
                  type="text"
                  name="preferredLeague"
                  placeholder="Preferred League"
                  value={formData.preferredLeague}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Scout Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link to="/login" className="text-pink-400 hover:text-pink-300">
                Login
              </Link>
            </div>

            {/* Google OAuth */}
            <div className="mt-6">
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or sign up with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signInWithGoogle('scout')}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScoutSignup;