"use client"

export default function Sitemap() {
  const locations = [
    {
      id: 1,
      name: "Main Clinic - Makati",
      address: "123 Ayala Avenue, Makati City",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4!2d121.0!3d14.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMwJzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890",
    },
    {
      id: 2,
      name: "Branch 2 - BGC",
      address: "456 Bonifacio High Street, Taguig City",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4!2d121.0!3d14.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMwJzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890",
    },
    {
      id: 3,
      name: "Branch 3 - Quezon City",
      address: "789 Commonwealth Avenue, Quezon City",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4!2d121.0!3d14.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMwJzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890",
    },
  ]

  return (
    <section id="sitemap" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-4">Our Locations</h2>
          <p className="text-lg text-[var(--color-text-muted)]">Visit us at any of our three convenient locations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-[var(--color-border)]"
            >
              <div className="h-64">
                <iframe
                  src={location.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">{location.name}</h3>
                <p className="text-[var(--color-text-muted)]">{location.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
