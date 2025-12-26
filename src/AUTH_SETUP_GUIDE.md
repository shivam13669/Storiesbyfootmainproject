# Firebase Authentication & Admin Architecture Setup Guide

## What Was Implemented

This guide covers the complete Firebase authentication system with role-based access control and approval workflows, prepared for future admin panel and content moderation.

### Files Created

1. **`src/firebase.js`** (Updated)
   - Firebase and Firestore initialization
   - Exports: `app`, `auth`, `db`

2. **`src/services/firestore.js`** (New)
   - User document CRUD operations
   - Role management functions
   - Approval workflow utilities
   - Exports: `USER_ROLES`, `APPROVAL_STATUS`, functions

3. **`src/hooks/useAuth.ts`** (New)
   - Custom React hook for authentication state
   - Fetches user role and approval status from Firestore
   - Exports: `useAuth()` hook

4. **`src/services/authHelpers.ts`** (New)
   - Helper functions for permission checks
   - UI formatting utilities for roles/status
   - Audit logging preparation

5. **`src/ADMIN_ARCHITECTURE.md`** (New)
   - Complete architecture documentation
   - Firestore schema design
   - Future admin panel implementation guide
   - Security rules template

6. **`src/AUTH_SETUP_GUIDE.md`** (This File)
   - Quick start guide
   - Usage examples
   - Common patterns

7. **`src/components/LoginModal.tsx`** (Updated)
   - Now saves user data to Firestore on signup/Google login
   - Includes role and approval status fields

## Quick Start

### 1. Check User Authentication Status

```typescript
import { useAuth } from "@/hooks/useAuth";

export const MyComponent = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <Dashboard />;
};
```

### 2. Check User Role

```typescript
const { user, isAdmin, isApproved, canCreateContent } = useAuth();

{isAdmin && <AdminPanel />}
{isApproved && <PublishButton />}
{canCreateContent && <ContentCreator />}
```

### 3. Custom Role Checks

```typescript
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/services/firestore";

export const ModeratorPanel = () => {
  const { checkRole } = useAuth();

  if (!checkRole(USER_ROLES.MODERATOR)) {
    return <AccessDenied />;
  }

  return <ModerationDashboard />;
};
```

### 4. Use Permission Helpers

```typescript
import { canManageContent, isAccountRestricted } from "@/services/authHelpers";
import { useAuth } from "@/hooks/useAuth";

export const ContentPanel = () => {
  const { userDoc } = useAuth();

  if (!userDoc) return null;

  if (isAccountRestricted(userDoc)) {
    return <RestrictionMessage message={getRestrictionMessage(userDoc)} />;
  }

  if (!canManageContent(userDoc)) {
    return <NotAuthorizedMessage />;
  }

  return <ContentManagement />;
};
```

### 5. Create Protected Route

```typescript
// hooks/useProtectedRoute.ts
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useProtectedRoute = (requiredRole?: string) => {
  const { user, loading, checkRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/");
      return;
    }

    if (requiredRole && !checkRole(requiredRole)) {
      navigate("/access-denied");
    }
  }, [user, loading, requiredRole, checkRole, navigate]);

  return { user, loading };
};
```

### 6. Display User Role in UI

```typescript
import { getRoleDisplayName, getApprovalStatusDisplayName } from "@/services/authHelpers";

export const UserProfile = ({ user }) => {
  return (
    <div>
      <p>Role: {getRoleDisplayName(user.role)}</p>
      <p>Status: {getApprovalStatusDisplayName(user.approvalStatus)}</p>
    </div>
  );
};
```

## User Registration Flow

When a user signs up:

1. ✅ Firebase Auth creates authentication record
2. ✅ User display name stored in Auth
3. ✅ **Firestore document created** with:
   - Email, name, mobile, country
   - `role: "user"` (default)
   - `approvalStatus: "auto_approved"` (can create content immediately)
   - `createdAt`, `updatedAt`, `lastLoginAt` timestamps
   - `isActive: true`

### What This Means

- New users can immediately view and book content
- New users can create content (if they have content_creator role)
- Admin can manually review and change roles/approval status later

## Firestore Data Flow

```
User Signs Up
    ↓
createUserWithEmailAndPassword()
    ↓
updateProfile(user, { displayName })
    ↓
createUserDocument(uid, userData)  ← NEW
    ↓
Firestore /users/{uid} document created
    ↓
useAuth() hook fetches role + approval status
    ↓
Components render based on user.role and user.approvalStatus
```

## Example: Building an Admin Dashboard

### Step 1: Create Admin Page

```typescript
// pages/admin/index.tsx
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/services/firestore";

export const AdminDashboard = () => {
  const { user, checkRole } = useAuth();

  // Protect the page
  if (!checkRole(USER_ROLES.ADMIN)) {
    return <AccessDenied />;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UsersList />
      <ContentModeration />
      <Analytics />
    </div>
  );
};
```

### Step 2: Users Management List

```typescript
import { getPendingApprovalUsers, updateUserApprovalStatus } from "@/services/firestore";
import { formatUserForAdmin } from "@/services/authHelpers";

export const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const pendingUsers = await getPendingApprovalUsers();
      setUsers(pendingUsers);
    };
    loadUsers();
  }, []);

  const handleApprove = async (userId) => {
    await updateUserApprovalStatus(userId, APPROVAL_STATUS.APPROVED, currentAdminId);
    // Refresh list
  };

  return (
    <table>
      <tbody>
        {users.map((user) => (
          <tr key={user.uid}>
            <td>{formatUserForAdmin(user).name}</td>
            <td>{formatUserForAdmin(user).email}</td>
            <td>
              <button onClick={() => handleApprove(user.uid)}>Approve</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### Step 3: Role Management

```typescript
import { updateUserRole, USER_ROLES } from "@/services/firestore";

export const RoleSelector = ({ userId, currentRole }) => {
  const handleRoleChange = async (newRole) => {
    await updateUserRole(userId, newRole);
    toast.success("Role updated");
  };

  return (
    <select value={currentRole} onChange={(e) => handleRoleChange(e.target.value)}>
      <option value={USER_ROLES.USER}>User</option>
      <option value={USER_ROLES.CONTENT_CREATOR}>Content Creator</option>
      <option value={USER_ROLES.MODERATOR}>Moderator</option>
      <option value={USER_ROLES.ADMIN}>Admin</option>
    </select>
  );
};
```

## Available Constants

### USER_ROLES
```typescript
import { USER_ROLES } from "@/services/firestore";

USER_ROLES.USER              // "user"
USER_ROLES.CONTENT_CREATOR   // "content_creator"
USER_ROLES.MODERATOR         // "moderator"
USER_ROLES.ADMIN             // "admin"
```

### APPROVAL_STATUS
```typescript
import { APPROVAL_STATUS } from "@/services/firestore";

APPROVAL_STATUS.PENDING       // "pending"
APPROVAL_STATUS.APPROVED      // "approved"
APPROVAL_STATUS.REJECTED      // "rejected"
APPROVAL_STATUS.AUTO_APPROVED // "auto_approved"
```

## Available Functions

### From `firestore.js`
- `createUserDocument(uid, userData)` - Create user doc after signup
- `getUserDocument(uid)` - Fetch user doc by UID
- `updateUserRole(uid, role)` - Change user role
- `updateUserApprovalStatus(uid, status, adminUid)` - Change approval status
- `hasRole(userRole, requiredRole)` - Check role hierarchy
- `isUserApproved(approvalStatus)` - Check if approved
- `getPendingApprovalUsers()` - Get pending users
- `canCreateContent(userDoc)` - Check if can create content
- `updateLastLogin(uid)` - Track last login

### From `authHelpers.ts`
- `canAccessProtectedFeatures(userPerms)` - Access check
- `canManageContent(userPerms)` - Content creation check
- `canModerate(userPerms)` - Moderation check
- `isFullAdmin(userPerms)` - Admin check
- `getRoleDisplayName(role)` - Format role name
- `getApprovalStatusDisplayName(status)` - Format status name
- `isAccountRestricted(userPerms)` - Check if restricted
- `getRestrictionMessage(userPerms)` - Get restriction reason

### From `useAuth()` Hook
```typescript
const {
  user,              // Auth user object
  userDoc,           // Firestore user document
  loading,           // Is loading
  error,             // Any errors
  isAuthenticated,   // Is logged in
  isAdmin,           // Is admin user
  isApproved,        // Is approved
  canCreateContent,  // Can create content
  checkRole,         // Function to check role
  logout,            // Logout function
} = useAuth();
```

## Common Patterns

### Pattern 1: Conditional Rendering Based on Role

```typescript
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const { user, isAdmin } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAdmin && <Link to="/admin">Admin Panel</Link>}
      {user && <Link to="/profile">Profile</Link>}
    </nav>
  );
};
```

### Pattern 2: Async Operation with Role Check

```typescript
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/services/firestore";

export const PublishContent = ({ content }) => {
  const { checkRole } = useAuth();

  const handlePublish = async () => {
    if (!checkRole(USER_ROLES.CONTENT_CREATOR)) {
      toast.error("You don't have permission to publish");
      return;
    }

    try {
      await publishContentToFirestore(content);
      toast.success("Content published");
    } catch (error) {
      toast.error("Failed to publish");
    }
  };

  return <button onClick={handlePublish}>Publish</button>;
};
```

### Pattern 3: Loading States

```typescript
export const Dashboard = () => {
  const { user, loading, isApproved } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginRequired />;
  if (!isApproved) return <PendingApproval />;

  return <MainDashboard />;
};
```

## Testing

### Test User Registration

1. Sign up with email/password
2. Check Firestore `/users/{uid}` document is created
3. Verify fields: `role: "user"`, `approvalStatus: "auto_approved"`

### Test Role Update

1. Sign in as admin
2. Change another user's role in Firestore
3. Refresh app - user should see updated role via `useAuth()`

### Test Approval Workflow

1. Create test user
2. Set `approvalStatus: "rejected"` in Firestore
3. Verify `isApproved` returns false in `useAuth()`
4. Protected features should be hidden

## Next Steps

1. **Implement Admin Panel**
   - Use the functions in `firestore.js` to build admin pages
   - Follow examples in `ADMIN_ARCHITECTURE.md`

2. **Add Firestore Security Rules**
   - Restrict role/approval changes to admins only
   - Protect user data privacy

3. **Implement Content Approval**
   - Create `content` collection in Firestore
   - Use approval status for content publishing

4. **Add Email Notifications**
   - Notify users on role changes
   - Notify admins of pending approvals

5. **Implement Audit Logging**
   - Log all admin actions
   - Use `logUserAction()` from authHelpers

## Troubleshooting

### User not found in Firestore
- Check that `createUserDocument()` was called after signup
- Check Firestore rules allow user to read their own doc

### useAuth() not updating after role change
- Ensure you're updating Firestore with `updateUserRole()`
- useAuth() will refetch on role changes automatically

### Google login creates duplicate users
- This is expected - Google creates new Firestore doc if it doesn't exist
- Function checks for existing doc before creating

### Permissions denied in Firestore
- You need to set up Firestore Security Rules
- See `ADMIN_ARCHITECTURE.md` for rule templates

## Security Checklist

- [ ] Firestore Security Rules implemented
- [ ] Role changes only allowed by admins
- [ ] Approval status changes require admin auth
- [ ] User data privacy rules in place
- [ ] Audit logging implemented
- [ ] Rate limiting on auth endpoints
- [ ] CORS properly configured

## References

- **[ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md)** - Complete architecture guide
- **[Firebase Docs](https://firebase.google.com/docs)** - Official Firebase documentation
- **[Firestore Security](https://firebase.google.com/docs/firestore/security)** - Security rules guide
- **[React Hooks](https://react.dev/reference/react)** - React documentation
