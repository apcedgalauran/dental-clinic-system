import { Calendar, Users, TrendingUp, DollarSign } from "lucide-react"

export default function OwnerDashboard() {
  const appointments = [
    { id: 1, time: "09:00 AM", patient: "John Doe", treatment: "Teeth Cleaning", status: "confirmed" },
    { id: 2, time: "10:30 AM", patient: "Jane Smith", treatment: "Root Canal", status: "confirmed" },
    { id: 3, time: "02:00 PM", patient: "Mike Johnson", treatment: "Dental Check-up", status: "pending" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Dashboard Overview</h1>
        <p className="text-[var(--color-text-muted)]">Welcome back, Owner</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">PHP 125,000</p>
          <p className="text-sm text-[var(--color-text-muted)]">Monthly Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">12</p>
          <p className="text-sm text-[var(--color-text-muted)]">Appointments Today</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">248</p>
          <p className="text-sm text-[var(--color-text-muted)]">Total Patients</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] mb-1">+18%</p>
          <p className="text-sm text-[var(--color-text-muted)]">Growth This Month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Today's Appointments</h2>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-[var(--color-text)]">{apt.time}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{apt.patient}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{apt.treatment}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--color-background)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Active Staff</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">5</p>
            </div>
            <div className="p-4 bg-[var(--color-background)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Stock Alerts</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">3</p>
            </div>
            <div className="p-4 bg-[var(--color-background)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">PHP 45,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
