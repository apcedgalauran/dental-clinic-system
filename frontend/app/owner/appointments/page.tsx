"use client"

import { Plus, Eye, Search } from "lucide-react"

export default function OwnerAppointments() {
  const appointments = [
    {
      id: 1,
      patient: "John Doe",
      email: "john.doe@email.com",
      treatment: "Teeth Cleaning",
      date: "2025-01-20",
      time: "10:00 AM",
      dentist: "Dr. Sarah Johnson",
      status: "confirmed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Appointments</h1>
          <p className="text-[var(--color-text-muted)]">Manage all clinic appointments</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
          <Plus className="w-5 h-5" />
          Add Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Treatment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Dentist</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{apt.patient}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{apt.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.treatment}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.date}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.time}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.dentist}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-[var(--color-primary)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
