import { useState } from 'react';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Award,
  TrendingUp,
  Activity,
  RotateCcw,
  Key,
} from 'lucide-react';
import { usePasswordManagement } from '../hooks/usePasswordManagement';
import CredentialsModal from './modals/CredentialsModal';

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  position: string;
  photo_url?: string;
  jersey_number?: number;
  player_status?: string;
}

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: string) => void;
  onView?: (player: Player) => void;
  clubName?: string;
}

export default function PlayerCard({
  player,
  onEdit,
  onDelete,
  onView,
  clubName,
}: PlayerCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { credentials, resetPlayerPassword, clearCredentials } = usePasswordManagement();

  const fullName = `${player.first_name} ${player.last_name}`;
  const email = player.email || `${player.first_name.toLowerCase()}.${player.last_name.toLowerCase()}@example.com`;

  const handleResetPassword = async () => {
    if (!player.email) {
      alert('Player email not found. Cannot reset password.');
      return;
    }

    setResetting(true);
    setShowMenu(false);

    try {
      await resetPlayerPassword(player.id, player.email, fullName, clubName);
      setShowCredentialsModal(true);
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'injured':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'transferred':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_loan':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Card Header */}
        <div className="relative">
          {/* Player Photo */}
          <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center overflow-hidden">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl font-bold text-purple-300">
                {player.first_name[0]}{player.last_name[0]}
              </div>
            )}
          </div>

          {/* Options Menu Button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg shadow-md transition-all"
            >
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 z-10">
                {onView && (
                  <button
                    onClick={() => {
                      onView(player);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(player);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Player
                  </button>
                )}
                <button
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2 disabled:opacity-50"
                >
                  {resetting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Reset Password
                    </>
                  )}
                </button>
                {onDelete && (
                  <>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${fullName}?`)) {
                          onDelete(player.id);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Player
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Jersey Number Badge */}
          {player.jersey_number && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white font-bold px-3 py-1 rounded-lg shadow-md">
              #{player.jersey_number}
            </div>
          )}

          {/* Status Badge */}
          {player.player_status && (
            <div className="absolute bottom-2 left-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(player.player_status)}`}>
                {player.player_status.charAt(0).toUpperCase() + player.player_status.slice(1).replace('_', ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
            {fullName}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{player.position}</p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onView && (
              <button
                onClick={() => onView(player)}
                className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            )}
            <button
              onClick={handleResetPassword}
              disabled={resetting}
              title="Reset Password"
              className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Modal */}
      {credentials && (
        <CredentialsModal
          isOpen={showCredentialsModal}
          onClose={() => {
            setShowCredentialsModal(false);
            clearCredentials();
          }}
          credentials={credentials}
        />
      )}
    </>
  );
}
