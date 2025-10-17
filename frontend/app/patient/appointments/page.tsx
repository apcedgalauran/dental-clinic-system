"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Plus, X, Edit, XCircle } from "lucide-react"
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
  reschedule_date: string | null
  reschedule_time: string | null
  reschedule_service: number | null
  reschedule_service_name: string | null
  reschedule_dentist: number | null
  reschedule_dentist_name: string | null
  reschedule_notes: string
  created_at: string
  updated_at: string
}

interface Staff {
  id: number
  first_name: string
  last_name: string
  user_type: string
  role: string
}

interface Service {
  id: number
  name: string
  category: string
  description: string
}

export default function PatientAppointments() {
  const { token, user } = useAuth()
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [staff, setStaff] = useState<Staff[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    dentist: "",
    service: "",
    notes: "",
  })
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    dentist: "",
    service: "",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        // Fetch appointments
        const appointmentsData = await api.getAppointments(token)
        setAllAppointments(appointmentsData)
        
        // Fetch staff (dentists)
        const staffData = await api.getStaff(token)
        setStaff(staffData)
        
        // Fetch services
        const servicesData = await api.getServices()
        setServices(servicesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !user) {
      alert("Please log in to create an appointment")
      return
    }

    try {
      const appointmentData = {
        patient: user.id,
        dentist: newAppointment.dentist || null,
        date: newAppointment.date,
        time: newAppointment.time,
        service: newAppointment.service || null,
        notes: newAppointment.notes || "",
        status: "pending", // Patients create pending appointments
      }

      console.log("Creating appointment:", appointmentData)
      const createdAppointment = await api.createAppointment(appointmentData, token)
      console.log("Appointment created:", createdAppointment)
      setAllAppointments([createdAppointment, ...allAppointments])
      setShowAddModal(false)
      setNewAppointment({
        date: "",
        time: "",
        dentist: "",
        service: "",
        notes: "",
      })
      alert("Appointment request submitted! Our staff will confirm it soon.")
    } catch (error) {
      console.error("Error creating appointment:", error)
      alert("Failed to create appointment. Please try again.")
    }
  }

  const handleRequestReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setRescheduleData({
      date: appointment.date,
      time: appointment.time,
      dentist: appointment.dentist?.toString() || "",
      service: appointment.service?.toString() || "",
      notes: appointment.notes || "",
    })
    setShowEditModal(true)
  }

  const handleSubmitReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !selectedAppointment) return

    try {
      const updateData = {
        reschedule_date: rescheduleData.date,
        reschedule_time: rescheduleData.time,
        reschedule_dentist: rescheduleData.dentist || null,
        reschedule_service: rescheduleData.service || null,
        reschedule_notes: rescheduleData.notes || "",
        status: "reschedule_requested",
      }

      const updatedAppointment = await api.updateAppointment(selectedAppointment.id, updateData, token)
      setAllAppointments(allAppointments.map(apt => 
        apt.id === selectedAppointment.id ? updatedAppointment : apt
      ))
      setShowEditModal(false)
      setSelectedAppointment(null)
      alert("Reschedule request submitted! Staff will review it soon.")
    } catch (error) {
      console.error("Error requesting reschedule:", error)
      alert("Failed to submit reschedule request. Please try again.")
    }
  }

  const handleCancelRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !selectedAppointment) return

    try {
      await api.requestCancel(selectedAppointment.id, cancelReason, token)
      
      // Update the appointment status locally
      setAllAppointments(allAppointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: "cancel_requested" as const }
          : apt
      ))
      
      setShowCancelModal(false)
      setSelectedAppointment(null)
      setCancelReason("")
      alert("Cancellation request submitted! Staff will review it soon.")
    } catch (error) {
      console.error("Error requesting cancellation:", error)
      alert("Failed to submit cancellation request. Please try again.")
    }
  }

  // Helper function to format dentist name with "Dr." prefix
  const formatDentistName = (staff: Staff) => {
    const fullName = `${staff.first_name} ${staff.last_name}`.trim()
    // Only add "Dr." if it's not already in the name
    if (fullName.toLowerCase().startsWith('dr.') || fullName.toLowerCase().startsWith('dr ')) {
      return fullName
    }
    return `Dr. ${fullName}`
  }

  // Separate appointments into upcoming and past
  const now = new Date()
  const upcomingAppointments = allAppointments.filter((apt) => {
    const aptDate = new Date(apt.date + 'T' + apt.time)
    return aptDate >= now && apt.status !== 'completed' && apt.status !== 'cancelled'
  })

  const pastAppointments = allAppointments.filter((apt) => {
    const aptDate = new Date(apt.date + 'T' + apt.time)
    return aptDate < now || apt.status === 'completed' || apt.status === 'cancelled'
  })

  const appointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "reschedule_requested":
        return "bg-orange-100 text-orange-700"
      case "cancel_requested":
        return "bg-red-100 text-red-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
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
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">My Appointments</h1>
          <p className="text-[var(--color-text-muted)]">View and manage your dental appointments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "upcoming"
              ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "past"
              ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Past
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <p className="text-[var(--color-text-muted)]">Loading appointments...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)] opacity-30" />
            <p className="text-lg font-medium text-[var(--color-text)] mb-2">
              {activeTab === "upcoming" ? "No Upcoming Appointments" : "No Past Appointments"}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {activeTab === "upcoming" 
                ? "You don't have any scheduled appointments yet" 
                : "You haven't had any appointments yet"}
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">
                      {appointment.service_name || "General Consultation"}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {formatStatus(appointment.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{appointment.dentist_name || "To be assigned"}</span>
                    </div>
                  </div>

                  {appointment.status === "reschedule_requested" && appointment.reschedule_date && (
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-semibold text-orange-800 mb-2">📅 Requested Reschedule:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-orange-600 font-medium">New Date:</span>
                          <p className="text-orange-800">{appointment.reschedule_date}</p>
                        </div>
                        <div>
                          <span className="text-orange-600 font-medium">New Time:</span>
                          <p className="text-orange-800">{appointment.reschedule_time}</p>
                        </div>
                        <div>
                          <span className="text-orange-600 font-medium">New Dentist:</span>
                          <p className="text-orange-800">{appointment.reschedule_dentist_name || "To be assigned"}</p>
                        </div>
                      </div>
                      {appointment.reschedule_service_name && (
                        <div className="mt-2">
                          <span className="text-orange-600 font-medium text-sm">New Treatment:</span>
                          <p className="text-orange-800 text-sm">{appointment.reschedule_service_name}</p>
                        </div>
                      )}
                      <p className="text-xs text-orange-700 mt-2">Waiting for staff approval...</p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                      <p className="text-sm text-[var(--color-text-muted)]">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Action buttons for confirmed appointments */}
                {appointment.status === "confirmed" && activeTab === "upcoming" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRequestReschedule(appointment)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Request Reschedule
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setShowCancelModal(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Request Cancel
                    </button>
                  </div>
                )}

                {/* Info for cancel requested appointments */}
                {appointment.status === "cancel_requested" && (
                  <div className="text-sm text-red-600 font-medium">
                    Cancellation pending approval...
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Request Appointment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your appointment request will be marked as "pending" until confirmed by our staff.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Time <span className="text-red-500">*</span>
                  </label>
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
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Preferred Dentist <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAppointment.dentist}
                  onChange={(e) => setNewAppointment({ ...newAppointment, dentist: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                >
                  <option value="">Select a dentist...</option>
                  {staff.filter((s) => s.role === 'dentist' || s.user_type === 'owner').map((s) => (
                    <option key={s.id} value={s.id}>
                      {formatDentistName(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Treatment/Service <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAppointment.service}
                  onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                >
                  <option value="">Select a treatment...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={4}
                  placeholder="Any special requests or information our staff should know..."
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Request Reschedule</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedAppointment(null)
                }}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReschedule} className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> Your reschedule request will need staff approval. Your current appointment will remain active until approved.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Current Appointment:</p>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.service_name || "General Consultation"}
                </p>
                <p className="text-sm text-gray-600">
                  with {selectedAppointment.dentist_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    New Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    New Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Preferred Dentist <span className="text-red-500">*</span>
                </label>
                <select
                  value={rescheduleData.dentist}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, dentist: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                >
                  <option value="">Select a dentist...</option>
                  {staff.filter((s) => s.role === 'dentist' || s.user_type === 'owner').map((s) => (
                    <option key={s.id} value={s.id}>
                      {formatDentistName(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Treatment/Service <span className="text-red-500">*</span>
                </label>
                <select
                  value={rescheduleData.service}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                >
                  <option value="">Select a treatment...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  value={rescheduleData.notes}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
                  rows={4}
                  placeholder="Reason for rescheduling or any special requests..."
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedAppointment(null)
                  }}
                  className="flex-1 px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Request Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-red-600">Request Cancellation</h2>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setSelectedAppointment(null)
                  setCancelReason("")
                }}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelRequest} className="p-6 space-y-4">
              {selectedAppointment && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-[var(--color-text-muted)] mb-2">Appointment to cancel:</p>
                  <p className="font-semibold text-[var(--color-text)]">
                    {selectedAppointment.service_name || "General Consultation"}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {selectedAppointment.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedAppointment.time}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a reason for cancelling this appointment..."
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Your cancellation request will be reviewed by our staff. 
                  The appointment will remain active until it's approved.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedAppointment(null)
                    setCancelReason("")
                  }}
                  className="flex-1 px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Submit Cancellation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
