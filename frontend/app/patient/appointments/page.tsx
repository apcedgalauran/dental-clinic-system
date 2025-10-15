"use client"

import { useState } from "react"
import { Calendar, Clock, User } from "lucide-react"

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  const upcomingAppointments = [
    {
      id: 1,
      date: "2025-01-20",
      time: "10:00 AM",
      service: "Teeth Cleaning",
      dentist: "Dr. Sarah Johnson",
      status: "confirmed",
    },
    {
      id: 2,
      date: "2025-02-15",
      time: "2:00 PM",
      service: "Dental Check-up",
      dentist: "Dr. Sarah Johnson",
      status: "pending",
    },
  ]

  const pastAppointments = [
    {
      id: 3,
      date: "2024-12-10",
      time: "3:00 PM",
      service: "Root Canal",
      dentist: "Dr. Sarah Johnson",
      status: "completed",
    },
    {
      id: 4,
      date: "2024-11-05",
      time: "11:00 AM",
      service: "Teeth Whitening",
      dentist: "Dr. Sarah Johnson",
      status: "completed",
    },
  ]

  const appointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">My Appointments</h1>
        <p className="text-[var(--color-text-muted)]">View and manage your dental appointments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "upcoming"
              ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "past"
              ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Past
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">{appointment.service}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{appointment.dentist}</span>
                  </div>
                </div>
              </div>

              {activeTab === "upcoming" && (
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors text-sm font-medium">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
