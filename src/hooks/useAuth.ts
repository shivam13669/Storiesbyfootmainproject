import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";
import { 
  getUserDocument, 
  updateLastLogin,
  USER_ROLES,
  APPROVAL_STATUS,
  hasRole,
  isUserApproved,
  canCreateContent,
} from "@/services/firestore";

interface UserWithRole extends User {
  role?: string;
  approvalStatus?: string;
  displayName?: string | null;
}

interface AuthContextType {
  user: UserWithRole | null;
  userDoc: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  canCreateContent: boolean;
  checkRole: (role: string) => boolean;
  logout: () => Promise<void>;
}

/**
 * Custom hook for managing authentication state with role support
 * Returns user auth state, role information, and utility functions
 * 
 * Usage:
 *   const { user, isAdmin, isApproved, canCreateContent } = useAuth();
 *   
 *   // Check if user has specific role
 *   if (isAdmin) { ... }
 *   
 *   // Conditionally render based on approval status
 *   {isApproved && <ContentCreation />}
 * 
 * @returns {AuthContextType} Auth state and utilities
 */
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [userDoc, setUserDoc] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);
        setError(null);

        if (currentUser) {
          // Fetch user document from Firestore to get role and approval status
          const userDocData = await getUserDocument(currentUser.uid);

          // Update last login
          await updateLastLogin(currentUser.uid);

          // Merge auth user with Firestore data
          const userWithRole = {
            ...currentUser,
            role: userDocData?.role || USER_ROLES.USER,
            approvalStatus: userDocData?.approvalStatus || APPROVAL_STATUS.PENDING,
          } as UserWithRole;

          setUser(userWithRole);
          setUserDoc(userDocData);
        } else {
          setUser(null);
          setUserDoc(null);
        }
      } catch (err) {
        console.error("Error in useAuth:", err);
        setError(err instanceof Error ? err.message : "Auth error occurred");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserDoc(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    }
  };

  const checkRole = (role: string): boolean => {
    if (!user?.role) return false;
    return hasRole(user.role, role);
  };

  const isAdmin = checkRole(USER_ROLES.ADMIN);
  const isModerator = checkRole(USER_ROLES.MODERATOR);
  const isContentCreator = checkRole(USER_ROLES.CONTENT_CREATOR);
  const userApproved = isUserApproved(user?.approvalStatus || APPROVAL_STATUS.PENDING);
  const canCreate = userDoc ? canCreateContent(userDoc) : false;

  return {
    user,
    userDoc,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    isApproved: userApproved,
    canCreateContent: canCreate,
    checkRole,
    logout,
  };
};

export default useAuth;
