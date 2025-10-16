# Frontend Improvements Implementation Guide

## Overview
This document outlines the required frontend changes for the Dental Clinic System.

## Changes Required

### 1. Move Profile Tab to Upper Right Corner
**Files to modify:**
- `frontend/app/owner/layout.tsx`
- `frontend/app/staff/layout.tsx`  
- `frontend/app/patient/layout.tsx`

**Implementation:**
- Remove profile section from sidebar
- Add top header bar with profile dropdown in upper right corner
- Profile should show user name, role, and dropdown with "Edit Profile" option
- Add top padding to main content area (`pt-16`)

**Code Pattern:**
```tsx
{/* Top Header for Desktop */}
<div className="hidden lg:block fixed top-0 right-0 z-30 bg-white border-b border-[var(--color-border)] px-6 py-3" style={{left: '16rem'}}>
  <div className="flex items-center justify-end">
    <div className="relative">
      <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors">
        <div className="text-right">
          <p className="font-medium text-[var(--color-text)] text-sm">{user?.first_name} {user?.last_name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Role</p>
        </div>
        <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
      </button>
      {isProfileOpen && (
        <div className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] p-2 z-50">
          <Link href="/ROLE/profile" className="block px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] rounded transition-colors">
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  </div>
</div>
```

### 2. Add Teeth Image Upload Functionality
**Files to modify:**
- `frontend/app/staff/patients/page.tsx` 
- `frontend/app/owner/patients/page.tsx`

**Implementation:**
- Add "Upload Teeth Image" button in patient details section
- Create image upload modal with:
  - Patient selector
  - Image upload field (accepts jpg, png)
  - Treatment notes textarea
  - Save button
- Store images with metadata (date, uploaded by, notes)
- Display latest image in patient details

**New Component to Create:**
`frontend/components/teeth-image-upload.tsx`

```tsx
"use client"

import { useState } from "react"
import { Upload, X, Camera } from "lucide-react"

interface TeethImageUploadProps {
  patientId: number
  patientName: string
  onClose: () => void
  onSave: (image: File, notes: string) => void
}

export default function TeethImageUpload({ patientId, patientName, onClose, onSave }: TeethImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [notes, setNotes] = useState("")

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedImage) {
      onSave(selectedImage, notes)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)]">
            Upload Teeth Image - {patientName}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Teeth Image
            </label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview("")
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-12 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer block">
                <Upload className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--color-text-muted)]">Click to upload teeth image</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">PNG, JPG up to 10MB</p>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            )}
          </div>

          {/* Treatment Notes */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Treatment Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any relevant notes about this image..."
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedImage}
              className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 3. Replace Tooth Chart with Latest Teeth Image
**File to modify:**
- `frontend/app/patient/records/page.tsx`

**Implementation:**
- Remove `InteractiveToothChart` component
- Replace with latest uploaded teeth image
- Add image viewer/zoom functionality
- Show upload date and dentist who uploaded
- Add download button for current image
- Show image history below (previous images with dates)

**Code Pattern:**
```tsx
{/* Latest Teeth Image */}
<div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Current Teeth Image</h2>
    <button className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]">
      Download
    </button>
  </div>
  
  {latestImage ? (
    <div>
      <img src={latestImage.url} alt="Current teeth" className="w-full rounded-lg mb-4" />
      <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
        <span>Uploaded: {latestImage.date}</span>
        <span>By: {latestImage.dentist}</span>
      </div>
      {latestImage.notes && (
        <div className="mt-4 p-4 bg-[var(--color-background)] rounded-lg">
          <p className="text-sm">{latestImage.notes}</p>
        </div>
      )}
    </div>
  ) : (
    <div className="text-center py-12 text-[var(--color-text-muted)]">
      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p>No teeth images uploaded yet</p>
    </div>
  )}
</div>

{/* Image History */}
<div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
  <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-4">Previous Images</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {previousImages.map((image) => (
      <div key={image.id} className="border border-[var(--color-border)] rounded-lg p-3">
        <img src={image.url} alt="Previous" className="w-full h-32 object-cover rounded mb-2" />
        <p className="text-xs text-[var(--color-text-muted)]">{image.date}</p>
        <button className="text-xs text-[var(--color-primary)] hover:underline mt-1">Download</button>
      </div>
    ))}
  </div>
</div>
```

### 4. Add Billing Status Management
**Files to modify:**
- `frontend/app/staff/billing/page.tsx`
- `frontend/app/owner/billing/page.tsx`

**Implementation:**
- Add status dropdown to "Add SOA" modal with options: Pending, Paid, Cancelled
- Add status filter tabs at top of billing table
- Make status editable in table (click to change)
- Add status change confirmation modal
- Color code statuses:
  - Pending: Amber/Yellow
  - Paid: Green
  - Cancelled: Red/Gray

**Code Pattern for Add SOA Modal:**
```tsx
{/* Status Selection */}
<div>
  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Status</label>
  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
  >
    <option value="pending">Pending</option>
    <option value="paid">Paid</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div>
```

**Code Pattern for Status Cell:**
```tsx
<td className="px-6 py-4">
  <button
    onClick={() => handleStatusChange(billing.id, billing.status)}
    className="group relative"
  >
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      billing.status === 'paid' ? 'bg-green-100 text-green-700' :
      billing.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
      'bg-amber-100 text-amber-700'
    }`}>
      {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
    </span>
    <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
      Click to change status
    </span>
  </button>
</td>
```

## Database Schema Changes Required

### New Table: teeth_images
```sql
CREATE TABLE teeth_images (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES api_user(id),
    uploaded_by INTEGER REFERENCES api_user(id),
    image_url VARCHAR(500),
    notes TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_latest BOOLEAN DEFAULT TRUE
);
```

### Modify billing table
```sql
ALTER TABLE billing ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
-- Values: 'pending', 'paid', 'cancelled'
```

## Backend API Endpoints Needed

### Teeth Images
```
POST   /api/teeth-images/          - Upload new teeth image
GET    /api/teeth-images/<patient_id>/  - Get all images for patient
GET    /api/teeth-images/<patient_id>/latest/  - Get latest image
GET    /api/teeth-images/<id>/download/  - Download specific image
DELETE /api/teeth-images/<id>/     - Delete image
```

### Billing Status
```
PATCH  /api/billing/<id>/status/   - Update billing status
GET    /api/billing/?status=<status>  - Filter by status
```

## Testing Checklist

- [ ] Profile appears in upper right on all dashboards (owner, staff, patient)
- [ ] Profile dropdown works on both mobile and desktop
- [ ] Staff can upload teeth images for patients
- [ ] Owner can upload teeth images for patients
- [ ] Latest image shows in patient dental records
- [ ] Previous images show in history section
- [ ] Images can be downloaded
- [ ] Billing status can be set when creating SOA
- [ ] Billing status can be edited after creation
- [ ] Status changes are saved correctly
- [ ] Billing can be filtered by status

## Implementation Order

1. **Phase 1: Layout Changes** (Easiest, no backend needed)
   - Move profile to upper right corner for all three dashboards
   - Test responsiveness

2. **Phase 2: Backend API** (Required for next phases)
   - Create teeth_images table
   - Add status column to billing table
   - Implement API endpoints

3. **Phase 3: Teeth Image Upload** (Staff/Owner)
   - Create upload component
   - Integrate with patient management pages
   - Test image upload and storage

4. **Phase 4: Patient Dental Records** (Patient View)
   - Replace tooth chart with image display
   - Implement image history
   - Add download functionality

5. **Phase 5: Billing Status** (Final)
   - Add status to SOA creation
   - Implement status editing
   - Add filtering

## Notes

- All images should be stored securely with proper access control
- Consider image size limits (e.g., 10MB max)
- Compress images on upload if needed
- Keep tooth chart component code as backup
- Add proper loading states for image uploads
- Handle errors gracefully (upload failures, etc.)
- Add confirmation dialogs for status changes
- Log all status changes for audit trail
