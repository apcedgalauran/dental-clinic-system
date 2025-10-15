import Image from "next/image"

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-4">About Us</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image src="/professional-dentist-portrait.png" alt="Our Dentist" fill className="object-cover" />
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-4">Meet Our Lead Dentist</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
              Dr. Sarah Johnson has been practicing dentistry for over 15 years, specializing in cosmetic and
              restorative procedures. She graduated from the University of Dental Medicine with honors and has completed
              advanced training in orthodontics and oral surgery.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Her commitment to patient care and continuous learning has made her one of the most trusted dental
              professionals in the community. She believes in creating a comfortable environment where patients feel
              valued and cared for.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md border border-[var(--color-border)]">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mb-4">
              <span className="text-[var(--color-accent)] text-2xl font-bold">M</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">Our Mission</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              To provide exceptional dental care that improves the oral health and overall well-being of our patients.
              We strive to create lasting relationships built on trust, compassion, and excellence in every treatment we
              provide.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-[var(--color-border)]">
            <div className="w-12 h-12 bg-[var(--color-accent)] rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">★</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">What Makes Us Different</h3>
            <ul className="space-y-2 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-1">•</span>
                <span>State-of-the-art technology and equipment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-1">•</span>
                <span>Personalized treatment plans for each patient</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-1">•</span>
                <span>Comfortable and welcoming environment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-1">•</span>
                <span>Flexible scheduling and emergency care</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
