import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  createdAt?: string;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  country: {
    code: string;
    name: string;
    dial: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

/**
 * Convert Firebase User to our AuthUser interface
 */
const firebaseUserToAuthUser = (user: User, provider: string = 'email'): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider,
    createdAt: user.metadata?.creationTime,
  };
};

/**
 * Sign up with email and password
 */
export const signupWithEmail = async (data: SignupData): Promise<AuthUser> => {
  try {
    // Create user account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // Update user profile with full name
    await updateProfile(user, {
      displayName: data.fullName,
    });

    // Refresh the user object to get updated profile
    user.reload();

    // Store additional user data (for future Firestore integration)
    // This is where we'd save to Firestore in production
    const userData = {
      uid: user.uid,
      email: data.email,
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      country: data.country,
      provider: 'email',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // For now, log to console (prepare for future Firestore integration)
    console.log('User data ready for Firestore:', userData);

    return firebaseUserToAuthUser(user, 'email');
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Login with email and password
 */
export const loginWithEmail = async (data: LoginData): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    return firebaseUserToAuthUser(userCredential.user, 'email');
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Store Google user data (for future Firestore integration)
    const userData = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
      provider: 'google',
      photoURL: user.photoURL,
      createdAt: user.metadata?.creationTime,
      updatedAt: new Date().toISOString(),
    };

    console.log('Google user data ready for Firestore:', userData);

    return firebaseUserToAuthUser(user, 'google');
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Get current user (returns null if no user is logged in)
 */
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  if (!user) return null;
  
  // Determine provider
  const provider = user.providerData[0]?.providerId || 'email';
  return firebaseUserToAuthUser(user, provider);
};

/**
 * Handle Firebase authentication errors
 */
const handleAuthError = (error: any): Error => {
  let message = 'An authentication error occurred';

  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'Email already in use. Please login or use a different email';
        break;
      case 'auth/operation-not-allowed':
        message = 'This operation is not allowed';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Google sign-in was cancelled';
        break;
      case 'auth/popup-blocked':
        message = 'Google sign-in popup was blocked. Please allow popups';
        break;
      case 'auth/account-exists-with-different-credential':
        message = 'An account already exists with this email using a different sign-in method';
        break;
      default:
        message = error.message || message;
    }
  }

  return new Error(message);
};

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export const onAuthStateChange = (callback: (user: AuthUser | null) => void): (() => void) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      callback(firebaseUserToAuthUser(user));
    } else {
      callback(null);
    }
  });
};
