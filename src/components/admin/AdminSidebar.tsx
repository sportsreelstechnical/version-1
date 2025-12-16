import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building, 
  Shield, 
  DollarSign, 
  MessageCircle, 
  Settings, 
  LogOut,
  BarChart3,
  UserPlus,
  CreditCard
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Building, label: 'Clubs', href: '/admin/clubs' },
    { icon: Shield, label: 'Scouts', href: '/admin/scouts' },
    { icon: DollarSign, label: 'Payments', href: '/admin/payments' },
    { icon: MessageCircle, label: 'Support', href: '/admin/support' },
    { icon: Users, label: 'User Management', href: '/admin/users' },
    { icon: CreditCard, label: 'Subscriptions', href: '/admin/subscriptions' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="bg-[#111112] w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <div className="bg-[#BE3C63] p-2 rounded-lg">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <div>
            <span className="text-white font-bold text-lg">SPORTS REELS</span>
            <div className="text-[#BE3C63] text-xs">Admin Portal</div>
          </div>
        </Link>
      </div>

      <div className="p-6 flex-1">
        <div className="text-gray-400 text-sm font-medium mb-4">ADMINISTRATION</div>
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

      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#331C22] transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;