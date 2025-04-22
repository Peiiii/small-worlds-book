"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SoundType =
  | "page-turn"
  | "forest-rustle"
  | "crystal"
  | "crystal-ping"
  | "flower-bloom"
  | "fairy"
  | "island"
  | "wind"
  | "artifact"
  | "discovery"
  | "completion"
  | "paper"
  | "error"
  | "squirrel"
  | "magic"

interface SoundContextType {
  playSound: (sound: SoundType) => void
  volume: number
  setVolume: (volume: number) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(0.5)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // In a real implementation, we would preload actual sound files
  const playSound = (sound: SoundType) => {
    if (!soundEnabled) return

    // This is a placeholder. In a real app, we would play actual sound files
    console.log(`Playing sound: ${sound} at volume ${volume}`)

    // Example of how we would play a real sound:
    // const audio = new Audio(`/sounds/${sound}.mp3`)
    // audio.volume = volume
    // audio.play()
  }

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem("soundVolume")
      const savedEnabled = localStorage.getItem("soundEnabled")

      if (savedVolume) {
        setVolume(Number.parseFloat(savedVolume))
      }

      if (savedEnabled) {
        setSoundEnabled(savedEnabled === "true")
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("soundVolume", volume.toString())
      localStorage.setItem("soundEnabled", soundEnabled.toString())
    }
  }, [volume, soundEnabled])

  return (
    <SoundContext.Provider value={{ playSound, volume, setVolume, soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
