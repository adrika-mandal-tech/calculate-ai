"use client"

import { useHistoryStore } from "@/store/history-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Trash2, Clock } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  onSelectExpression?: (expression: string) => void
}

export function HistorySidebar({ isOpen, onClose, onSelectExpression }: HistorySidebarProps) {
  const { entries, clearHistory, removeEntry } = useHistoryStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-xl font-bold text-gray-800">History</h2>
              <div className="flex gap-2">
                {entries.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4">
              {entries.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No calculations yet</p>
                  <p className="text-sm mt-2">Your history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          entry.error ? "border-red-200 bg-red-50" : "border-blue-200 hover:border-blue-300"
                        }`}
                        onClick={() => onSelectExpression?.(entry.expression)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm text-gray-700 mb-1 break-all">
                                {entry.expression}
                              </div>
                              <div className={`font-semibold text-lg ${
                                entry.error ? "text-red-600" : "text-blue-600"
                              }`}>
                                {entry.error || entry.result}
                              </div>
                              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(entry.timestamp, "MMM d, h:mm a")}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeEntry(entry.id)
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
