import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Shield, Globe, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SearchableDropdown from '../../components/SearchableDropdown';
import { countries } from '../../data/countries';

const ScoutSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fifaLicenceNumber: '',
    email: '',
    countryCode: '+1',
    phone: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const phoneWithCode = `${formData.countryCode} ${formData.phone}`;

      const success = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fifaLicenceNumber: formData.fifaLicenceNumber,
        email: formData.email,
        phone: phoneWithCode,
        country: formData.country,
        password: formData.password,
        role: 'scout'
      });

      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, country: value });

    // Auto-update country code when country changes
    const selectedCountry = countries.find(c => c.code === value);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        country: value,
        countryCode: selectedCountry.dialCode
      }));
    }

    // Clear error
    if (errors.country) {
      setErrors({ ...errors, country: '' });
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setFormData({ ...formData, countryCode: value });
  };

  // Prepare options for dropdowns
  const countryOptions = countries.map(country => ({
    value: country.code,
    label: country.name,
    icon: country.flag,
    subtitle: country.dialCode
  }));

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
        <Link to="/role-selection" className="flex items-center text-white mb-8 hover:text-pink-100 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back
        </Link>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Personal Details</div>
              <div className="text-pink-100 text-sm">Your name and contact information</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">FIFA Licence</div>
              <div className="text-pink-100 text-sm">Enter your FIFA licence number (optional)</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Location</div>
              <div className="text-pink-100 text-sm">Select your country</div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-white text-sm">© sportsreels 2024</div>
          <div className="text-pink-100 text-sm">help@sportsreels.com</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Create a Scout Account</h1>
            <p className="text-gray-400 mb-8">Welcome! Please enter your details.</p>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500 text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    First Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Last Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* FIFA Licence Number */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  FIFA Licence Number
                </label>
                <input
                  type="text"
                  name="fifaLicenceNumber"
                  placeholder="Enter FIFA licence number (optional)"
                  value={formData.fifaLicenceNumber}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mobile Number <span className="text-pink-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <SearchableDropdown
                      options={countryCodeOptions}
                      value={formData.countryCode}
                      onChange={handleCountryCodeChange}
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
                      className={`w-full bg-gray-800 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Country - Searchable Dropdown */}
              <div>
                <SearchableDropdown
                  options={countryOptions}
                  value={formData.country}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                  label="Country"
                  required
                  error={errors.country}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Password <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Confirm Password <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle2 size={14} className={formData.password.length >= 6 ? 'text-green-500' : 'text-gray-500'} />
                  <span>At least 6 characters</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Scout Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link to="/login" className="text-pink-400 hover:text-pink-300 transition-colors">
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScoutSignup;
