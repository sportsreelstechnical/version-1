import React from 'react';
import Header from '../components/Layout/Header';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Pricing from '../components/Landing/Pricing';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-[#BE3C63] p-2 rounded-lg">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <span className="text-white font-bold text-xl">SPORTS REELS</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing football talent discovery and player management worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Our Address</h4>
              <p className="text-gray-400">
                123 Sports Avenue<br />
                Football City, FC 12345<br />
                USA
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400">
                Email: info@sportsreels.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">About Us</h4>
              <p className="text-gray-400">
                Leading platform for football analytics and talent discovery.
              </p>
              <div className="mt-4">
                <Link 
                  to="/admin/login" 
                  className="text-[#BE3C63] hover:text-[#331C22] text-sm transition-colors"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Sports Reels. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;