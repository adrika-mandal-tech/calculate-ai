import { create } from 'zustand'

export interface HistoryEntry {
  id: string
  expression: string
  result: string
  timestamp: Date
  error?: string
}

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (expression: string, result: string, error?: string) => void
  clearHistory: () => void
  removeEntry: (id: string) => void
  getEntry: (id: string) => HistoryEntry | undefined
}

export const useHistoryStore = create<HistoryState>()((set, get) => {
  // Load from localStorage on initialization
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('math-ai-history')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.entries) {
          set({ entries: parsed.entries.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })) })
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  return {
    entries: [],
    addEntry: (expression, result, error) => {
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        expression,
        result,
        timestamp: new Date(),
        error,
      }
      set((state) => {
        const newEntries = [entry, ...state.entries].slice(0, 100)
        if (typeof window !== 'undefined') {
          localStorage.setItem('math-ai-history', JSON.stringify({ entries: newEntries }))
        }
        return { entries: newEntries }
      })
    },
    clearHistory: () => {
      set({ entries: [] })
      if (typeof window !== 'undefined') {
        localStorage.removeItem('math-ai-history')
      }
    },
    removeEntry: (id) =>
      set((state) => {
        const newEntries = state.entries.filter((entry) => entry.id !== id)
        if (typeof window !== 'undefined') {
          localStorage.setItem('math-ai-history', JSON.stringify({ entries: newEntries }))
        }
        return { entries: newEntries }
      }),
    getEntry: (id) => get().entries.find((entry) => entry.id === id),
  }
})
