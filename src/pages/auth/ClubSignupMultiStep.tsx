import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, MapPin, Building, Lock, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SearchableDropdown from '../../components/SearchableDropdown';
import { countries, Country } from '../../data/countries';
import { sports, Sport } from '../../data/sports';
import { getLeaguesForCountryAndSport, getDivisionsForLeague } from '../../data/leagues';

const ClubSignupMultiStep: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Manager Information
    managerName: '',
    managerEmail: '',
    managerPhone: '',

    // Step 2: Location & Contact
    country: '',
    countryCode: '',
    clubPhone: '',

    // Step 3: Club Details
    clubName: '',
    sport: '',
    foundedYear: '',
    league: '',
    division: '',

    // Step 4: Additional Information
    website: '',
    password: '',
    confirmPassword: ''
  });

  const totalSteps = 4;

  // Auto-populate country code when country is selected
  useEffect(() => {
    if (formData.country && !formData.countryCode) {
      const selectedCountry = countries.find(c => c.code === formData.country);
      if (selectedCountry) {
        setFormData(prev => ({ ...prev, countryCode: selectedCountry.dialCode }));
      }
    }
  }, [formData.country, formData.countryCode]);

  // Reset league and division when country or sport changes
  useEffect(() => {
    if (formData.country && formData.sport) {
      setFormData(prev => ({ ...prev, league: '', division: '' }));
    }
  }, [formData.country, formData.sport]);

  // Reset division when league changes
  useEffect(() => {
    if (formData.league) {
      setFormData(prev => ({ ...prev, division: '' }));
    }
  }, [formData.league]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.managerName.trim()) {
        newErrors.managerName = 'Manager name is required';
      }
      if (!formData.managerEmail.trim()) {
        newErrors.managerEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) {
        newErrors.managerEmail = 'Invalid email format';
      }
      if (!formData.managerPhone.trim()) {
        newErrors.managerPhone = 'Phone number is required';
      }
    } else if (step === 2) {
      if (!formData.country) {
        newErrors.country = 'Country is required';
      }
      if (!formData.countryCode) {
        newErrors.countryCode = 'Country code is required';
      }
      if (!formData.clubPhone.trim()) {
        newErrors.clubPhone = 'Club phone number is required';
      }
    } else if (step === 3) {
      if (!formData.clubName.trim()) {
        newErrors.clubName = 'Club name is required';
      }
      if (!formData.sport) {
        newErrors.sport = 'Sport selection is required';
      }
      if (!formData.foundedYear.trim()) {
        newErrors.foundedYear = 'Founded year is required';
      } else {
        const year = parseInt(formData.foundedYear);
        const currentYear = new Date().getFullYear();
        if (year < 1800 || year > currentYear) {
          newErrors.foundedYear = `Year must be between 1800 and ${currentYear}`;
        }
      }
      if (!formData.league) {
        newErrors.league = 'League is required';
      }
      if (!formData.division) {
        newErrors.division = 'Division is required';
      }
    } else if (step === 4) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setLoading(true);

    const selectedCountry = countries.find(c => c.code === formData.country);
    const selectedSport = sports.find(s => s.id === formData.sport);
    const leagues = getLeaguesForCountryAndSport(formData.country, formData.sport);
    const selectedLeague = leagues.find(l => l.id === formData.league);

    const userData = {
      role: 'club',
      email: formData.managerEmail,
      password: formData.password,
      phone: formData.managerPhone,
      adminName: formData.managerName,
      clubName: formData.clubName,
      clubEmail: formData.managerEmail,
      website: formData.website,
      division: formData.division,
      league: selectedLeague?.name || formData.league,
      country: selectedCountry?.name || formData.country,
      foundedYear: parseInt(formData.foundedYear),
      sport: selectedSport?.name || formData.sport,
      clubPhone: `${formData.countryCode} ${formData.clubPhone}`
    };

    const success = await signup(userData);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      alert('Signup failed. Please try again.');
    }
  };

  const countryOptions = countries.map(country => ({
    value: country.code,
    label: country.name,
    icon: country.flag
  }));

  const countryCodeOptions = countries.map(country => ({
    value: country.dialCode,
    label: country.dialCode,
    icon: country.flag,
    subtitle: country.name
  }));

  const sportOptions = sports.map(sport => ({
    value: sport.id,
    label: sport.name,
    icon: sport.icon
  }));

  const leagueOptions = formData.country && formData.sport
    ? getLeaguesForCountryAndSport(formData.country, formData.sport).map(league => ({
        value: league.id,
        label: league.name
      }))
    : [];

  const divisionOptions = formData.league
    ? getDivisionsForLeague(formData.league).map(division => ({
        value: division,
        label: division
      }))
    : [];

  const steps = [
    { number: 1, title: 'Manager Info', icon: User },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Club Details', icon: Building },
    { number: 4, title: 'Security', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar - Progress */}
      <div className="w-1/3 bg-gradient-to-br from-pink-600 to-pink-700 p-8 flex flex-col">
        <Link to="/role-selection" className="flex items-center text-white mb-8 hover:text-pink-100 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Role Selection
        </Link>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-8">Club Registration</h2>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-start">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute ml-5 mt-10 w-0.5 h-12 bg-white bg-opacity-30"></div>
                  )}

                  {/* Step Circle */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-white text-pink-600'
                        : isCurrent
                        ? 'bg-white text-pink-600 ring-4 ring-pink-400 ring-opacity-50'
                        : 'bg-pink-500 bg-opacity-30 text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="ml-4 flex-1">
                    <div
                      className={`font-medium ${
                        isCurrent ? 'text-white text-lg' : 'text-pink-100'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-pink-100 text-sm opacity-80">
                      Step {step.number} of {totalSteps}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-white text-sm">© sportsreels 2024</div>
          <div className="text-pink-100 text-sm">help@sportsreels.com</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                {/* Step 1: Manager Information */}
                {currentStep === 1 && (
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manager Information</h1>
                    <p className="text-gray-400 mb-8">Let's start with your personal details</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Full Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="managerName"
                          value={formData.managerName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={`w-full bg-gray-800 border ${
                            errors.managerName ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.managerName && (
                          <p className="mt-1 text-sm text-red-500">{errors.managerName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Email Address <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="managerEmail"
                          value={formData.managerEmail}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className={`w-full bg-gray-800 border ${
                            errors.managerEmail ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.managerEmail && (
                          <p className="mt-1 text-sm text-red-500">{errors.managerEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Phone Number <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="managerPhone"
                          value={formData.managerPhone}
                          onChange={handleChange}
                          placeholder="+234 XXX XXX XXXX"
                          className={`w-full bg-gray-800 border ${
                            errors.managerPhone ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.managerPhone && (
                          <p className="mt-1 text-sm text-red-500">{errors.managerPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Contact */}
                {currentStep === 2 && (
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Location & Contact</h1>
                    <p className="text-gray-400 mb-8">Where is your club located?</p>

                    <div className="space-y-6">
                      <SearchableDropdown
                        options={countryOptions}
                        value={formData.country}
                        onChange={(value) => handleDropdownChange('country', value)}
                        placeholder="Select your country"
                        label="Country"
                        required
                        error={errors.country}
                      />

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Club Contact Number <span className="text-pink-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <SearchableDropdown
                              options={countryCodeOptions}
                              value={formData.countryCode}
                              onChange={(value) => handleDropdownChange('countryCode', value)}
                              placeholder="Code"
                              error={errors.countryCode}
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="tel"
                              name="clubPhone"
                              value={formData.clubPhone}
                              onChange={handleChange}
                              placeholder="Phone number"
                              className={`w-full bg-gray-800 border ${
                                errors.clubPhone ? 'border-red-500' : 'border-gray-700'
                              } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                            />
                            {errors.clubPhone && (
                              <p className="mt-1 text-sm text-red-500">{errors.clubPhone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Club Details */}
                {currentStep === 3 && (
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Club Details</h1>
                    <p className="text-gray-400 mb-8">Tell us about your club</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Club/Team Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="clubName"
                          value={formData.clubName}
                          onChange={handleChange}
                          placeholder="Enter your club name"
                          className={`w-full bg-gray-800 border ${
                            errors.clubName ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.clubName && (
                          <p className="mt-1 text-sm text-red-500">{errors.clubName}</p>
                        )}
                      </div>

                      <SearchableDropdown
                        options={sportOptions}
                        value={formData.sport}
                        onChange={(value) => handleDropdownChange('sport', value)}
                        placeholder="Select your sport"
                        label="Sports Category"
                        required
                        error={errors.sport}
                      />

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Year Founded <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="foundedYear"
                          value={formData.foundedYear}
                          onChange={handleChange}
                          placeholder="e.g., 2010"
                          min="1800"
                          max={new Date().getFullYear()}
                          className={`w-full bg-gray-800 border ${
                            errors.foundedYear ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.foundedYear && (
                          <p className="mt-1 text-sm text-red-500">{errors.foundedYear}</p>
                        )}
                      </div>

                      {formData.country && formData.sport && (
                        <>
                          <SearchableDropdown
                            options={leagueOptions}
                            value={formData.league}
                            onChange={(value) => handleDropdownChange('league', value)}
                            placeholder="Select your league"
                            label="League"
                            required
                            error={errors.league}
                          />

                          {formData.league && (
                            <SearchableDropdown
                              options={divisionOptions}
                              value={formData.division}
                              onChange={(value) => handleDropdownChange('division', value)}
                              placeholder="Select division"
                              label="Division"
                              required
                              error={errors.division}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Additional Information */}
                {currentStep === 4 && (
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Almost Done!</h1>
                    <p className="text-gray-400 mb-8">Final details to complete your registration</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Club Website (Optional)
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://yourclub.com"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Password <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          className={`w-full bg-gray-800 border ${
                            errors.password ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-400">
                          Password must be at least 6 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Confirm Password <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter your password"
                          className={`w-full bg-gray-800 border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <ArrowLeft size={20} className="mr-2" />
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Next
                      <ArrowRight size={20} className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  )}
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <span className="text-gray-400">Already have an account? </span>
                  <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium">
                    Login here
                  </Link>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClubSignupMultiStep;
