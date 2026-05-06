import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Calculator, Bot } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AdvMath.ai - Advanced Scientific Calculator",
  description: "Professional scientific calculator with high precision engineering calculations.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Navigation Header */}
        <nav className="bg-black border-b border-orange-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors">
                <Calculator className="h-6 w-6" />
                <span className="text-xl font-bold">AdvMath.ai</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-orange-300 hover:text-orange-400 transition-colors"
                >
                  Calculator
                </Link>
                <Link 
                  href="/ai-calculator" 
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Bot className="h-4 w-4" />
                  AI Calculator
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
