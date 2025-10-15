"use client"

import { Plus } from "lucide-react"

export default function OwnerBilling() {
  const billings = [
    { id: 1, patient: "John Doe", description: "Root Canal Treatment", amount: 15000, date: "2025-01-15", paid: false },
    { id: 2, patient: "Jane Smith", description: "Teeth Whitening", amount: 8000, date: "2025-01-10", paid: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Billing</h1>
          <p className="text-[var(--color-text-muted)]">Manage patient billing and statements</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
          <Plus className="w-5 h-5" />
          Add SOA
        </button>
      </div>

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
    </div>
  )
}
