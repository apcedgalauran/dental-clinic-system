"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

const initialServices = [
  {
    id: 1,
    name: "Teeth Cleaning",
    category: "preventive",
    description: "Professional cleaning to maintain oral health and prevent cavities.",
    image: "/dental-teeth-cleaning.jpg",
  },
  {
    id: 2,
    name: "Dental Braces",
    category: "orthodontics",
    description: "Straighten your teeth with our modern orthodontic solutions.",
    image: "/dental-braces-orthodontics.jpg",
  },
  {
    id: 3,
    name: "Tooth Extraction",
    category: "oral_surgery",
    description: "Safe and painless tooth removal procedures.",
    image: "/dental-tooth-extraction.jpg",
  },
]

const categories = [
  { id: "all", label: "All Services" },
  { id: "orthodontics", label: "Orthodontics" },
  { id: "restorations", label: "Restorations" },
  { id: "xrays", label: "X-Rays" },
  { id: "oral_surgery", label: "Oral Surgery" },
  { id: "preventive", label: "Preventive" },
]

export default function Services() {
  const [showAll, setShowAll] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const displayedServices = showAll ? initialServices : initialServices.slice(0, 3)

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-4">Our Services</h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Comprehensive dental care tailored to your needs
          </p>
        </div>

        {showAll && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-background)] text-[var(--color-text)] hover:bg-[var(--color-border)]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">{service.name}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium"
          >
            {showAll ? "Show Less" : "More Services"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
