"use client"

import { useState } from "react"
import { Search, Plus, Eye } from "lucide-react"

export default function OwnerPatients() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive" | "new">("all")

  const patients = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+63 912 345 6789",
      lastVisit: "2025-01-10",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+63 923 456 7890",
      lastVisit: "2025-01-08",
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Patients</h1>
          <p className="text-[var(--color-text-muted)]">Manage patient records and information</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 border-b border-[var(--color-border)]">
          {[
            { id: "all", label: "All Patients" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
            { id: "new", label: "New This Month" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Last Visit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--color-text)]">{patient.name}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{patient.email}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{patient.phone}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {patient.status}
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
