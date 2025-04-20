"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type World = {
  id: string
  name: string
  chineseName: string
  description: string
  color: string
  discovered: boolean
}

type WorldsContextType = {
  worlds: World[]
  discoverWorld: (id: string) => void
  getDiscoveredCount: () => number
  saveProgress: () => void
  loadProgress: () => void
}

const WorldsContext = createContext<WorldsContextType | undefined>(undefined)

export function WorldsProvider({ children }: { children: ReactNode }) {
  const [worlds, setWorlds] = useState<World[]>([
    {
      id: "forest",
      name: "The Forest World",
      chineseName: "森林世界",
      description: "A lush forest teeming with life and ancient trees",
      color: "green",
      discovered: true,
    },
    {
      id: "ocean",
      name: "The Ocean World",
      chineseName: "海洋世界",
      description: "The mysterious depths of the ocean and its colorful inhabitants",
      color: "blue",
      discovered: true,
    },
    {
      id: "space",
      name: "The Space World",
      chineseName: "宇宙世界",
      description: "The vast cosmos with stars, planets, and cosmic wonders",
      color: "purple",
      discovered: true,
    },
    {
      id: "desert",
      name: "The Desert World",
      chineseName: "沙漠世界",
      description: "A golden desert with hidden oases and ancient ruins",
      color: "amber",
      discovered: true,
    },
    {
      id: "mountain",
      name: "The Mountain World",
      chineseName: "山脉世界",
      description: "Majestic mountains reaching toward the sky",
      color: "slate",
      discovered: true,
    },
    {
      id: "city",
      name: "The City World",
      chineseName: "城市世界",
      description: "A miniature bustling city with tiny inhabitants",
      color: "gray",
      discovered: true,
    },
    {
      id: "crystal",
      name: "The Crystal World",
      chineseName: "水晶世界",
      description: "A dazzling realm of luminous crystals and geometric wonders",
      color: "cyan",
      discovered: false,
    },
    {
      id: "garden",
      name: "The Garden World",
      chineseName: "花园世界",
      description: "An enchanted garden with magical plants and tiny creatures",
      color: "pink",
      discovered: false,
    },
    {
      id: "sky",
      name: "The Sky World",
      chineseName: "天空世界",
      description: "A realm of floating islands and cloud kingdoms",
      color: "sky",
      discovered: false,
    },
    {
      id: "ancient",
      name: "The Ancient World",
      chineseName: "古代世界",
      description: "A forgotten civilization with mysterious artifacts and ancient wisdom",
      color: "stone",
      discovered: false,
    },
  ])

  const discoverWorld = (id: string) => {
    setWorlds(worlds.map((world) => (world.id === id ? { ...world, discovered: true } : world)))
  }

  const getDiscoveredCount = () => {
    return worlds.filter((world) => world.discovered).length
  }

  const saveProgress = () => {
    if (typeof window !== "undefined") {
      const discoveredWorlds = worlds.filter((world) => world.discovered).map((world) => world.id)
      localStorage.setItem("discoveredWorlds", JSON.stringify(discoveredWorlds))
    }
  }

  const loadProgress = () => {
    if (typeof window !== "undefined") {
      const savedWorlds = localStorage.getItem("discoveredWorlds")
      if (savedWorlds) {
        try {
          const discoveredWorlds = JSON.parse(savedWorlds) as string[]
          setWorlds(
            worlds.map((world) => ({
              ...world,
              discovered: discoveredWorlds.includes(world.id),
            })),
          )
        } catch (e) {
          console.error("Failed to parse saved worlds", e)
        }
      }
    }
  }

  useEffect(() => {
    loadProgress()
  }, [])

  useEffect(() => {
    saveProgress()
  }, [worlds])

  return (
    <WorldsContext.Provider value={{ worlds, discoverWorld, getDiscoveredCount, saveProgress, loadProgress }}>
      {children}
    </WorldsContext.Provider>
  )
}

export function useWorlds() {
  const context = useContext(WorldsContext)
  if (context === undefined) {
    throw new Error("useWorlds must be used within a WorldsProvider")
  }
  return context
}
