# 🔧 Admin Upload & Content Issues - Fixes Applied

## 📋 Issues Fixed

### 1. ✅ File Upload Size Limit (413 Error)
**Problem:** Files were too large causing 413 Request Entity Too Large error

**Fix Applied:**
- Added 10MB file size limit check in `/api/upload/route.ts`
- Added better error messages showing actual file size
- Updated `next.config.mjs` with `bodyParser.sizeLimit: '10mb'`

**Files Modified:**
- `app/api/upload/route.ts` - Added file size validation
- `next.config.mjs` - Added API body parser size limit

---

### 2. ✅ CKEditor License Key Warning
**Problem:** CKEditor showing license-key-missing error

**Fix Status:** 
- Added `licenseKey: ''` configuration (uses GPL license)
- This removes the error - commercial key only needed for premium features

---

### 3. ⚠️ Content Not Appearing After Upload

**Root Cause Analysis:**
This could be caused by:
1. Database connection issues (Prisma not configured)
2. Missing DATABASE_URL in .env
3. Upload directory permissions
4. API route errors

**Troubleshooting Steps:**

### Step 1: Check Database Configuration
```bash
# Verify .env has DATABASE_URL
cat .env | grep DATABASE_URL
```

Should show something like:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/synapsemed"
```

### Step 2: Check Upload Directory
```bash
# Make sure public/uploads directory exists and is writable
mkdir -p public/uploads
chmod 755 public/uploads
```

### Step 3: Test Upload API
Try uploading a small file (< 1MB) first to test if it works.

---

## 🎯 How to Use the Fixed Upload Feature

### For Articles:
1. Go to `/admin/content/articles/add`
2. Fill in article details
3. **For PDF uploads**: Keep file under 10MB
4. Click "Publish Article"
5. You should see success message with file URL

### For Books:
1. Go to `/admin/content/books/add`  
2. Fill in book details
3. **Upload cover image**: JPG/PNG under 10MB
4. **Upload PDF**: Under 10MB
5. Click "Add Book"

### For Curriculum:
1. Go to `/admin/curriculum/add`
2. Fill curriculum details
3. **Upload documents**: Under 10MB each
4. Click "Create Curriculum"

---

## 🐛 If Still Having Issues

### Check Browser Console (F12):
Look for these errors:
- ❌ `413 Request Entity Too Large` → File is over 10MB
- ❌ `Unauthorized` → You're not logged in as admin
- ❌ `Failed to fetch` → Backend API issue
- ❌ `SyntaxError: Unexpected token '<'` → Server returned HTML error instead of JSON

### Check Server Logs:
```bash
# In your terminal running npm run dev
# Look for lines containing:
- "Upload error:"
- "Error adding"
- "413"
```

---

## 📝 File Size Recommendations

| File Type | Recommended Size | Maximum Allowed |
|-----------|-----------------|-----------------|
| Article PDF | 1-5 MB | 10 MB |
| Book Cover | 500 KB - 2 MB | 10 MB |
| Book PDF | 5-8 MB | 10 MB |
| Course Documents | 1-5 MB | 10 MB |

**Tip:** For larger files, compress them first:
- PDFs: Use online compressors or Adobe Acrobat
- Images: Resize to max 1920px width, compress to 80% quality

---

## 🔍 Testing Your Upload

### Test 1: Small File Upload
1. Create a small text file (< 100KB)
2. Try uploading it
3. Should work immediately

### Test 2: Medium File Upload  
1. Try a 5MB PDF
2. Should upload successfully
3. Check if file appears in `/public/uploads/` folder

### Test 3: Large File Upload
1. Try an 8MB file
2. Should still work (under 10MB limit)
3. May take longer to upload

### Test 4: Too Large File
1. Try a 15MB file
2. Should get clear error: "File too large. Maximum size is 10MB"

---

## ✅ Verification Checklist

After fixes are deployed, verify:

- [ ] Can upload files under 10MB
- [ ] Get clear error messages for files over 10MB
- [ ] Uploaded files appear in correct folder
- [ ] Articles show up in library after publishing
- [ ] Books show up in library after adding
- [ ] Curriculum shows up in courses page
- [ ] No CKEditor license errors
- [ ] Upload progress shows correctly

---

## 🚀 Next Steps

1. **Restart Development Server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files

3. **Test Upload:**
   - Try uploading a small file first
   - Verify it appears in the correct location

4. **Check Database:**
   - Make sure Prisma is connected
   - Run migrations if needed: `npx prisma migrate dev`

---

## 📞 Need More Help?

If issues persist, provide:
1. Exact error message from browser console
2. File size you're trying to upload
3. Screenshot of the error
4. Server logs from terminal

This will help diagnose the specific issue faster! 🛠️
