import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookmarkState {
  currentPage: number
  setCurrentPage: (page: number) => void
  hasBookmark: boolean
  setHasBookmark: (has: boolean) => void
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  readingTime: number
  setReadingTime: (time: number) => void
  lastReadTime: string
  setLastReadTime: (time: Date) => void
  totalPages: number
  setTotalPages: (pages: number) => void
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      currentPage: 0,
      setCurrentPage: (page: number) => set({ currentPage: page }),
      hasBookmark: false,
      setHasBookmark: (has: boolean) => set({ hasBookmark: has }),
      isExpanded: false,
      setIsExpanded: (expanded: boolean) => set({ isExpanded: expanded }),
      readingTime: 0,
      setReadingTime: (time: number) => set({ readingTime: time }),
      lastReadTime: new Date().toISOString(),
      setLastReadTime: (time: Date) => set({ lastReadTime: time.toISOString() }),
      totalPages: 0,
      setTotalPages: (pages: number) => set({ totalPages: pages }),
    }),
    {
      name: 'bookmark-settings',
      partialize: (state) => ({
        currentPage: state.currentPage,
        hasBookmark: state.hasBookmark,
        lastReadTime: state.lastReadTime,
        totalPages: state.totalPages,
      }),
    }
  )
) 