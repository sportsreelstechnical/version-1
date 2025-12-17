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
  MessageCircle,
  UserCog
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { hasPermission, isStaff, loading: permissionsLoading } = usePermissions();

  const getClubMenuItems = () => {
    const allItems = [
      { icon: Home, label: 'Dashboard', href: '/dashboard', permission: 'can_view_dashboard' },
      { icon: Users, label: 'Player Management', href: '/players', permission: 'can_manage_players' },
      { icon: Upload, label: 'Matches Upload', href: '/matches', permission: 'can_upload_matches' },
      { icon: CreditCard, label: 'Player Transfers', href: '/transfers', permission: 'can_manage_transfers' },
      { icon: Search, label: 'Explore Talent', href: '/explore', permission: 'can_explore_talent' },
      { icon: Brain, label: 'AI Scouting', href: '/ai-scouting', permission: 'can_use_ai_scouting' },
      { icon: Building, label: 'Club Profile', href: '/club-profile', permission: 'can_edit_club_profile' },
      { icon: History, label: 'Club History', href: '/club-history', permission: 'can_view_club_history' },
      { icon: UserCog, label: 'Staff Management', href: '/staff', permission: 'can_manage_staff' },
      { icon: MessageCircle, label: 'Messages', href: '/messages', permission: 'can_view_messages' },
    ];

    if (!isStaff) {
      return allItems;
    }

    return allItems.filter(item => hasPermission(item.permission as any));
  };

  const scoutMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Search, label: 'Explore Talent', href: '/explore' },
    { icon: Brain, label: 'AI Scouting', href: '/ai-scouting' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
  ];

  const playerMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const getMenuItems = () => {
    if (user?.role === 'club' || user?.role === 'staff') {
      return getClubMenuItems();
    } else if (user?.role === 'scout') {
      return scoutMenuItems;
    } else if (user?.role === 'player') {
      return playerMenuItems;
    }
    return [];
  };

  const menuItems = getMenuItems();

  const getExtraItems = () => {
    const extras = [];

    if (user?.role === 'club' || (user?.role === 'staff' && hasPermission('can_modify_settings'))) {
      extras.push({ icon: Settings, label: 'Settings', href: '/settings' });
    }

    extras.push({ icon: HelpCircle, label: 'Support', href: '/support' });

    return extras;
  };

  const extraItems = getExtraItems();

  const isActive = (href: string) => location.pathname === href;

  if (permissionsLoading && user?.role === 'staff') {
    return (
      <div className="bg-[#111112] w-64 min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading permissions...</div>
      </div>
    );
  }

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

      {extraItems.length > 0 && (
        <div className="px-6 pb-6">
          <div className="text-gray-400 text-sm font-medium mb-4">EXTRAS</div>
          <nav className="space-y-2">
            {extraItems.map((item) => {
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
      )}

      <div className="mt-auto px-6 pb-6">
        {(user?.role === 'club' || (user?.role === 'staff' && hasPermission('can_manage_subscriptions'))) && (
          <div className="bg-[#BE3C63] rounded-lg p-4 mb-4">
            <div className="text-white text-sm font-medium mb-2">Pro Plan</div>
            <div className="text-pink-100 text-xs mb-3">Upgrade to unlock features</div>
            <button className="w-full bg-white text-[#BE3C63] py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
              Upgrade Plan
            </button>
          </div>
        )}

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
