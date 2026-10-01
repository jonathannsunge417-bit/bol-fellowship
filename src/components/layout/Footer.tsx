import Link from 'next/link'
import { Church, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-semibold text-[var(--primary)]">
              <Church className="h-6 w-6" />
              Bread of Life Campus Fellowship
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Kapasa Makasa University. Growing in faith, serving with love, and building a community rooted in Christ.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/about" className="hover:text-[var(--primary)]">About Us</Link></li>
              <li><Link href="/events" className="hover:text-[var(--primary)]">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-[var(--primary)]">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--primary)]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Kapasa Makasa University, Zambia
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:breadoflifecampusfellowship@gmail.com"
                  className="hover:text-[var(--primary)]"
                >
                  breadoflifecampusfellowship@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href="tel:+260961633540"
                  className="hover:text-[var(--primary)]"
                >
                  0961 633 540
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Bread of Life Campus Fellowship. All rights reserved.
        </div>
      </div>
    </footer>
  )
}