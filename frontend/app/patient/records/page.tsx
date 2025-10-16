"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, User, Camera, Download } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"

interface TeethImage {
  id: number
  image: string
  image_url: string
  uploaded_at: string
  uploaded_by: number
  uploaded_by_name?: string
  notes: string
  is_latest: boolean
}

export default function PatientRecords() {
  const { user, token } = useAuth()
  const [latestImage, setLatestImage] = useState<TeethImage | null>(null)
  const [previousImages, setPreviousImages] = useState<TeethImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeethImages = async () => {
      if (!user?.id || !token) return

      try {
        setIsLoading(true)
        
        // Fetch latest image
        const latest = await api.getLatestTeethImage(user.id, token)
        setLatestImage(latest)

        // Fetch all patient images
        const allImages = await api.getPatientTeethImages(user.id, token)
        // Filter out the latest image from the list
        setPreviousImages(allImages.filter((img: TeethImage) => !img.is_latest))
      } catch (error) {
        console.error("Error fetching teeth images:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeethImages()
  }, [user?.id, token])

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const records = [
    {
      id: 1,
      date: "2024-12-10",
      treatment: "Root Canal Treatment",
      diagnosis: "Infected tooth #14",
      dentist: "Dr. Sarah Johnson",
      notes: "Successfully completed root canal procedure. Patient tolerated well.",
    },
    {
      id: 2,
      date: "2024-11-05",
      treatment: "Teeth Whitening",
      diagnosis: "Tooth discoloration",
      dentist: "Dr. Sarah Johnson",
      notes: "Professional whitening treatment completed. Advised to avoid staining foods.",
    },
    {
      id: 3,
      date: "2024-09-20",
      treatment: "Dental Cleaning",
      diagnosis: "Plaque buildup",
      dentist: "Dr. Sarah Johnson",
      notes: "Routine cleaning performed. Good oral hygiene maintained.",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Dental Records</h1>
        <p className="text-[var(--color-text-muted)]">Your complete dental treatment history</p>
      </div>

      {/* Latest Teeth Image */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Current Teeth Image</h2>
          {latestImage && (
            <button 
              onClick={() => handleDownloadImage(latestImage.image_url, `teeth-${latestImage.uploaded_at}.jpg`)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Loading teeth images...</p>
          </div>
        ) : latestImage ? (
          <div>
            <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-100">
              <img 
                src={latestImage.image_url} 
                alt="Current teeth condition" 
                className="w-full h-auto object-contain"
                onError={(e) => {
                  // Fallback for missing image
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23999'%3ENo image available%3C/text%3E%3C/svg%3E"
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)] mb-2">
              <span>Uploaded: {new Date(latestImage.uploaded_at).toLocaleDateString()}</span>
              <span>ID: {latestImage.uploaded_by}</span>
            </div>
            {latestImage.notes && (
              <div className="mt-4 p-4 bg-[var(--color-background)] rounded-lg">
                <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Notes</h4>
                <p className="text-sm text-[var(--color-text-muted)]">{latestImage.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <Camera className="w-20 h-20 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No teeth images uploaded yet</p>
            <p className="text-sm mt-2">Your dentist will upload images during your visits</p>
          </div>
        )}
      </div>

      {/* Previous Images */}
      {previousImages.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-4">Previous Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previousImages.map((image) => (
              <div key={image.id} className="border border-[var(--color-border)] rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="relative rounded overflow-hidden mb-2 bg-gray-100">
                  <img 
                    src={image.image_url} 
                    alt={`Teeth from ${new Date(image.uploaded_at).toLocaleDateString()}`} 
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='128'%3E%3Crect width='200' height='128' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23999'%3ENo image%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">
                  {new Date(image.uploaded_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">ID: {image.uploaded_by}</p>
                {image.notes && (
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-2">{image.notes}</p>
                )}
                <button 
                  onClick={() => handleDownloadImage(image.image_url, `teeth-${image.uploaded_at}.jpg`)}
                  className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-4">Treatment History</h2>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{record.treatment}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{record.diagnosis}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{record.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <User className="w-4 h-4" />
                <span className="text-sm">{record.dentist}</span>
              </div>
            </div>

            <div className="bg-[var(--color-background)] rounded-lg p-4">
              <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Treatment Notes</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
