import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Upload, 
  Building, 
  History, 
  Search, 
  Brain, 
  Settings, 
  HelpCircle,
  LogOut,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const clubMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Player Management', href: '/players' },
    { icon: Upload, label: 'Matches Upload', href: '/matches' },
    { icon: CreditCard, label: 'Player Transfers', href: '/transfers' },
    { icon: Brain, label: 'AI Scouting', href: '/ai-scouting' },
    { icon: Building, label: 'Club Profile', href: '/club-profile' },
    { icon: History, label: 'Club History', href: '/club-history' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
  ];

  const scoutMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Search, label: 'Explore Talent', href: '/explore' },
    { icon: Brain, label: 'AI Scouting', href: '/ai-scouting' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
  ];

  const menuItems = user?.role === 'club' ? clubMenuItems : scoutMenuItems;

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="bg-[#111112] w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="text-gray-400 text-sm font-medium mb-4">MAIN</div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#BE3C63] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#331C22]'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6 pb-6">
        <div className="text-gray-400 text-sm font-medium mb-4">EXTRAS</div>
        <nav className="space-y-2">
          <Link
            to="/settings"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-[#BE3C63] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#331C22]'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link
            to="/support"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/support')
                ? 'bg-[#BE3C63] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#331C22]'
            }`}
          >
            <HelpCircle size={20} />
            <span>Support</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto px-6 pb-6">
        <div className="bg-[#BE3C63] rounded-lg p-4 mb-4">
          <div className="text-white text-sm font-medium mb-2">Pro Plan</div>
          <div className="text-pink-100 text-xs mb-3">Upgrade to unlock features</div>
          <button className="w-full bg-white text-[#BE3C63] py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
            Upgrade Plan
          </button>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#331C22] transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;