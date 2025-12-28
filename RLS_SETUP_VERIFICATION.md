# 🔐 RLS Setup Verification - Auth Profile Access

## Issue: "Logging in..." Gets Stuck

If users get stuck on "Logging in..." after successful Supabase auth, it's usually an **RLS (Row Level Security) policy issue**.

The frontend successfully authenticates, but **can't fetch the user's profile** from the `public.users` table.

---

## ✅ What RLS Policies You Need

Your `public.users` table must have these RLS policies enabled:

### **Policy 1: Users Can SELECT Their Own Row**

**When to check:** If "Logging in..." gets stuck

This policy allows a logged-in user to read their own profile row.

```sql
CREATE POLICY "Users can select own profile" ON public.users
FOR SELECT
USING (auth.uid() = id);
```

**What this does:**
- ✅ Logged-in users can read their own profile
- ❌ Prevents reading other users' profiles
- ✅ Required for profile fetch after login

---

### **Policy 2: Users Can UPDATE Their Own Row**

```sql
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

**What this does:**
- ✅ Allows users to update their own profile
- ❌ Prevents updating other users' profiles

---

### **Policy 3: Admins Can SELECT/UPDATE All Rows**

```sql
CREATE POLICY "Admins can see all users" ON public.users
FOR SELECT
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update all users" ON public.users
FOR UPDATE
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
```

---

## 🔍 How to Verify RLS Policies in Supabase

### **Step 1: Go to Supabase Dashboard**
1. https://app.supabase.com
2. Click your **StoriesByFoot** project

### **Step 2: Check RLS is Enabled**
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Run this query to check if RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';
```

**Expected result:**
```
 tablename | rowsecurity
-----------+-------------
 users     | t
```

If `rowsecurity` is `f`, RLS is **disabled**! You need to enable it:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

### **Step 3: Check Existing Policies**
Run this to see all policies on the `users` table:

```sql
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'users';
```

### **Step 4: Add Missing Policies**

If you don't see the policies above, add them using the SQL Editor.

---

## 🚨 Common RLS Mistakes

### ❌ **Mistake 1: RLS Disabled**
If RLS is disabled on the `users` table:
```
rowsecurity = false
```

**Fix:**
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

### ❌ **Mistake 2: No "SELECT own profile" Policy**

If this policy is missing:
```sql
CREATE POLICY "Users can select own profile" ON public.users
FOR SELECT
USING (auth.uid() = id);
```

**Result:** Users can't read their own profile after login → "Logging in..." gets stuck

---

### ❌ **Mistake 3: Overly Restrictive Policies**

If the policy is:
```sql
CREATE POLICY "Users can select own profile" ON public.users
FOR SELECT
USING (auth.uid() = id AND role = 'user');
```

**Problem:** Admin users (role = 'admin') can't read their own profile!

**Fix:** Remove the `role = 'user'` check - let users of any role read their own profile.

---

## 🧪 Testing RLS Policies

### **Test 1: Can User Fetch Their Own Profile?**

In your browser console (F12):
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', (await supabase.auth.getUser()).data.user.id)
  .single()

console.log('Data:', data)
console.log('Error:', error)
```

**Expected:**
- ✅ `data` contains your user profile
- ✅ `error` is null

**If failed:**
- ❌ `error.code` = `'42501'` → RLS policy denied
- ❌ `error.code` = `'PGRST116'` → No matching row (user not in database)

---

## 📋 Quick Checklist

Before testing login, verify:

- [ ] RLS is **enabled** on `public.users` table
  ```sql
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  ```

- [ ] "SELECT own profile" policy exists
  ```sql
  CREATE POLICY "Users can select own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);
  ```

- [ ] User exists in `public.users` table with matching `id` from auth
  ```sql
  SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';
  ```

- [ ] No overly restrictive policies blocking profile access

---

## 🔧 Complete RLS Setup (Full Script)

If you need to set everything up from scratch, run this in Supabase SQL Editor:

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT their own row
CREATE POLICY "Users can select own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can UPDATE their own row
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can SELECT all users
CREATE POLICY "Admins can select all users" ON public.users
  FOR SELECT
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Admins can UPDATE all users
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Verify
SELECT policyname FROM pg_policies WHERE tablename = 'users';
```

---

## 📞 Debugging Steps

If login still gets stuck:

1. **Check browser console (F12)** for error messages from the frontend
2. **Look for error code:**
   - `'42501'` = RLS policy denied
   - `'PGRST116'` = Row not found
3. **Run the test query** above to check if you can fetch your profile
4. **Check Supabase logs:**
   - Dashboard → **Logs** → Filter for your user ID
   - Look for permission denied errors

---

## ✅ After Fixing RLS

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Refresh the page**
3. **Try logging in again**
4. **Check browser console (F12)** - should see:
   ```
   [Auth] Login attempt for: your-email@example.com
   [Auth] Login successful, session created: user-id-here
   [Auth] Fetching profile for user: user-id-here
   [Auth] Profile fetched successfully: { userId: ..., role: 'admin' }
   ```

---

## 🎯 Expected Login Flow (After Fixes)

```
1. User enters email/password
2. Supabase auth succeeds ✓
3. [Auth] Login successful message in console
4. onAuthStateChange triggers
5. fetchUserProfile called
6. [Auth] Profile fetched successfully
7. User redirected to admin dashboard
8. Dashboard loads and displays data ✓
```

---

Now test your login! Let me know if you still see "Logging in..." stuck. 🚀
