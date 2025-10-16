"use client"

import { Calendar, FileText, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function PatientDashboard() {
  const { user } = useAuth()
  
  // No sample data - will be filled with real data
  const upcomingAppointments: Array<{
    id: number
    date: string
    time: string
    service: string
    dentist: string
  }> = []

  const treatmentPlans: Array<{
    id: number
    title: string
    status: string
    progress: number
  }> = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">
          Welcome Back, {user?.first_name || "Patient"}
        </h1>
        <p className="text-[var(--color-text-muted)]">Here's an overview of your dental health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">0</p>
          <p className="text-sm text-[var(--color-text-muted)]">Upcoming Appointments</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">0</p>
          <p className="text-sm text-[var(--color-text-muted)]">Total Records</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">0</p>
          <p className="text-sm text-[var(--color-text-muted)]">Active Treatment Plans</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">PHP 0</p>
          <p className="text-sm text-[var(--color-text-muted)]">Pending Balance</p>
        </div>
      </div>

      {/* Treatment Plans */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Treatment Plans</h2>
        {treatmentPlans.length > 0 ? (
          <div className="space-y-4">
            {treatmentPlans.map((plan) => (
              <div key={plan.id} className="border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[var(--color-text)]">{plan.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.status === "ongoing" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: `${plan.progress}%` }} />
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">{plan.progress}% Complete</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-[var(--color-text-muted)]">No active treatment plans</p>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">{appointment.service}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{appointment.dentist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[var(--color-text)]">{appointment.date}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-[var(--color-text-muted)]">No upcoming appointments</p>
        )}
      </div>

      {/* Tooth Analysis */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Tooth Analysis</h2>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-[var(--color-background)] border-2 border-[var(--color-primary)] rounded-lg flex items-center justify-center text-sm font-medium text-[var(--color-text)]"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-4">Click on Profile to view full tooth chart details</p>
      </div>
    </div>
  )
}
