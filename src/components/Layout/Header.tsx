import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Building, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = (role: 'club' | 'scout') => {
    navigate('/login', { state: { role } });
    setShowLoginDropdown(false);
  };

  const handleSignup = (role: 'club' | 'scout') => {
    navigate(`/signup/${role}`);
    setShowSignupDropdown(false);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-[#BE3C63] p-2 rounded-lg">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <span className="text-white font-bold text-xl">SPORTS REELS</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="text-gray-400">
            <select className="bg-transparent border-none text-gray-400">
              <option>English</option>
            </select>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 text-white hover:text-[#BE3C63] transition-colors"
              >
                <div className="w-8 h-8 bg-[#BE3C63] rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="hidden md:block">{user.name}</span>
                <ChevronDown size={16} />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Login Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLoginDropdown(!showLoginDropdown);
                    setShowSignupDropdown(false);
                  }}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  <span>Login</span>
                  <ChevronDown size={16} />
                </button>

                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => handleLogin('club')}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
                      >
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded">
                          <Building size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Login as Club</div>
                          <div className="text-xs text-gray-400">Manage your team</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleLogin('scout')}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
                      >
                        <div className="bg-green-500 bg-opacity-20 p-2 rounded">
                          <Shield size={16} className="text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Login as Scout</div>
                          <div className="text-xs text-gray-400">Discover talent</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Signup Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSignupDropdown(!showSignupDropdown);
                    setShowLoginDropdown(false);
                  }}
                  className="flex items-center space-x-1 bg-[#BE3C63] hover:bg-[#331C22] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Sign Up</span>
                  <ChevronDown size={16} />
                </button>

                {showSignupDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => handleSignup('club')}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
                      >
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded">
                          <Building size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Sign Up as Club</div>
                          <div className="text-xs text-gray-400">Create club account</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSignup('scout')}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
                      >
                        <div className="bg-green-500 bg-opacity-20 p-2 rounded">
                          <Shield size={16} className="text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Sign Up as Scout</div>
                          <div className="text-xs text-gray-400">Create scout account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserDropdown || showLoginDropdown || showSignupDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserDropdown(false);
            setShowLoginDropdown(false);
            setShowSignupDropdown(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;