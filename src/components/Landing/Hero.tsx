import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#331C22]/20 via-purple-900/20 to-black"></div>
      
      <div className="relative z-10 container mx-auto px-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="text-[#BE3C63] font-medium mb-4">
              Your gateway to excellence in
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover, analyse & promote{' '}
              <span className="text-[#BE3C63]">Players in Sports</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Use our revolutionary platform to manage your players, analyze with AI powered 
              insights and FIFA ID tracking. Perfect for clubs and scouts worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup/club"
                className="bg-[#BE3C63] hover:bg-[#331C22] text-white px-8 py-4 rounded-lg font-semibold transition-colors text-center flex items-center justify-center space-x-2"
              >
                <Building size={20} />
                <span>Register as Club</span>
              </Link>
              <Link
                to="/signup/scout"
                className="border border-[#BE3C63] text-[#BE3C63] hover:bg-[#BE3C63] hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors text-center flex items-center justify-center space-x-2"
              >
                <Shield size={20} />
                <span>Register as Scout</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#BE3C63] to-purple-500 rounded-full opacity-20 blur-3xl"></div>
              <img
                src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Football Player"
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;