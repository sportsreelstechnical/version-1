import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import Header from '../components/Layout/Header';

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'club' | 'scout' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/signup/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Users className="text-gray-700" size={32} />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Select your account type
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('club')}
              className={`relative bg-gray-800 rounded-2xl p-8 cursor-pointer transition-all ${
                selectedRole === 'club' 
                  ? 'ring-2 ring-pink-500 bg-gray-750' 
                  : 'hover:bg-gray-750'
              }`}
            >
              <div className="absolute top-4 right-4">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedRole === 'club' 
                    ? 'bg-pink-500 border-pink-500' 
                    : 'border-gray-400'
                }`}>
                  {selectedRole === 'club' && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <img
                  src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Club"
                  className="w-24 h-24 rounded-xl mx-auto object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Club</h3>
              <p className="text-gray-400">
                Manage your team, upload matches, and showcase your players to scouts worldwide.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('scout')}
              className={`relative bg-gray-800 rounded-2xl p-8 cursor-pointer transition-all ${
                selectedRole === 'scout' 
                  ? 'ring-2 ring-pink-500 bg-gray-750' 
                  : 'hover:bg-gray-750'
              }`}
            >
              <div className="absolute top-4 right-4">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedRole === 'scout' 
                    ? 'bg-pink-500 border-pink-500' 
                    : 'border-gray-400'
                }`}>
                  {selectedRole === 'scout' && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <img
                  src="https://images.pexels.com/photos/1550950/pexels-photo-1550950.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Scout"
                  className="w-24 h-24 rounded-xl mx-auto object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Scout</h3>
              <p className="text-gray-400">
                Discover talented players, analyze performance, and connect with clubs globally.
              </p>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`mt-12 px-16 py-4 rounded-xl font-semibold text-lg transition-colors ${
              selectedRole
                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;