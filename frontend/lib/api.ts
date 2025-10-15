const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    user_type: "patient" | "staff" | "owner"
    first_name: string
    last_name: string
  }
}

export const api = {
  // Auth endpoints
  login: async (username: string, password: string): Promise<LoginResponse> => {
    console.log("[v0] Attempting login to:", `${API_BASE_URL}/login/`)
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    console.log("[v0] Login response status:", response.status)
    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Login error:", error)
      throw new Error("Login failed")
    }
    return response.json()
  },

  register: async (data: any) => {
    console.log("[v0] Attempting registration to:", `${API_BASE_URL}/register/`)
    console.log("[v0] Registration data:", data)
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    console.log("[v0] Registration response status:", response.status)
    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Registration error:", error)
      throw new Error(JSON.stringify(error))
    }
    return response.json()
  },

  logout: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response.json()
  },

  // Services endpoints
  getServices: async () => {
    const response = await fetch(`${API_BASE_URL}/services/`)
    return response.json()
  },

  createService: async (data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: data,
    })
    if (!response.ok) throw new Error("Failed to create service")
    return response.json()
  },

  updateService: async (id: number, data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}/`, {
      method: "PUT",
      headers: { Authorization: `Token ${token}` },
      body: data,
    })
    if (!response.ok) throw new Error("Failed to update service")
    return response.json()
  },

  deleteService: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
    if (!response.ok) throw new Error("Failed to delete service")
  },

  // Appointments endpoints
  getAppointments: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.json()
  },

  createAppointment: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create appointment")
    return response.json()
  },

  // Patients endpoints
  getPatients: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/patients/`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.json()
  },

  // Inventory endpoints
  getInventory: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/inventory/`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.json()
  },

  // Billing endpoints
  getBilling: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/billing/`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.json()
  },

  // Staff endpoints (owner only)
  getStaff: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/staff/`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.json()
  },

  createStaff: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create staff")
    return response.json()
  },

  deleteStaff: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
    if (!response.ok) throw new Error("Failed to delete staff")
  },

  // Analytics endpoints (owner only)
  getAnalytics: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/analytics/`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.json()
  },
}
