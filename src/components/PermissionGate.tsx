import { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  children: ReactNode;
  permission: keyof ReturnType<typeof usePermissions>['permissions'];
  fallback?: ReactNode;
  showDisabled?: boolean;
}

/**
 * PermissionGate Component
 *
 * Controls visibility and interactivity of UI elements based on user permissions
 *
 * @param permission - The permission key to check
 * @param fallback - Optional fallback content when permission is denied
 * @param showDisabled - If true, shows disabled version instead of hiding
 */
export default function PermissionGate({
  children,
  permission,
  fallback = null,
  showDisabled = false,
}: PermissionGateProps) {
  const { permissions, loading } = usePermissions();

  // Show loading state
  if (loading) {
    return null;
  }

  // Check if user has the required permission
  const hasPermission = permissions[permission];

  // If no permission and showDisabled is true, render disabled version
  if (!hasPermission && showDisabled) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none cursor-not-allowed">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            No Permission
          </div>
        </div>
      </div>
    );
  }

  // If no permission and fallback provided, show fallback
  if (!hasPermission && fallback) {
    return <>{fallback}</>;
  }

  // If no permission and no fallback, hide completely
  if (!hasPermission) {
    return null;
  }

  // User has permission, render children
  return <>{children}</>;
}

/**
 * Helper component for inline permission-based styling
 */
interface PermissionStyleProps {
  permission: keyof ReturnType<typeof usePermissions>['permissions'];
  children: (hasPermission: boolean) => ReactNode;
}

export function PermissionStyle({ permission, children }: PermissionStyleProps) {
  const { permissions, loading } = usePermissions();

  if (loading) {
    return null;
  }

  return <>{children(permissions[permission])}</>;
}
