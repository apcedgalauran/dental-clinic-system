import { Download, CreditCard, CheckCircle, Clock } from "lucide-react"

export default function PatientBilling() {
  const billings = [
    {
      id: 1,
      date: "2024-12-10",
      description: "Root Canal Treatment",
      amount: 15000,
      paid: false,
      hasFile: true,
    },
    {
      id: 2,
      date: "2024-11-05",
      description: "Teeth Whitening",
      amount: 8000,
      paid: true,
      hasFile: true,
    },
    {
      id: 3,
      date: "2024-09-20",
      description: "Dental Cleaning",
      amount: 2500,
      paid: true,
      hasFile: true,
    },
  ]

  const totalPending = billings.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0)
  const totalPaid = billings.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Billing & Payments</h1>
        <p className="text-[var(--color-text-muted)]">View your statement of accounts and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Pending Balance</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">PHP {totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Total Paid</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">PHP {totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing List */}
      <div className="bg-white rounded-xl border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">Statement of Accounts</h2>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {billings.map((billing) => (
            <div key={billing.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">{billing.description}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{billing.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-[var(--color-text)]">PHP {billing.amount.toLocaleString()}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        billing.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {billing.paid ? "Paid" : "Pending"}
                    </span>
                  </div>

                  {billing.hasFile && (
                    <button className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-[var(--color-primary)]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
