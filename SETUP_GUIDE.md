# StoriesByFoot - Complete Authentication System Setup Guide

## ✅ What's Been Implemented

Your website now has a **complete, secure authentication and role-based system** with:

- ✅ **User Authentication**: Sign up, login, password reset via OTP
- ✅ **Two Roles**: Admin (singular) and Users
- ✅ **Admin Features**: Create users, manage testimonials, toggle user permissions, suspend/delete accounts
- ✅ **User Features**: Write testimonials (if enabled by admin), view dashboard
- ✅ **OTP-Based Password Reset**: Users get OTP via email
- ✅ **Fully Responsive Design**: Works on all devices
- ✅ **Database Security**: Row Level Security (RLS) prevents SQL injection

---

## 🚀 Step-by-Step Setup

### Step 1: Create the Database Schema in Supabase

1. Go to your **Supabase Dashboard** → Your Project
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire SQL code from `DATABASE_SCHEMA.sql` file in your project
5. Paste it into the SQL editor
6. Click **Run** button
7. Wait for success message ✓

### Step 2: Create Your Admin Account

#### Option A: Using Supabase Auth (Recommended)

1. In **Supabase Dashboard**, go to **Authentication** → **Users**
2. Click **Add User**
3. Fill in:
   - Email: `admin@storiesbyfoot.com` (or your email)
   - Password: Choose a strong password
4. Click **Create User**
5. Copy the user ID
6. Go to **SQL Editor** and run this query (replace `user-id-here` with the copied ID):

```sql
INSERT INTO users (id, email, fullName, role, isActive, canWriteTestimonial)
VALUES ('user-id-here', 'admin@storiesbyfoot.com', 'Admin User', 'admin', true, true);
```

#### Option B: Using Your Website

1. Click **Login** on your website
2. Click **Sign Up**
3. Fill in details and create account
4. Go to **Supabase Dashboard** → **SQL Editor** → Run this query:

```sql
UPDATE users SET role = 'admin', canWriteTestimonial = true WHERE email = 'your-email@example.com';
```

### Step 3: Test the System

#### Test User Signup & Login:

1. Go to your website
2. Click **Login** button
3. Create a new test user account
4. Try logging in

#### Test Admin Dashboard:

1. Log in with your **admin account**
2. Click your name in top navigation
3. Click **Admin Dashboard**
4. You should see:
   - User count
   - Testimonial count
   - Form to create new users
   - List of all users
   - Toggle buttons to enable/disable testimonial writing
   - Suspend/Delete user options
   - Testimonial management (publish/unpublish/delete)

#### Test User Dashboard:

1. Log in with a **regular user account**
2. Click your name in top navigation
3. Click **My Dashboard**
4. You should see:
   - Warning that account isn't enabled yet
   - Form to write testimonials (disabled)
   - Empty testimonials list

#### Enable User to Write Testimonials:

1. Log in as **admin**
2. Go to **Admin Dashboard** → **Users** tab
3. Find the test user
4. Click **Enable Writing** button (should turn green)
5. Log out and log in as **test user**
6. Go to **My Dashboard** → **Write Testimonial** tab
7. Form should now be enabled!
8. Fill in and submit testimonial
9. Go back to **Admin Dashboard** → **Testimonials** tab
10. Your testimonial appears as "Draft"
11. Click **Publish** button
12. It now appears as "Published"
13. Go to **Testimonials** page on your website
14. Your testimonial should appear!

#### Test Password Reset:

1. Click **Login**
2. Click **Forgot password?**
3. Enter your email
4. OTP should be sent (check your email or Supabase logs)
5. Check your email for the OTP
6. Enter OTP and new password

---

## 📂 Project Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Authentication state & logic
├── lib/
│   └── supabase.ts              # Supabase client & types
├── components/
│   ├── LoginModal.tsx           # Login/Signup/OTP form
│   ├── Navigation.tsx           # Updated with user menu
│   ├── ProtectedRoute.tsx       # Role-based route protection
│   └── ...
├── pages/
│   ├── AdminDashboard.tsx       # Admin panel
│   ├── UserDashboard.tsx        # User panel
│   ├── Testimonials.tsx         # Updated to use database
│   └── ...
└── App.tsx                      # Routes updated

DATABASE_SCHEMA.sql             # Copy-paste into Supabase SQL Editor
SETUP_GUIDE.md                  # This file
```

---

## 🔐 Security Features

### SQL Injection Protection ✅
- **Parameterized Queries**: All database queries use Supabase's safe API (no string concatenation)
- **Row Level Security (RLS)**: Database-level access control
- **Type Safety**: TypeScript prevents invalid data

### Example of Safe Code:
```typescript
// ✅ SAFE - Uses parameterized query
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)  // Email is a parameter

// ❌ NEVER - String concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
```

### Row Level Security (RLS) Policies:
- Users can ONLY see/edit their own profile
- Users can ONLY write testimonials if enabled by admin
- Admin can see/edit everything
- Only owner can delete their testimonials

---

## 🛠️ Common Tasks

### Create a New User (Admin Dashboard)

1. Log in as admin
2. Go to **Admin Dashboard** → **Users** tab
3. Fill in:
   - Full Name
   - Email
   - Password
4. Click **Create User**
5. User receives email with verification link

### Enable User to Write Testimonials

1. Go to **Admin Dashboard** → **Users**
2. Find the user
3. Click **Enable Writing** button
4. Status changes to "✓ Can Write"

### Suspend a User Account

1. Go to **Admin Dashboard** → **Users**
2. Find the user
3. Click **Suspend** button
4. User marked as "Suspended"
5. User cannot log in

### Delete a User

1. Go to **Admin Dashboard** → **Users**
2. Find the user
3. Click **Trash** button
4. Confirm deletion
5. User and all their testimonials are deleted

### Publish a Testimonial

1. Go to **Admin Dashboard** → **Testimonials**
2. Find draft testimonial
3. Click **Publish** button
4. Testimonial appears on website

---

## 🧪 Test Credentials

After setup, you can use these to test:

**Admin Account:**
- Email: `admin@storiesbyfoot.com`
- Password: (whatever you set)

**Test User (Create via Signup):**
- Any email/password combination
- Initially **cannot write testimonials**
- Admin must enable first

---

## ❓ Troubleshooting

### Problem: "Failed to load dashboard data"

**Solution:**
1. Check Supabase is connected
2. Verify SQL schema was created (go to Supabase → Tables)
3. Clear browser cache and refresh
4. Check browser console for errors (F12)

### Problem: "Email not received" (for OTP)

**Solution:**
1. Check Supabase **Auth** → **Email Templates**
2. Make sure email provider is configured
3. Verify email sending is enabled in Supabase settings
4. Check spam folder
5. Wait 1-2 minutes (sometimes slow)

### Problem: "User can't write testimonials"

**Solution:**
1. Log in as admin
2. Go to **Admin Dashboard** → **Users**
3. Check user's "Can Write" status
4. Click **Enable Writing** if it's disabled

### Problem: "Routes not working" (404 errors)

**Solution:**
1. Make sure you're logged in for protected routes
2. Admin routes only for admin users
3. User routes only for regular users

---

## 📞 Support & Next Steps

### For Bugs or Issues:
1. Check browser console (F12 → Console tab)
2. Check Supabase logs (Dashboard → Logs)
3. Check if Supabase is running (might be paused)

### Customizations You Can Make:

1. **Change Email Domain**: Update sender email in Supabase Email Templates
2. **Add More User Roles**: Modify `USER_TYPES` in the code
3. **Change Colors**: Edit Tailwind classes in components
4. **Add More Fields**: Extend database schema and forms

### Deployment:

Your code is ready to deploy to:
- **Vercel** (recommended for React)
- **Netlify**
- **Any Node.js hosting**

Supabase handles the backend automatically!

---

## 🎉 You're All Set!

Your StoriesByFoot website now has a **professional, secure authentication system** with:

✅ User management
✅ Role-based access control
✅ Testimonial management
✅ OTP password reset
✅ Full responsiveness
✅ SQL injection protection
✅ Enterprise-grade security

Start by testing with the steps above, then invite your team!

---

**Last Updated:** December 2024
**Supabase Version:** Latest
**Status:** Production Ready ✅
