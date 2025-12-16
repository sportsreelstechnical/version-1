import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Building, Globe, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SearchableDropdown from '../../components/SearchableDropdown';
import { countries } from '../../data/countries';

const ClubSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    adminName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    clubName: '',
    clubEmail: '',
    website: '',
    division: '',
    league: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
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
      role: 'club'
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
              <div className="text-white font-medium">Your details</div>
              <div className="text-pink-100 text-sm">Please provide your name and email</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Building size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Club information</div>
              <div className="text-pink-100 text-sm">Tell us about your club</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">League & Division</div>
              <div className="text-pink-100 text-sm">Select your competition level</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Create a Club Account</h1>
            <p className="text-gray-400 mb-8">Welcome! Please enter your details.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="adminName"
                  placeholder="Admin Name"
                  value={formData.adminName}
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
              </div>

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
                <input
                  type="text"
                  name="clubName"
                  placeholder="Club Name"
                  value={formData.clubName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
                <input
                  type="email"
                  name="clubEmail"
                  placeholder="Club Email"
                  value={formData.clubEmail}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <input
                type="url"
                name="website"
                placeholder="Website URL (optional)"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                  required
                >
                  <option value="">Select Division</option>
                  <option value="professional">Professional</option>
                  <option value="semi-professional">Semi-Professional</option>
                  <option value="amateur">Amateur</option>
                  <option value="youth">Youth</option>
                </select>

                <input
                  type="text"
                  name="league"
                  placeholder="League"
                  value={formData.league}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Club Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link to="/login" className="text-pink-400 hover:text-pink-300">
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClubSignup;