"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Book, Calculator, ArrowLeft } from "lucide-react"

export function AboutNavigation() {
  return (
    <div className="bg-black/90 backdrop-blur-sm border-b border-orange-600 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-black text-yellow-400 border-orange-600 hover:bg-orange-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Calculator
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-orange-500">Math.Adv</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-black text-yellow-400 border-orange-600 hover:bg-orange-900">
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
