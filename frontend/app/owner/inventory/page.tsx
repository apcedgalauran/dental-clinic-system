"use client"

import { Plus, AlertTriangle } from "lucide-react"

export default function OwnerInventory() {
  const inventory = [
    {
      id: 1,
      name: "Dental Gloves",
      category: "Supplies",
      quantity: 500,
      minStock: 100,
      supplier: "MedSupply Co.",
      cost: 1500,
      lastUpdated: "2025-01-15",
    },
    {
      id: 2,
      name: "Anesthetic",
      category: "Medicine",
      quantity: 45,
      minStock: 50,
      supplier: "PharmaCare",
      cost: 8000,
      lastUpdated: "2025-01-10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Inventory</h1>
          <p className="text-[var(--color-text-muted)]">Manage clinic supplies and equipment</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-900">Low Stock Alert</p>
          <p className="text-sm text-amber-700">1 item is below minimum stock level</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Min Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Cost (PHP)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--color-text)]">{item.name}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{item.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        item.quantity <= item.minStock ? "text-red-600 font-medium" : "text-[var(--color-text-muted)]"
                      }
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{item.minStock}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{item.supplier}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{item.cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
