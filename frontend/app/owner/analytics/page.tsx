"use client"

import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react"

export default function OwnerAnalytics() {
  const monthlyData = [
    { month: "Jan", revenue: 120000, expenses: 45000 },
    { month: "Feb", revenue: 135000, expenses: 48000 },
    { month: "Mar", revenue: 125000, expenses: 42000 },
    { month: "Apr", revenue: 145000, expenses: 50000 },
    { month: "May", revenue: 155000, expenses: 52000 },
    { month: "Jun", revenue: 165000, expenses: 55000 },
  ]

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0)
  const profit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Analytics</h1>
        <p className="text-[var(--color-text-muted)]">Financial overview and business insights</p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">PHP {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">+8%</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">PHP {totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[var(--color-accent-dark)]" />
            </div>
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">PHP {profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Revenue vs Expenses</h2>
        <div className="space-y-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--color-text)]">{data.month}</span>
                <div className="flex gap-4">
                  <span className="text-green-600">PHP {data.revenue.toLocaleString()}</span>
                  <span className="text-red-600">PHP {data.expenses.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${(data.revenue / 200000) * 100}%` }}
                  />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${(data.expenses / 200000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-[var(--color-text-muted)]">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-[var(--color-text-muted)]">Expenses</span>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Expense Breakdown</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg">
            <div>
              <p className="font-medium text-[var(--color-text)]">Inventory Restocking</p>
              <p className="text-sm text-[var(--color-text-muted)]">Medical supplies and equipment</p>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">PHP 180,000</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg">
            <div>
              <p className="font-medium text-[var(--color-text)]">Staff Salaries</p>
              <p className="text-sm text-[var(--color-text-muted)]">Monthly payroll</p>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">PHP 95,000</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg">
            <div>
              <p className="font-medium text-[var(--color-text)]">Utilities & Rent</p>
              <p className="text-sm text-[var(--color-text-muted)]">Operational costs</p>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">PHP 17,000</p>
          </div>
        </div>
      </div>
    </div>
  )
}
