# 🔧 Admin Setup Fix - Complete Guide

## Problem Summary

You successfully logged in and saw "login successful", but:
1. The admin dashboard didn't open
2. Now you're stuck on "logging in" when trying again

This happens because your **admin profile wasn't created** in the database. Your email/password exists in Supabase Auth, but the app needs a corresponding profile in the `users` table with `role = 'admin'`.

---

## ✅ Solution (Choose One Option Below)

### **OPTION 1: Auto Setup (Recommended - Easiest)**

1. Go to your app and **log in** with your admin email/password
2. Once logged in, look in the **top-right dropdown menu** (your name)
3. Click **"Complete Admin Setup"** option
4. Click **"Create Admin Profile"** button
5. Done! ✓ You should be redirected to the admin dashboard

If this doesn't work, use **Option 2** below.

---

### **OPTION 2: Manual Setup via Supabase (Guaranteed to Work)**

Follow these exact steps:

#### Step 1: Open Supabase SQL Editor
1. Go to your **[Supabase Dashboard](https://app.supabase.com)**
2. Click on your **Project** (StoriesByFoot project)
3. In the left sidebar, click **SQL Editor**
4. Click **+ New Query** button

#### Step 2: Copy & Run the SQL Command

Copy the command below (it's already formatted with YOUR user ID):

```sql
UPDATE public.users SET role = 'admin', canWriteTestimonial = true WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE');
```

**IMPORTANT:** Replace `YOUR_EMAIL_HERE` with your actual email address. For example:
- If your email is `ali@example.com`, it becomes:
  ```sql
  UPDATE public.users SET role = 'admin', canWriteTestimonial = true WHERE id = (SELECT id FROM auth.users WHERE email = 'ali@example.com');
  ```

#### Step 3: Execute
1. Paste the SQL into the SQL Editor
2. Click the **Run** button
3. Wait for success message (should say "1 row updated")

#### Step 4: Test
1. Go back to your website
2. **Refresh the page** (Ctrl+R or Cmd+R)
3. Log in again
4. Click your name → **Admin Dashboard**
5. ✓ You should see the admin panel!

---

### **OPTION 3: If You Can't Find Your User ID**

If you don't know your user ID, use this SQL to find it first:

```sql
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL_HERE';
```

Then copy the `id` from the results and use it in this command:

```sql
UPDATE public.users 
SET role = 'admin', canWriteTestimonial = true 
WHERE id = 'YOUR_USER_ID_HERE';
```

For example, if your ID is `12345678-1234-1234-1234-123456789012`:

```sql
UPDATE public.users 
SET role = 'admin', canWriteTestimonial = true 
WHERE id = '12345678-1234-1234-1234-123456789012';
```

---

## 🔍 Verification

After running the SQL, verify it worked:

```sql
SELECT id, email, fullName, role, canWriteTestimonial FROM public.users WHERE email = 'YOUR_EMAIL_HERE';
```

You should see:
- `role` = `admin` ✓
- `canWriteTestimonial` = `true` ✓

---

## 📊 What Just Happened?

Your authentication setup:

```
Your Email ↓
    ↓
Supabase Auth Table (auth.users)
    ↓
Username & Password ✓ (working)
    ↓
But... missing ✗
    ↓
Public Users Table (public.users)
    ↓
Profile with role = 'admin'
```

Now after the fix:

```
Your Email ↓
    ↓
Supabase Auth Table (auth.users)
    ↓
Username & Password ✓ (working)
    ↓
AND now ✓
    ↓
Public Users Table (public.users)
    ↓
Profile with role = 'admin' ✓ (created!)
```

---

## 🚀 What to Do Next

Once your admin profile is set up:

### Create Regular Users
1. Go to **Admin Dashboard** → **Users** tab
2. Click **Create User**
3. Fill in: Email, Full Name, Password
4. Click **Create**

### Publish Testimonials
1. Go to **Admin Dashboard** → **Testimonials** tab
2. Click **Publish** on any draft testimonial
3. It now appears on your website!

### Enable Users to Write Testimonials
1. Go to **Admin Dashboard** → **Users** tab
2. Find the user
3. Click **Enable Writing** button
4. User can now submit testimonials

---

## ❓ Still Stuck?

If you're still having issues:

1. **Clear your browser cache:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Delete all cookies and cache
   - Refresh the page

2. **Check Supabase Status:**
   - Go to Supabase Dashboard
   - Check if your project is "Running" (not paused)
   - If paused, click "Resume Project"

3. **Verify Database Connection:**
   - In Supabase, go to **Tables**
   - You should see: `users`, `testimonials`, etc.
   - If missing, you haven't run the setup SQL from SETUP_GUIDE.md yet

4. **Check Environment Variables:**
   - Verify `VITE_SUPABASE_URL` is set correctly
   - Verify `VITE_SUPABASE_ANON_KEY` is set correctly

---

## 📞 Need Help?

If none of these steps work:
1. Check the browser console (F12 → Console tab) for error messages
2. Go to Supabase → **Logs** to see if there are database errors
3. Make sure you're using the correct email address (case-sensitive in database)

---

## ✨ You're All Set!

Once your admin profile is created, you can:
✅ Log in successfully
✅ Access admin dashboard
✅ Manage users and testimonials
✅ Configure your website

Happy managing! 🎉
