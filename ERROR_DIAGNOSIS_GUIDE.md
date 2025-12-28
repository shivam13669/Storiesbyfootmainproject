# 🔍 Error Diagnosis Guide - Profile Fetch Errors

## Your Error

```
[Auth] Error fetching user profile: [object Object]
```

This error shows when the profile fetch from `public.users` fails, but the error details weren't showing properly (just `[object Object]`).

---

## ✅ What I Fixed

Improved error logging to show ALL error details instead of `[object Object]`.

Now when you see an error, you'll get:
```
[Auth] Error fetching user profile: {
  message: "...",
  code: "...",
  status: "...",
  details: "...",
  hint: "...",
  fullError: {...}
}
```

This shows the EXACT problem, making it easy to fix.

---

## 🔎 Common Profile Fetch Errors & Solutions

### **Error 1: RLS Policy Denied (Code: 42501)**

```
[Auth] RLS Policy Denied: Cannot fetch user profile. Check RLS policies.
```

**Cause:** Supabase RLS policy is blocking access to the user's own profile row.

**Solution:** You need this RLS policy:
```sql
CREATE POLICY "Users can select own profile" ON public.users
FOR SELECT
USING (auth.uid() = id);
```

**Steps:**
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Paste the SQL above
4. Click Run
5. Try login again

---

### **Error 2: User Not Found (Code: PGRST116)**

```
[Auth] User profile not found in database. User may not be set up yet.
```

**Cause:** User exists in auth but NOT in the `public.users` table.

**Solution:** You need to create the user profile:

**Option A: Auto-setup page**
1. Go to `/admin-setup` on your app
2. Click "Create Admin Profile"
3. Or use manual SQL below

**Option B: Manual SQL**
```sql
INSERT INTO public.users (id, email, fullName, role, isActive, canWriteTestimonial)
VALUES (
  'USER_ID_HERE',
  'email@example.com',
  'Name',
  'admin',
  true,
  true
);
```

**To find USER_ID:**
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

---

### **Error 3: Network Error / Connection Failed**

```
[Auth] Error fetching user profile: {
  message: "Failed to fetch",
  code: "NETWORK_ERROR"
}
```

**Cause:** Can't connect to Supabase (network issue).

**Solution:**
1. Check internet connection
2. Check if Supabase project is running (not paused)
3. Check environment variables are correct:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

### **Error 4: Table Doesn't Exist**

```
[Auth] Error fetching user profile: {
  message: "table \"users\" does not exist",
  code: "PGRST116"
}
```

**Cause:** The `public.users` table wasn't created.

**Solution:** You need to set up the database schema first.

From SETUP_GUIDE.md:
1. Supabase Dashboard → SQL Editor
2. Create the schema (see DATABASE_SCHEMA.sql in your project)

---

### **Error 5: Invalid Credentials / Authentication Failed**

```
[Auth] Login failed: {
  message: "Invalid login credentials",
  code: "invalid_credentials"
}
```

**Cause:** Email or password is wrong.

**Solution:**
1. Double-check email address (case-sensitive)
2. Double-check password
3. Make sure user exists in auth.users table

---

## 📊 New Error Logging Details

Now when you get an error, you'll see:

```javascript
{
  message: "The actual error message",
  code: "Error code (PGRST116, 42501, etc)",
  status: "HTTP status code",
  details: "Detailed error info from Supabase",
  hint: "Hint from Supabase",
  fullError: {...} // The complete error object
}
```

### **Error Codes Explained:**

| Code | Meaning | Fix |
|------|---------|-----|
| `PGRST116` | Row not found | Create user profile |
| `42501` | RLS denied | Add RLS policies |
| `NETWORK_ERROR` | Can't reach DB | Check connection |
| `invalid_credentials` | Email/password wrong | Check credentials |
| `UNAUTHORIZED` | Not authenticated | Log in first |

---

## 🧪 Testing to See Detailed Errors

### **Step 1: Clear Browser Cache**
```
Press Ctrl+Shift+Delete
Delete all cookies and cache
```

### **Step 2: Open Console**
```
Press F12 → Click "Console" tab
```

### **Step 3: Try Login**
Watch console for detailed error messages.

You'll now see the FULL error object instead of `[object Object]` ✓

---

## 📋 What to Do When You See an Error

1. **Read the error message carefully**
   - It tells you exactly what went wrong

2. **Look for the error code**
   - `42501` → Add RLS policies
   - `PGRST116` → Create user profile
   - `NETWORK_ERROR` → Check connection

3. **Check the hint/details**
   - Usually tells you how to fix it

4. **Apply the fix**
   - See solutions above for your error code

5. **Try login again**
   - Should work now!

---

## 🔧 If Still Having Issues

### **Issue: Still see [object Object]**

**Solution:** Refresh your browser completely
```
Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

This clears cache and loads latest code with better error logging.

---

### **Issue: Error message is still unclear**

**Steps:**
1. Open F12 console
2. Look at the `fullError` object
3. Check what properties it has
4. Look for `message`, `code`, or `status` fields

---

### **Issue: Multiple different errors occurring**

**This is normal!** Fix them one by one:
1. Check for RLS errors first → Add policies
2. Check for user not found → Create profile
3. Check for network errors → Verify connection

---

## 🎯 Quick Fix Checklist

If getting profile fetch error:

- [ ] Error message shows actual details (not [object Object])
- [ ] Error code is visible (42501, PGRST116, etc.)
- [ ] RLS policies exist in Supabase
  ```sql
  SELECT policyname FROM pg_policies WHERE tablename = 'users';
  ```
- [ ] User profile exists in public.users table
  ```sql
  SELECT id, email, role FROM public.users WHERE email = 'your@email.com';
  ```
- [ ] Supabase project is running (not paused)
- [ ] Environment variables set correctly
- [ ] Browser cache cleared (Ctrl+Shift+Delete)

---

## 📚 Related Documentation

See these guides for complete setup:
- **RLS_SETUP_VERIFICATION.md** - How to verify/fix RLS policies
- **COMPLETE_FIX_SUMMARY.txt** - Overview of all auth fixes
- **ADMIN_SETUP_FIX.md** - How to create admin profile

---

## ✨ Summary

The profile fetch error logging is now much better! Instead of `[object Object]`, you'll see:
- Exact error message
- Error code
- HTTP status
- Hints from Supabase

This makes debugging much easier! Use the console logs to identify and fix the issue. 🚀
