import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, User, Calendar, MapPin, Trophy, Activity } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  jerseyNumber: number;
  fifaId: string;
  status: 'active' | 'injured' | 'transferred' | 'retired';
  photo: string;
  addedDate: string;
  nationality: string;
  goals: number;
  assists: number;
  matches: number;
  dateOfBirth: string;
  placeOfBirth: string;
  preferredFoot: 'left' | 'right' | 'both';
  contractExpiry: string;
  previousClubs: string;
  medicalHistory: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface PlayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (player: Partial<Player>) => void;
  player?: Player | null;
  mode: 'add' | 'edit';
}

const PlayerForm: React.FC<PlayerFormProps> = ({ isOpen, onClose, onSubmit, player, mode }) => {
  const [formData, setFormData] = useState<Partial<Player>>({
    name: '',
    position: '',
    age: 0,
    height: '',
    weight: '',
    jerseyNumber: 0,
    status: 'active',
    photo: '',
    nationality: '',
    goals: 0,
    assists: 0,
    matches: 0,
    dateOfBirth: '',
    placeOfBirth: '',
    preferredFoot: 'right',
    contractExpiry: '',
    previousClubs: '',
    medicalHistory: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  useEffect(() => {
    if (player && mode === 'edit') {
      setFormData(player);
      setPhotoPreview(player.photo);
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        position: '',
        age: 0,
        height: '',
        weight: '',
        jerseyNumber: 0,
        status: 'active',
        photo: '',
        nationality: '',
        goals: 0,
        assists: 0,
        matches: 0,
        dateOfBirth: '',
        placeOfBirth: '',
        preferredFoot: 'right',
        contractExpiry: '',
        previousClubs: '',
        medicalHistory: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      setPhotoPreview('');
      setCurrentStep(1);
    }
  }, [player, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'jerseyNumber' || name === 'goals' || name === 'assists' || name === 'matches' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate FIFA ID for new players
    if (mode === 'add') {
      const fifaId = `SR-${Math.floor(10000 + Math.random() * 90000)}`;
      const addedDate = new Date().toLocaleDateString();
      onSubmit({
        ...formData,
        id: Date.now().toString(),
        fifaId,
        addedDate,
        photo: photoPreview || 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200'
      });
    } else {
      onSubmit(formData);
    }
    
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.position && formData.age && formData.jerseyNumber;
      case 2:
        return formData.height && formData.weight && formData.nationality && formData.dateOfBirth;
      case 3:
        return true; // Performance stats are optional
      case 4:
        return true; // Additional info is optional
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  const stepTitles = [
    'Basic Information',
    'Physical Details',
    'Performance Stats',
    'Additional Information'
  ];

  const stepIcons = [User, Activity, Trophy, MapPin];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#111112] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'add' ? 'Add New Player' : 'Edit Player'}
            </h2>
            <p className="text-gray-400">
              {mode === 'add' ? 'Add a new player to your roster' : 'Update player information'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const StepIcon = stepIcons[index];
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    isActive ? 'text-[#BE3C63]' : isCompleted ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-[#BE3C63]' : isCompleted ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      <StepIcon size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">{title}</span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#BE3C63] rounded-full p-2 cursor-pointer hover:bg-[#331C22] transition-colors">
                      <Upload size={16} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Upload player photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="Enter player's full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Position *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Defender">Defender</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Forward">Forward</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="Age"
                      min="16"
                      max="45"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Jersey Number *
                    </label>
                    <input
                      type="number"
                      name="jerseyNumber"
                      value={formData.jerseyNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="Jersey number"
                      min="1"
                      max="99"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Player Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                    >
                      <option value="active">Active</option>
                      <option value="injured">Injured</option>
                      <option value="transferred">Transferred</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Physical Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Height *
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder={"e.g., 5'10\" or 178cm"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Weight *
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="e.g., 165 lbs or 75kg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Nationality *
                    </label>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                      required
                    >
                      <option value="">Select Nationality</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Brazil">Brazil</option>
                      <option value="England">England</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Spain">Spain</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Place of Birth
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Preferred Foot
                    </label>
                    <select
                      name="preferredFoot"
                      value={formData.preferredFoot}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                    >
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Performance Stats */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Goals
                    </label>
                    <input
                      type="number"
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Assists
                    </label>
                    <input
                      type="number"
                      name="assists"
                      value={formData.assists}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Matches Played
                    </label>
                    <input
                      type="number"
                      name="matches"
                      value={formData.matches}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Contract Expiry
                  </label>
                  <input
                    type="date"
                    name="contractExpiry"
                    value={formData.contractExpiry}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Previous Clubs
                  </label>
                  <textarea
                    name="previousClubs"
                    value={formData.previousClubs}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                    placeholder="List previous clubs separated by commas"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                    placeholder="Any relevant medical history, injuries, or conditions"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-[#BE3C63] hover:bg-[#331C22] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#BE3C63] hover:bg-[#331C22] text-white rounded-lg font-semibold transition-colors"
              >
                {mode === 'add' ? 'Add Player' : 'Update Player'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerForm;