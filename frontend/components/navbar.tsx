"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import RegisterModal from "./register-modal"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-primary)] border-b border-[var(--color-primary-dark)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">D</span>
              </div>
              <span className="text-xl font-semibold text-white">Dental Clinic</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#services" className="text-white/90 hover:text-[var(--color-accent)] transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-white/90 hover:text-[var(--color-accent)] transition-colors">
                About Us
              </Link>
              <Link href="#contact" className="text-white/90 hover:text-[var(--color-accent)] transition-colors">
                Contact
              </Link>
              <Link href="#sitemap" className="text-white/90 hover:text-[var(--color-accent)] transition-colors">
                Locations
              </Link>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium"
              >
                Schedule Appointment
              </button>
              <Link
                href="/login"
                className="p-2.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
              >
                <User className="w-5 h-5 text-white" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col gap-4">
                <Link href="#services" className="text-white/90 hover:text-[var(--color-accent)]">
                  Services
                </Link>
                <Link href="#about" className="text-white/90 hover:text-[var(--color-accent)]">
                  About Us
                </Link>
                <Link href="#contact" className="text-white/90 hover:text-[var(--color-accent)]">
                  Contact
                </Link>
                <Link href="#sitemap" className="text-white/90 hover:text-[var(--color-accent)]">
                  Locations
                </Link>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium text-left"
                >
                  Schedule Appointment
                </button>
                <Link href="/login" className="flex items-center gap-2 text-white hover:text-[var(--color-accent)]">
                  <User className="w-5 h-5" />
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  )
}
