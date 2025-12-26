import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/firebase";

/**
 * User role types
 */
export const USER_ROLES = {
  USER: "user",           // Regular user
  CONTENT_CREATOR: "content_creator", // Can create content
  MODERATOR: "moderator", // Can moderate content
  ADMIN: "admin",         // Full admin access
};

/**
 * Approval status for content and users
 */
export const APPROVAL_STATUS = {
  PENDING: "pending",       // Awaiting admin approval
  APPROVED: "approved",     // Approved by admin
  REJECTED: "rejected",     // Rejected by admin
  AUTO_APPROVED: "auto_approved", // Automatically approved (e.g., for trusted users)
};

/**
 * Create a new user document in Firestore with role and approval status
 * Called after successful authentication
 * 
 * @param {string} uid - Firebase user UID
 * @param {Object} userData - User data from auth
 * @param {string} userData.email - User email
 * @param {string} userData.displayName - User display name
 * @param {string} userData.mobileNumber - User mobile number (optional)
 * @param {string} userData.country - User country code (optional)
 * @param {string} userData.provider - Auth provider (email, google, etc.)
 * @returns {Promise<void>}
 */
export const createUserDocument = async (uid, userData) => {
  try {
    const userDocRef = doc(db, "users", uid);
    
    // Check if user document already exists (for social login)
    const existingDoc = await getDoc(userDocRef);
    if (existingDoc.exists()) {
      console.log("User document already exists");
      return;
    }

    const userDocument = {
      // Auth info
      uid,
      email: userData.email,
      displayName: userData.displayName || "",
      mobileNumber: userData.mobileNumber || null,
      country: userData.country || null,
      provider: userData.provider || "email",

      // Role and permissions
      role: USER_ROLES.USER, // Default role for new users
      
      // Approval workflow for future admin panel
      approvalStatus: APPROVAL_STATUS.AUTO_APPROVED, // New users auto-approved (can be changed by admin)
      approvedBy: null, // Will be set when admin approves
      approvalDate: null, // Will be set when approved/rejected
      
      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true,
      
      // For future content management
      contentCreatedCount: 0,
      bookingsCount: 0,
    };

    await setDoc(userDocRef, userDocument);
    console.log("User document created successfully:", uid);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

/**
 * Get user document with role and approval info
 * 
 * @param {string} uid - Firebase user UID
 * @returns {Promise<Object|null>} User document or null
 */
export const getUserDocument = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw error;
  }
};

/**
 * Update user role (admin only in production)
 * 
 * @param {string} uid - Firebase user UID
 * @param {string} role - New role (from USER_ROLES)
 * @returns {Promise<void>}
 */
export const updateUserRole = async (uid, role) => {
  try {
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      role,
      updatedAt: serverTimestamp(),
    });
    console.log(`User role updated to ${role} for user:`, uid);
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Update user approval status (admin only)
 * 
 * @param {string} uid - Firebase user UID
 * @param {string} status - New status (from APPROVAL_STATUS)
 * @param {string} adminUid - UID of admin approving (optional)
 * @returns {Promise<void>}
 */
export const updateUserApprovalStatus = async (uid, status, adminUid = null) => {
  try {
    if (!Object.values(APPROVAL_STATUS).includes(status)) {
      throw new Error(`Invalid approval status: ${status}`);
    }
    
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      approvalStatus: status,
      approvedBy: adminUid,
      approvalDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`User approval status updated to ${status} for user:`, uid);
  } catch (error) {
    console.error("Error updating approval status:", error);
    throw error;
  }
};

/**
 * Check if user has a specific role or higher
 * 
 * @param {string} userRole - User's current role
 * @param {string} requiredRole - Required role to check
 * @returns {boolean}
 */
export const hasRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    [USER_ROLES.USER]: 0,
    [USER_ROLES.CONTENT_CREATOR]: 1,
    [USER_ROLES.MODERATOR]: 2,
    [USER_ROLES.ADMIN]: 3,
  };

  const userLevel = roleHierarchy[userRole] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole] ?? -1;

  return userLevel >= requiredLevel;
};

/**
 * Check if user is approved
 * 
 * @param {string} approvalStatus - User's approval status
 * @returns {boolean}
 */
export const isUserApproved = (approvalStatus) => {
  return approvalStatus === APPROVAL_STATUS.APPROVED || 
         approvalStatus === APPROVAL_STATUS.AUTO_APPROVED;
};

/**
 * Get all users with pending approval (admin only)
 * 
 * @returns {Promise<Array>} Array of pending users
 */
export const getPendingApprovalUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("approvalStatus", "==", APPROVAL_STATUS.PENDING));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching pending approval users:", error);
    throw error;
  }
};

/**
 * Update user last login timestamp
 * 
 * @param {string} uid - Firebase user UID
 * @returns {Promise<void>}
 */
export const updateLastLogin = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      lastLoginAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};

/**
 * Utility function to check if user meets content creation requirements
 * Can be extended for approval-based content
 * 
 * @param {Object} userDoc - User document from Firestore
 * @returns {boolean} True if user can create content
 */
export const canCreateContent = (userDoc) => {
  if (!userDoc) return false;
  
  const isApproved = isUserApproved(userDoc.approvalStatus);
  const hasPermission = hasRole(userDoc.role, USER_ROLES.CONTENT_CREATOR) || 
                        hasRole(userDoc.role, USER_ROLES.ADMIN);
  
  return isApproved && hasPermission;
};
