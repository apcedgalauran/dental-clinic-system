"use client"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"

export default function StaffBilling() {
  const [showAddModal, setShowAddModal] = useState(false)

  const billings = [
    { id: 1, patient: "John Doe", description: "Root Canal Treatment", amount: 15000, date: "2025-01-15", paid: false },
    { id: 2, patient: "Jane Smith", description: "Teeth Whitening", amount: 8000, date: "2025-01-10", paid: true },
    { id: 3, patient: "Mike Johnson", description: "Dental Cleaning", amount: 2500, date: "2025-01-08", paid: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Billing</h1>
          <p className="text-[var(--color-text-muted)]">Manage patient billing and statements of account</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add SOA
        </button>
      </div>

      {/* Billing Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Amount (PHP)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {billings.map((billing) => (
                <tr key={billing.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--color-text)]">{billing.patient}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{billing.description}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{billing.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{billing.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${billing.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {billing.paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SOA Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Add Statement of Account</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
              >
                ×
              </button>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Patient</label>
                <input
                  type="text"
                  placeholder="Search and select patient..."
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Amount (PHP)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Upload SOA File (Image or PDF)
                </label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-text-muted)]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">PDF or Image files</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
                >
                  Add SOA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
