"use client"

import { useState, useEffect } from "react"
import { Edit2, Download } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function PatientProfile() {
  const { user, token } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    age: 0,
    address: "",
  })

  // Load real user data from auth context
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: (user as any).phone || "",
        birthday: (user as any).birthday || "",
        age: (user as any).age || 0,
        address: (user as any).address || "",
      })
    }
  }, [user])

  const documents: any[] = [
    // No sample documents - will be populated from real data
  ]

  const handleSave = async () => {
    // TODO: Implement API call to update profile
    setIsEditing(false)
    alert("Profile updated! (Save functionality to be implemented)")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)]">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birthday</label>
            <input
              type="date"
              value={profile.birthday}
              onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Age</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number.parseInt(e.target.value) })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Address</label>
            <textarea
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-50"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Full Tooth Chart */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Full Tooth Chart</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Upper Jaw</h3>
            <div className="grid grid-cols-8 gap-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square bg-[var(--color-background)] border-2 border-[var(--color-primary)] rounded-lg flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">Healthy</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Lower Jaw</h3>
            <div className="grid grid-cols-8 gap-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square bg-[var(--color-background)] border-2 border-[var(--color-primary)] rounded-lg flex items-center justify-center text-sm font-medium">
                    {i + 17}
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">Healthy</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Downloadable Documents */}
      {documents.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Downloadable Documents</h2>
          <div className="space-y-3">
            {documents.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors"
              >
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">{doc.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {doc.type} • {doc.date}
                  </p>
                </div>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-[var(--color-primary)]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
