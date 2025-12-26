# StoriesByFoot Admin Architecture

This document outlines the authentication, role-based access control (RBAC), and approval-based content system prepared for future admin panel development.

## Overview

The system is built to support:
- **User Roles**: Hierarchical role system (User → Content Creator → Moderator → Admin)
- **Approval Workflows**: Admin-controlled approval for users and content
- **Firestore Integration**: User data stored with extensible role and approval fields
- **Future Admin Panel**: Prepared for role management, user approval, and content moderation

## Architecture

### 1. Authentication Flow

```
User Signup/Login
    ↓
Firebase Auth (Email/Password or Google)
    ↓
User Created in Firestore with role="user"
    ↓
useAuth Hook loads user + role data
    ↓
App renders based on role + approval status
```

### 2. Firestore Data Structure

#### Users Collection (`/users/{uid}`)
```javascript
{
  // Auth info
  uid: "string",
  email: "string",
  displayName: "string",
  mobileNumber: "string | null",
  country: "string | null",
  provider: "email | google",

  // Role and permissions
  role: "user | content_creator | moderator | admin",

  // Approval workflow
  approvalStatus: "pending | approved | rejected | auto_approved",
  approvedBy: "admin_uid | null",
  approvalDate: "timestamp | null",

  // Metadata
  createdAt: "timestamp",
  updatedAt: "timestamp",
  lastLoginAt: "timestamp",
  isActive: "boolean",

  // Content tracking
  contentCreatedCount: "number",
  bookingsCount: "number",
}
```

### 3. User Roles

| Role | Level | Permissions | Use Case |
|------|-------|-----------|----------|
| `user` | 0 | View content, make bookings | Regular travelers |
| `content_creator` | 1 | Create and manage own content | Tour operators, hosts |
| `moderator` | 2 | Approve user content, manage reports | Community moderators |
| `admin` | 3 | Full system access, user management | Platform admins |

**Role Hierarchy**: Each role inherits permissions from lower levels.

```javascript
// Example: Check if user can moderate
if (hasRole(user.role, USER_ROLES.MODERATOR)) {
  // User is moderator or admin
}
```

### 4. Approval Status

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting admin review |
| `approved` | Explicitly approved by admin |
| `rejected` | Rejected by admin (account disabled) |
| `auto_approved` | Automatically approved (default for new users) |

**Content Protection**: Only approved users can create and publish content.

```javascript
if (isUserApproved(user.approvalStatus)) {
  // User is approved - allow content creation
}
```

## Usage

### In Components

```typescript
import { useAuth } from "@/hooks/useAuth";

export const MyComponent = () => {
  const { user, isAdmin, isApproved, canCreateContent } = useAuth();

  if (!isApproved) {
    return <PendingApprovalMessage />;
  }

  if (canCreateContent) {
    return <ContentCreationPanel />;
  }

  return <ContentViewer />;
};
```

### Firestore Operations

```typescript
import { 
  updateUserRole, 
  updateUserApprovalStatus,
  USER_ROLES,
  APPROVAL_STATUS 
} from "@/services/firestore";

// Promote user to content creator (admin only)
await updateUserRole(userId, USER_ROLES.CONTENT_CREATOR);

// Approve a pending user (admin only)
await updateUserApprovalStatus(userId, APPROVAL_STATUS.APPROVED, adminUid);

// Get pending approvals (admin only)
const pendingUsers = await getPendingApprovalUsers();
```

## Future Admin Panel Implementation

### Step 1: Users Management Page

```typescript
// pages/admin/users.tsx
import { getPendingApprovalUsers, updateUserRole } from "@/services/firestore";

export const AdminUsersPage = () => {
  // 1. Fetch pending users
  const [pendingUsers, setPendingUsers] = useState([]);
  
  useEffect(() => {
    const loadPending = async () => {
      const users = await getPendingApprovalUsers();
      setPendingUsers(users);
    };
    loadPending();
  }, []);

  // 2. Show table with approve/reject buttons
  // 3. Call updateUserApprovalStatus on action
  // 4. Call updateUserRole to change roles
};
```

### Step 2: Content Moderation Page

```typescript
// pages/admin/content.tsx
// 1. Fetch content from Firestore collection
// 2. Show pending/approved/rejected content
// 3. Allow mods to approve/reject
// 4. Requires USER_ROLES.MODERATOR or higher
```

### Step 3: Dashboard

```typescript
// pages/admin/dashboard.tsx
// 1. User stats (total, pending approval, by role)
// 2. Content stats (published, pending, rejected)
// 3. Recent activity log
// 4. Quick actions for approvals
```

### Step 4: Role Management

```typescript
// pages/admin/roles.tsx
// 1. Manage user roles
// 2. Assign content creator access
// 3. Promote to moderator/admin
// 4. Requires USER_ROLES.ADMIN
```

## Security Considerations

### Firestore Security Rules (To be implemented in Firebase Console)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own data
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid && 
                      !request.resource.data.role &&
                      !request.resource.data.approvalStatus;
      allow write: if request.auth.uid == uid &&
                      hasRole(uid, 'admin');
    }
    
    // Content collection (example)
    match /content/{contentId} {
      allow read: if resource.data.approvalStatus == 'approved';
      allow create: if request.auth.uid != null &&
                       userIsApproved(request.auth.uid) &&
                       userCanCreateContent(request.auth.uid);
      allow update: if request.auth.uid == resource.data.createdBy ||
                       userRole(request.auth.uid) >= 'moderator';
    }
  }
}
```

## Approval Workflow Example

```
New User Signs Up
  ↓
Auto-approved (approvalStatus = "auto_approved")
Can view and book content
  ↓
User requests to create content
  ↓
Role changed to "content_creator" by admin
  ↓
User can now create content
  ↓
Content pending approval
  ↓
Moderator approves content
  ↓
Content published and visible
```

## Custom Hooks Available

### useAuth()
Returns user state, role info, and utilities
```typescript
const { user, isAdmin, isApproved, canCreateContent } = useAuth();
```

## Services Available

### firestore.js
- `createUserDocument()` - Create new user doc
- `getUserDocument()` - Fetch user doc
- `updateUserRole()` - Update user role
- `updateUserApprovalStatus()` - Update approval status
- `hasRole()` - Check if user has role
- `isUserApproved()` - Check approval status
- `getPendingApprovalUsers()` - Get pending users
- `canCreateContent()` - Check content creation permission
- `updateLastLogin()` - Track last login

## Constants

### USER_ROLES
- `USER` = "user"
- `CONTENT_CREATOR` = "content_creator"
- `MODERATOR` = "moderator"
- `ADMIN` = "admin"

### APPROVAL_STATUS
- `PENDING` = "pending"
- `APPROVED` = "approved"
- `REJECTED` = "rejected"
- `AUTO_APPROVED` = "auto_approved"

## Environment Variables (Future)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_ADMIN_PANEL_ENABLED=false  # Toggle admin panel visibility
```

## Testing Scenarios

1. **New User Registration**: Verify user doc created with `role=user` and `approvalStatus=auto_approved`
2. **Google Login**: Verify user doc created for new Google users
3. **Existing User Login**: Verify user doc not duplicated
4. **Role Promotion**: Change role in Firestore and verify useAuth hook updates
5. **Approval Workflow**: Reject user and verify they can't create content
6. **Content Protection**: Verify rejected users can't access protected features

## Future Extensions

1. **Suspension System**: Add suspension reason and duration
2. **Activity Logging**: Track all user actions for audit trail
3. **Content Approval**: Extend approval system to content/bookings
4. **Invitation System**: Admin invite system for specific roles
5. **Email Notifications**: Notify users of approval/rejection
6. **Ban System**: Permanent or temporary bans for abuse

## References

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)
