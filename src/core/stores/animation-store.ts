import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnimationState {
  pageTransitionSpeed: number
  setPageTransitionSpeed: (speed: number) => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      pageTransitionSpeed: 0.5, // 默认速度
      setPageTransitionSpeed: (speed: number) => set({ pageTransitionSpeed: speed }),
    }),
    {
      name: 'animation-settings',
    }
  )
) 