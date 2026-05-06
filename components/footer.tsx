"use client"

import { Mail, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-orange-600 bg-gradient-to-br from-black via-orange-950 to-black">
      {/* Divider line with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left: Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm md:text-base text-orange-300 font-medium"
            >
              © 2026 · Math.Adv - Advanced Scientific Calculator
            </motion.p>
          </div>

          {/* Right: Contact Developer */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold text-yellow-400 uppercase tracking-wider"
            >
              Contact Developer
            </motion.h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              {/* Email Link */}
              <motion.a
                href="mailto:adrika.mandal01@gmail.com"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-black/90 border border-orange-600 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-400"
                aria-label="Mail the developer"
              >
                <Mail className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                <span className="text-sm font-medium text-orange-200 group-hover:text-yellow-300 transition-colors">
                  adrika.mandal01@gmail.com
                </span>
              </motion.a>

              {/* LinkedIn Link */}
              <motion.a
                href="https://www.linkedin.com/in/adrika-mandal-753226246/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-black/90 border border-orange-600 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-400"
                aria-label="View LinkedIn profile"
              >
                <Linkedin className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300 transition-colors fill-current" />
                <span className="text-sm font-medium text-orange-200 group-hover:text-yellow-300 transition-colors">
                  LinkedIn
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-yellow-600/5 to-orange-600/5 pointer-events-none" />
    </footer>
  )
}
