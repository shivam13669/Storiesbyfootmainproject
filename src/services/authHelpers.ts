import { 
  USER_ROLES, 
  APPROVAL_STATUS,
  hasRole,
  isUserApproved,
} from "@/services/firestore";

/**
 * Common permission checks for components and features
 * These can be used to conditionally render UI or protect actions
 */

interface UserPermissions {
  role: string;
  approvalStatus: string;
  isActive: boolean;
}

/**
 * Check if user can view a protected feature
 * (Approval is required, user must be active)
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {boolean} True if user can access protected features
 */
export const canAccessProtectedFeatures = (userPerms: UserPermissions): boolean => {
  if (!userPerms) return false;
  
  return (
    isUserApproved(userPerms.approvalStatus) &&
    userPerms.isActive === true
  );
};

/**
 * Check if user can view/manage content
 * Requires: approval + content creator role or higher
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {boolean}
 */
export const canManageContent = (userPerms: UserPermissions): boolean => {
  if (!userPerms) return false;
  
  return (
    isUserApproved(userPerms.approvalStatus) &&
    userPerms.isActive === true &&
    hasRole(userPerms.role, USER_ROLES.CONTENT_CREATOR)
  );
};

/**
 * Check if user can moderate other users' content
 * Requires: moderator role or higher
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {boolean}
 */
export const canModerate = (userPerms: UserPermissions): boolean => {
  if (!userPerms) return false;
  
  return hasRole(userPerms.role, USER_ROLES.MODERATOR);
};

/**
 * Check if user has full admin access
 * Requires: admin role
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {boolean}
 */
export const isFullAdmin = (userPerms: UserPermissions): boolean => {
  if (!userPerms) return false;
  
  return hasRole(userPerms.role, USER_ROLES.ADMIN);
};

/**
 * Get user-friendly role display name
 * 
 * @param {string} role - Role constant
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    [USER_ROLES.USER]: "Traveler",
    [USER_ROLES.CONTENT_CREATOR]: "Content Creator",
    [USER_ROLES.MODERATOR]: "Moderator",
    [USER_ROLES.ADMIN]: "Administrator",
  };
  
  return roleNames[role] || "Unknown";
};

/**
 * Get user-friendly approval status display name
 * 
 * @param {string} status - Approval status constant
 * @returns {string} Display name
 */
export const getApprovalStatusDisplayName = (status: string): string => {
  const statusNames: Record<string, string> = {
    [APPROVAL_STATUS.PENDING]: "Pending Approval",
    [APPROVAL_STATUS.APPROVED]: "Approved",
    [APPROVAL_STATUS.REJECTED]: "Rejected",
    [APPROVAL_STATUS.AUTO_APPROVED]: "Approved",
  };
  
  return statusNames[status] || "Unknown";
};

/**
 * Get status badge color for UI display
 * 
 * @param {string} status - Approval status
 * @returns {string} CSS class or color string
 */
export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case APPROVAL_STATUS.APPROVED:
    case APPROVAL_STATUS.AUTO_APPROVED:
      return "bg-green-100 text-green-800";
    case APPROVAL_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case APPROVAL_STATUS.REJECTED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Check if user account is restricted (rejected/suspended)
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {boolean} True if account is restricted
 */
export const isAccountRestricted = (userPerms: UserPermissions): boolean => {
  if (!userPerms) return false;
  
  return (
    userPerms.approvalStatus === APPROVAL_STATUS.REJECTED ||
    userPerms.isActive === false
  );
};

/**
 * Get error message for restricted account
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {string} Error message to display
 */
export const getRestrictionMessage = (userPerms: UserPermissions): string => {
  if (!userPerms) return "Account not found";
  
  if (userPerms.isActive === false) {
    return "Your account has been suspended. Please contact support.";
  }
  
  if (userPerms.approvalStatus === APPROVAL_STATUS.REJECTED) {
    return "Your account has been rejected. Please contact support for more information.";
  }
  
  if (userPerms.approvalStatus === APPROVAL_STATUS.PENDING) {
    return "Your account is pending approval. You'll be notified once reviewed.";
  }
  
  return "Your account has access restrictions";
};

/**
 * Check if user needs to complete onboarding
 * (For future onboarding flow - currently all users auto-approved)
 * 
 * @param {UserPermissions} userPerms - User permissions object
 * @returns {boolean}
 */
export const needsOnboarding = (userPerms: UserPermissions): boolean => {
  if (!userPerms) return false;
  
  // Can be extended for onboarding requirements
  return userPerms.approvalStatus === APPROVAL_STATUS.PENDING;
};

/**
 * Guard component wrapper for role-based rendering
 * Usage in components:
 * 
 *   const { user } = useAuth();
 *   if (!hasPermission(user, USER_ROLES.ADMIN)) {
 *     return <AccessDenied />;
 *   }
 * 
 * @param {UserPermissions} userPerms - User permissions
 * @param {string} requiredRole - Required role
 * @returns {boolean}
 */
export const hasPermission = (userPerms: UserPermissions | null, requiredRole: string): boolean => {
  if (!userPerms) return false;
  
  // Check if active and approved first
  if (!canAccessProtectedFeatures(userPerms)) return false;
  
  // Then check role
  return hasRole(userPerms.role, requiredRole);
};

/**
 * Log user action for audit trail
 * Future: Send to Firestore audit log
 * 
 * @param {string} userId - User ID
 * @param {string} action - Action description
 * @param {any} metadata - Additional data
 */
export const logUserAction = (
  userId: string,
  action: string,
  metadata?: any
): void => {
  const log = {
    userId,
    action,
    timestamp: new Date().toISOString(),
    metadata,
  };
  
  console.log("[AUDIT LOG]", log);
  
  // TODO: Send to Firestore audit collection
  // await addDoc(collection(db, "audit_logs"), log);
};

/**
 * Check if two users can interact
 * (E.g., moderator can moderate user, user can't suspend admin)
 * 
 * @param {UserPermissions} initiatorPerms - Initiating user
 * @param {UserPermissions} targetPerms - Target user
 * @returns {boolean}
 */
export const canModifyUser = (
  initiatorPerms: UserPermissions,
  targetPerms: UserPermissions
): boolean => {
  // Can't modify yourself
  if (initiatorPerms.role === targetPerms.role) {
    return hasRole(initiatorPerms.role, USER_ROLES.ADMIN);
  }
  
  // Must have higher role
  return hasRole(initiatorPerms.role, targetPerms.role) &&
         hasRole(initiatorPerms.role, USER_ROLES.MODERATOR);
};

/**
 * Prepare user for role change
 * Validates transition is allowed
 * 
 * @param {string} currentRole - Current user role
 * @param {string} newRole - New role to assign
 * @returns {Object} { isValid, message }
 */
export const validateRoleTransition = (
  currentRole: string,
  newRole: string
): { isValid: boolean; message: string } => {
  const validRoles = Object.values(USER_ROLES);
  
  if (!validRoles.includes(newRole)) {
    return { isValid: false, message: "Invalid role" };
  }
  
  if (currentRole === newRole) {
    return { isValid: false, message: "User already has this role" };
  }
  
  return { isValid: true, message: "Role change valid" };
};

/**
 * Format user info for admin display
 * 
 * @param {any} userDoc - User document from Firestore
 * @returns {Object} Formatted user info
 */
export const formatUserForAdmin = (userDoc: any) => {
  return {
    id: userDoc.uid,
    email: userDoc.email,
    name: userDoc.displayName,
    role: getRoleDisplayName(userDoc.role),
    status: getApprovalStatusDisplayName(userDoc.approvalStatus),
    joinedAt: userDoc.createdAt?.toDate?.().toLocaleDateString(),
    lastLogin: userDoc.lastLoginAt?.toDate?.().toLocaleDateString(),
  };
};
