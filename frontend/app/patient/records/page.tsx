import { FileText, Calendar, User } from "lucide-react"
import InteractiveToothChart from "@/components/tooth-chart"

export default function PatientRecords() {
  const records = [
    {
      id: 1,
      date: "2024-12-10",
      treatment: "Root Canal Treatment",
      diagnosis: "Infected tooth #14",
      dentist: "Dr. Sarah Johnson",
      notes: "Successfully completed root canal procedure. Patient tolerated well.",
    },
    {
      id: 2,
      date: "2024-11-05",
      treatment: "Teeth Whitening",
      diagnosis: "Tooth discoloration",
      dentist: "Dr. Sarah Johnson",
      notes: "Professional whitening treatment completed. Advised to avoid staining foods.",
    },
    {
      id: 3,
      date: "2024-09-20",
      treatment: "Dental Cleaning",
      diagnosis: "Plaque buildup",
      dentist: "Dr. Sarah Johnson",
      notes: "Routine cleaning performed. Good oral hygiene maintained.",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Dental Records</h1>
        <p className="text-[var(--color-text-muted)]">Your complete dental treatment history</p>
      </div>

      {/* Interactive Tooth Chart */}
      <InteractiveToothChart />

      <div>
        <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-4">Treatment History</h2>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{record.treatment}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{record.diagnosis}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{record.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <User className="w-4 h-4" />
                <span className="text-sm">{record.dentist}</span>
              </div>
            </div>

            <div className="bg-[var(--color-background)] rounded-lg p-4">
              <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Treatment Notes</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
