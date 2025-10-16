"use client"

import { useState, Fragment } from "react"
import { 
  Plus, 
  Eye, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Edit2, 
  Save, 
  X, 
  Trash2,
  Calendar,
  Clock,
  User,
  FileText,
  Phone,
  Mail,
  MapPin
} from "lucide-react"

interface Appointment {
  id: number
  patient: string
  email: string
  phone: string
  treatment: string
  date: string
  time: string
  dentist: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  duration: string
  cost: number
  notes: string
  patientAddress: string
  patientAge: number
  previousVisits: number
}

export default function StaffAppointments() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<Partial<Appointment>>({})

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patient: "John Doe",
      email: "john.doe@email.com",
      phone: "+63 912 345 6789",
      treatment: "Teeth Cleaning",
      date: "2025-01-20",
      time: "10:00 AM",
      dentist: "Dr. Sarah Johnson",
      status: "confirmed",
      duration: "45 minutes",
      cost: 2500,
      notes: "Patient requests gentle cleaning. Sensitive to cold.",
      patientAddress: "123 Main St, Manila",
      patientAge: 34,
      previousVisits: 12,
    },
    {
      id: 2,
      patient: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+63 923 456 7890",
      treatment: "Root Canal",
      date: "2025-01-22",
      time: "2:00 PM",
      dentist: "Dr. Sarah Johnson",
      status: "pending",
      duration: "90 minutes",
      cost: 8500,
      notes: "Follow-up from previous consultation. Tooth #14.",
      patientAddress: "456 Oak Ave, Quezon City",
      patientAge: 39,
      previousVisits: 8,
    },
    {
      id: 3,
      patient: "Mike Johnson",
      email: "mike.j@email.com",
      phone: "+63 934 567 8901",
      treatment: "Dental Check-up",
      date: "2025-01-25",
      time: "11:00 AM",
      dentist: "Dr. Sarah Johnson",
      status: "confirmed",
      duration: "30 minutes",
      cost: 1500,
      notes: "Regular 6-month check-up.",
      patientAddress: "789 Pine Rd, Makati",
      patientAge: 46,
      previousVisits: 15,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleRowClick = (appointmentId: number) => {
    if (editingRow === appointmentId) return
    setExpandedRow(expandedRow === appointmentId ? null : appointmentId)
  }

  const handleEdit = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingRow(appointment.id)
    setEditedData({ ...appointment })
    setExpandedRow(appointment.id)
  }

  const handleSave = (appointmentId: number) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, ...editedData } as Appointment : apt
      )
    )
    setEditingRow(null)
    setEditedData({})
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditedData({})
  }

  const handleDelete = (appointmentId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter((apt) => apt.id !== appointmentId))
      setExpandedRow(null)
    }
  }

  const handleStatusChange = (appointmentId: number, newStatus: Appointment["status"]) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Appointments</h1>
          <p className="text-[var(--color-text-muted)]">Manage patient appointments and schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Appointment
        </button>
      </div>

      {/* Search */}
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

      {/* Appointments Table */}
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
                <Fragment key={apt.id}>
                  {/* Main Row - Clickable */}
                  <tr
                    onClick={() => handleRowClick(apt.id)}
                    className="hover:bg-[var(--color-background)] transition-all duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {expandedRow === apt.id ? (
                          <ChevronUp className="w-4 h-4 text-[var(--color-primary)]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                        )}
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{apt.patient}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">{apt.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.treatment}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.date}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.time}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.dentist}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(apt.id)
                          }}
                          className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[var(--color-primary)]" />
                        </button>
                        <button
                          onClick={(e) => handleEdit(apt, e)}
                          className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(apt.id, e)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === apt.id && (
                    <tr>
                      <td colSpan={7} className="bg-gradient-to-br from-gray-50 to-teal-50">
                        <div className="px-6 py-6 animate-in slide-in-from-top-2 duration-300">
                          {editingRow === apt.id ? (
                            // Edit Mode
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-[var(--color-primary)]">
                                  Edit Appointment
                                </h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSave(apt.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                                  >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Patient Name</label>
                                  <input
                                    type="text"
                                    value={editedData.patient || ""}
                                    onChange={(e) => setEditedData({ ...editedData, patient: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Email</label>
                                  <input
                                    type="email"
                                    value={editedData.email || ""}
                                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                                  <input
                                    type="tel"
                                    value={editedData.phone || ""}
                                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Treatment</label>
                                  <select
                                    value={editedData.treatment || ""}
                                    onChange={(e) => setEditedData({ ...editedData, treatment: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  >
                                    <option value="Teeth Cleaning">Teeth Cleaning</option>
                                    <option value="Root Canal">Root Canal</option>
                                    <option value="Dental Check-up">Dental Check-up</option>
                                    <option value="Tooth Extraction">Tooth Extraction</option>
                                    <option value="Teeth Whitening">Teeth Whitening</option>
                                    <option value="Dental Filling">Dental Filling</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Date</label>
                                  <input
                                    type="date"
                                    value={editedData.date || ""}
                                    onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Time</label>
                                  <input
                                    type="text"
                                    value={editedData.time || ""}
                                    onChange={(e) => setEditedData({ ...editedData, time: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Dentist</label>
                                  <select
                                    value={editedData.dentist || ""}
                                    onChange={(e) => setEditedData({ ...editedData, dentist: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  >
                                    <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                                    <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                                    <option value="Dr. Emily Davis">Dr. Emily Davis</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Status</label>
                                  <select
                                    value={editedData.status || ""}
                                    onChange={(e) => setEditedData({ ...editedData, status: e.target.value as Appointment["status"] })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Duration</label>
                                  <input
                                    type="text"
                                    value={editedData.duration || ""}
                                    onChange={(e) => setEditedData({ ...editedData, duration: e.target.value })}
                                    placeholder="e.g., 45 minutes"
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Cost (₱)</label>
                                  <input
                                    type="number"
                                    value={editedData.cost || ""}
                                    onChange={(e) => setEditedData({ ...editedData, cost: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium mb-1.5">Notes</label>
                                  <textarea
                                    value={editedData.notes || ""}
                                    onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-[var(--color-primary)]">
                                  Appointment Details
                                </h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleStatusChange(apt.id, "completed")}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                  >
                                    Mark as Completed
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(apt.id, "cancelled")}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                  >
                                    Cancel Appointment
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Patient Information Card */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
                                  <h4 className="font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Patient Information
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Full Name</p>
                                      <p className="font-medium">{apt.patient}</p>
                                    </div>
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Age</p>
                                      <p className="font-medium">{apt.patientAge} years</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Mail className="w-4 h-4 text-[var(--color-text-muted)] mt-0.5" />
                                      <div>
                                        <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Email</p>
                                        <p className="font-medium break-all">{apt.email}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Phone className="w-4 h-4 text-[var(--color-text-muted)] mt-0.5" />
                                      <div>
                                        <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Phone</p>
                                        <p className="font-medium">{apt.phone}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-[var(--color-text-muted)] mt-0.5" />
                                      <div>
                                        <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Address</p>
                                        <p className="font-medium">{apt.patientAddress}</p>
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-[var(--color-border)]">
                                      <p className="text-[var(--color-text-muted)] mb-1">Previous Visits</p>
                                      <p className="font-semibold text-[var(--color-primary)]">{apt.previousVisits} visits</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Appointment Details Card */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
                                  <h4 className="font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Appointment Details
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Treatment</p>
                                      <p className="font-medium text-lg">{apt.treatment}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                                      <div>
                                        <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Date</p>
                                        <p className="font-medium">{apt.date}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                                      <div>
                                        <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Time</p>
                                        <p className="font-medium">{apt.time}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Duration</p>
                                      <p className="font-medium">{apt.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Assigned Dentist</p>
                                      <p className="font-medium">{apt.dentist}</p>
                                    </div>
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Status</p>
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Information Card */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
                                  <h4 className="font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Additional Information
                                  </h4>
                                  <div className="space-y-4 text-sm">
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-2 font-medium">Cost</p>
                                      <p className="text-2xl font-bold text-[var(--color-primary)]">₱{apt.cost.toLocaleString()}</p>
                                    </div>
                                    <div className="pt-3 border-t border-[var(--color-border)]">
                                      <p className="text-[var(--color-text-muted)] mb-2 font-medium">Notes</p>
                                      <p className="text-sm leading-relaxed">{apt.notes}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Add Appointment</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Treatment</label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option>Teeth Cleaning</option>
                  <option>Root Canal</option>
                  <option>Dental Check-up</option>
                  <option>Tooth Extraction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Dentist</label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option>Dr. Sarah Johnson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
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
                  Add Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
