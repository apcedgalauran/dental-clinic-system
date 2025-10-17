"use client"

import { useState, Fragment, useEffect } from "react"
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
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"

interface Appointment {
  id: number
  patient: number
  patient_name: string
  patient_email: string
  dentist: number | null
  dentist_name: string | null
  service: number | null
  service_name: string | null
  date: string
  time: string
  status: "confirmed" | "pending" | "cancelled" | "completed" | "reschedule_requested" | "cancel_requested"
  notes: string
  created_at: string
  updated_at: string
  reschedule_date: string | null
  reschedule_time: string | null
  reschedule_service: number | null
  reschedule_service_name: string | null
  reschedule_dentist: number | null
  reschedule_dentist_name: string | null
  reschedule_notes: string
  cancel_reason: string
}

interface Patient {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

interface Service {
  id: number
  name: string
  category: string
  description: string
}

interface Staff {
  id: number
  first_name: string
  last_name: string
  user_type: string
}

export default function OwnerAppointments() {
  const { token } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<Partial<Appointment>>({})
  const [patients, setPatients] = useState<Patient[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    date: "",
    time: "",
    dentist: "",
    service: "",
    notes: "",
  })

  // Fetch patients, services, and staff for the appointment dropdown
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      
      try {
        const [patientsData, servicesData, staffData] = await Promise.all([
          api.getPatients(token),
          api.getServices(),
          api.getStaff(token)
        ])
        setPatients(patientsData)
        setServices(servicesData)
        setStaff(staffData.filter((s: Staff) => s.user_type === 'dentist' || s.user_type === 'owner'))
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [token])

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return
      
      try {
        setIsLoading(true)
        const response = await api.getAppointments(token)
        console.log("Fetched appointments:", response)
        setAppointments(response)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [token])

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !selectedPatientId) {
      alert("Please select a patient")
      return
    }

    try {
      const appointmentData = {
        patient: selectedPatientId,
        date: newAppointment.date,
        time: newAppointment.time,
        dentist: newAppointment.dentist ? parseInt(newAppointment.dentist) : null,
        service: newAppointment.service ? parseInt(newAppointment.service) : null,
        notes: newAppointment.notes,
        status: "confirmed", // Owner/Staff create confirmed appointments
      }

      const createdAppointment = await api.createAppointment(appointmentData, token)
      setAppointments([createdAppointment, ...appointments])
      setShowAddModal(false)
      setSelectedPatientId(null)
      setNewAppointment({
        patient: "",
        date: "",
        time: "",
        dentist: "",
        service: "",
        notes: "",
      })
      alert("Appointment created successfully!")
    } catch (error) {
      console.error("Error creating appointment:", error)
      alert("Failed to create appointment. Please try again.")
    }
  }

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
      case "reschedule_requested":
        return "bg-orange-100 text-orange-700"
      case "cancel_requested":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "reschedule_requested":
        return "Reschedule Requested"
      case "cancel_requested":
        return "Cancellation Requested"
      case "confirmed":
        return "Confirmed"
      case "pending":
        return "Pending"
      case "cancelled":
        return "Cancelled"
      case "completed":
        return "Completed"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const handleApproveReschedule = async (appointment: Appointment) => {
    try {
      const updatedAppointment = await api.approveReschedule(appointment.id, token!)
      setAppointments(appointments.map(apt => apt.id === appointment.id ? updatedAppointment : apt))
      alert("Reschedule request approved successfully!")
    } catch (error) {
      console.error("Error approving reschedule:", error)
      alert("Failed to approve reschedule request.")
    }
  }

  const handleRejectReschedule = async (appointment: Appointment) => {
    if (!confirm("Are you sure you want to reject this reschedule request?")) {
      return
    }
    try {
      const updatedAppointment = await api.rejectReschedule(appointment.id, token!)
      setAppointments(appointments.map(apt => apt.id === appointment.id ? updatedAppointment : apt))
      alert("Reschedule request rejected.")
    } catch (error) {
      console.error("Error rejecting reschedule:", error)
      alert("Failed to reject reschedule request.")
    }
  }

  const handleApproveCancel = async (appointment: Appointment) => {
    if (!confirm("Are you sure you want to approve this cancellation? This will permanently delete the appointment.")) {
      return
    }
    try {
      await api.approveCancel(appointment.id, token!)
      setAppointments(appointments.filter(apt => apt.id !== appointment.id))
      alert("Cancellation approved. Appointment has been deleted.")
    } catch (error) {
      console.error("Error approving cancellation:", error)
      alert("Failed to approve cancellation.")
    }
  }

  const handleRejectCancel = async (appointment: Appointment) => {
    if (!confirm("Are you sure you want to reject this cancellation request?")) {
      return
    }
    try {
      const updatedAppointment = await api.rejectCancel(appointment.id, token!)
      setAppointments(appointments.map(apt => apt.id === appointment.id ? updatedAppointment : apt))
      alert("Cancellation request rejected. Appointment remains confirmed.")
    } catch (error) {
      console.error("Error rejecting cancellation:", error)
      alert("Failed to reject cancellation.")
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

  const handleSave = async (appointmentId: number) => {
    if (!token) return

    try {
      // Only send the editable fields to the API
      const updateData = {
        status: editedData.status,
        notes: editedData.notes,
        date: editedData.date,
        time: editedData.time,
      }

      await api.updateAppointment(appointmentId, updateData, token)
      
      // Update local state
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, ...editedData } as Appointment : apt
        )
      )
      setEditingRow(null)
      setEditedData({})
      alert("Appointment updated successfully!")
    } catch (error) {
      console.error("Error updating appointment:", error)
      alert("Failed to update appointment. Please try again.")
    }
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditedData({})
  }

  const handleDelete = async (appointmentId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this appointment?")) return

    if (!token) return

    try {
      await api.deleteAppointment(appointmentId, token)
      setAppointments(appointments.filter((apt) => apt.id !== appointmentId))
      setExpandedRow(null)
      alert("Appointment deleted successfully!")
    } catch (error) {
      console.error("Error deleting appointment:", error)
      alert("Failed to delete appointment. Please try again.")
    }
  }

  const handleStatusChange = (appointmentId: number, newStatus: Appointment["status"]) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    )
  }

  const filteredAppointments = appointments.filter((apt) =>
    apt.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.dentist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.status?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            placeholder="Search by patient, treatment, or dentist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredAppointments.map((apt) => (
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
                          <p className="font-medium text-[var(--color-text)]">{apt.patient_name || "Unknown"}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">{apt.patient_email || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.service_name || "General Consultation"}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.date}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.time}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{apt.dentist_name || "Not Assigned"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {formatStatus(apt.status)}
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
                                  <label className="block text-sm font-medium mb-1.5">Patient Name (Read-only)</label>
                                  <input
                                    type="text"
                                    value={apt.patient_name || ""}
                                    readOnly
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Status *</label>
                                  <select
                                    value={editedData.status || apt.status}
                                    onChange={(e) => setEditedData({ ...editedData, status: e.target.value as Appointment["status"] })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Date *</label>
                                  <input
                                    type="date"
                                    value={editedData.date || apt.date}
                                    onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1.5">Time *</label>
                                  <input
                                    type="time"
                                    value={editedData.time || apt.time}
                                    onChange={(e) => setEditedData({ ...editedData, time: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium mb-1.5">Notes</label>
                                  <textarea
                                    value={editedData.notes !== undefined ? editedData.notes : apt.notes}
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

                              {/* Reschedule Request Section */}
                              {apt.status === "reschedule_requested" && (
                                <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                                      <Clock className="w-5 h-5" />
                                      Reschedule Request Pending
                                    </h3>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleApproveReschedule(apt)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                      >
                                        Approve Reschedule
                                      </button>
                                      <button
                                        onClick={() => handleRejectReschedule(apt)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                      >
                                        Reject Reschedule
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Current Appointment Details */}
                                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Current Appointment
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="text-gray-500">Date:</span>
                                          <span className="ml-2 font-medium">{apt.date}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Time:</span>
                                          <span className="ml-2 font-medium">{apt.time}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Service:</span>
                                          <span className="ml-2 font-medium">{apt.service_name || "N/A"}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Dentist:</span>
                                          <span className="ml-2 font-medium">{apt.dentist_name || "N/A"}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Requested New Appointment Details */}
                                    <div className="bg-orange-100 rounded-lg p-4 border border-orange-300">
                                      <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Requested Changes
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="text-orange-700">New Date:</span>
                                          <span className="ml-2 font-medium text-orange-900">{apt.reschedule_date || apt.date}</span>
                                        </div>
                                        <div>
                                          <span className="text-orange-700">New Time:</span>
                                          <span className="ml-2 font-medium text-orange-900">{apt.reschedule_time || apt.time}</span>
                                        </div>
                                        <div>
                                          <span className="text-orange-700">New Service:</span>
                                          <span className="ml-2 font-medium text-orange-900">{apt.reschedule_service_name || apt.service_name || "N/A"}</span>
                                        </div>
                                        <div>
                                          <span className="text-orange-700">New Dentist:</span>
                                          <span className="ml-2 font-medium text-orange-900">{apt.reschedule_dentist_name || apt.dentist_name || "N/A"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {apt.reschedule_notes && (
                                    <div className="mt-4 bg-white rounded-lg p-4 border border-orange-200">
                                      <p className="text-sm text-gray-500 mb-1">Patient's Note:</p>
                                      <p className="text-sm text-gray-800">{apt.reschedule_notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Cancel Request Section */}
                              {apt.status === "cancel_requested" && (
                                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                                      <X className="w-5 h-5" />
                                      Cancellation Request Pending
                                    </h3>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleApproveCancel(apt)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                      >
                                        Approve & Delete
                                      </button>
                                      <button
                                        onClick={() => handleRejectCancel(apt)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                      >
                                        Reject Cancellation
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white rounded-lg p-4 border border-red-200">
                                    <h4 className="font-semibold text-gray-700 mb-3">Cancellation Reason</h4>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{apt.cancel_reason || "No reason provided"}</p>
                                  </div>

                                  <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                                    <p className="text-sm text-amber-800">
                                      <strong>Warning:</strong> Approving this cancellation will permanently delete the appointment from all users' views.
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Appointment Details Card */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
                                  <h4 className="font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Appointment Details
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Patient</p>
                                      <p className="font-medium text-lg">{apt.patient_name}</p>
                                      <p className="text-xs text-[var(--color-text-muted)]">{apt.patient_email}</p>
                                    </div>
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Service</p>
                                      <p className="font-medium">{apt.service_name || "General Consultation"}</p>
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
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Assigned Dentist</p>
                                      <p className="font-medium">{apt.dentist_name || "Not Assigned"}</p>
                                    </div>
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-0.5">Status</p>
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                        {formatStatus(apt.status)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Information Card */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
                                  <h4 className="font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes & Information
                                  </h4>
                                  <div className="space-y-4 text-sm">
                                    <div>
                                      <p className="text-[var(--color-text-muted)] mb-2 font-medium">Notes</p>
                                      <p className="text-sm leading-relaxed">{apt.notes || "No notes added"}</p>
                                    </div>
                                    <div className="pt-3 border-t border-[var(--color-border)]">
                                      <p className="text-[var(--color-text-muted)] text-xs mb-1">Created</p>
                                      <p className="text-sm">{new Date(apt.created_at).toLocaleString()}</p>
                                    </div>
                                    {apt.updated_at !== apt.created_at && (
                                      <div>
                                        <p className="text-[var(--color-text-muted)] text-xs mb-1">Last Updated</p>
                                        <p className="text-sm">{new Date(apt.updated_at).toLocaleString()}</p>
                                      </div>
                                    )}
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

            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Patient *</label>
                <select
                  value={selectedPatientId || ""}
                  onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                >
                  <option value="">Select a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.email}
                    </option>
                  ))}
                </select>
                {patients.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">No patients registered yet. Please add patients first.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Time *</label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Service (Optional)</label>
                <select
                  value={newAppointment.service}
                  onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select a service...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Dentist (Optional)</label>
                <select
                  value={newAppointment.dentist}
                  onChange={(e) => setNewAppointment({ ...newAppointment, dentist: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select a dentist...</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name.startsWith('Dr.') ? '' : 'Dr. '}{s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Notes (Optional)</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any special instructions or notes..."
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
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
