import { useState } from 'react';
import {
  Edit,
  Trash2,
  RotateCcw,
  Mail,
  Phone,
  Shield,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { usePasswordManagement } from '../hooks/usePasswordManagement';
import CredentialsModal from './modals/CredentialsModal';

interface StaffMember {
  id: string;
  staff_name: string;
  email: string;
  contact_number?: string;
  role: string;
  access_level?: string;
  is_active: boolean;
  last_login?: string;
  status?: string;
}

interface StaffCardProps {
  staff: StaffMember;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (staffId: string) => void;
  clubName?: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function StaffCard({
  staff,
  onEdit,
  onDelete,
  clubName,
  canEdit = true,
  canDelete = true,
}: StaffCardProps) {
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { credentials, resetStaffPassword, clearCredentials } = usePasswordManagement();

  const handleResetPassword = async () => {
    setResetting(true);

    try {
      await resetStaffPassword(staff.id, staff.email, staff.staff_name, clubName);
      setShowCredentialsModal(true);
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(staff);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to remove ${staff.staff_name}?`)) {
      onDelete(staff.id);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'super admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'coach':
        return 'bg-green-100 text-green-800';
      case 'analyst':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';

    try {
      const date = new Date(lastLogin);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {staff.staff_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              {/* Staff Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {staff.staff_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(staff.role)}`}>
                    {staff.role}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(staff.is_active)}`}>
                    {staff.is_active ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1">
              {canEdit && onEdit && (
                <button
                  onClick={handleEdit}
                  title="Edit Staff Details"
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleResetPassword}
                disabled={resetting}
                title="Reset Password"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {resetting ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{staff.email}</span>
            </div>
            {staff.contact_number && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{staff.contact_number}</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {staff.access_level && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>{staff.access_level}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Last login: {formatLastLogin(staff.last_login)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {canDelete && onDelete && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Staff Member
            </button>
          </div>
        )}
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
