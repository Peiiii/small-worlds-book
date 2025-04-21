"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useWorlds } from "@/components/worlds-context"
import { useSound } from "@/hooks/use-sound"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export function CrystalWorld() {
  const [crystals, setCrystals] = useState<
    { id: number; x: number; y: number; size: number; color: string; rotation: number; active: boolean }[]
  >([])
  const [energyBeams, setEnergyBeams] = useState<
    { id: number; startX: number; startY: number; endX: number; endY: number; active: boolean }[]
  >([])
  const [foundSecret, setFoundSecret] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const [activeCrystalCount, setActiveCrystalCount] = useState(0)
  const { discoverWorld } = useWorlds()
  const { playSound } = useSound()

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate crystals
      const crystalColors = [
        "rgb(239, 68, 68)", // red
        "rgb(249, 115, 22)", // orange
        "rgb(234, 179, 8)", // yellow
        "rgb(34, 197, 94)", // green
        "rgb(59, 130, 246)", // blue
        "rgb(168, 85, 247)", // purple
        "rgb(236, 72, 153)", // pink
      ]

      const newCrystals = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        x: 100 + (width - 200) * (i / 6),
        y: height / 2 + (i % 2 === 0 ? -50 : 50),
        size: 30 + Math.random() * 20,
        color: crystalColors[i],
        rotation: Math.random() * 30 - 15,
        active: false,
      }))
      setCrystals(newCrystals)

      // Generate energy beams
      const newBeams = []
      for (let i = 0; i < 6; i++) {
        newBeams.push({
          id: i,
          startX: newCrystals[i].x,
          startY: newCrystals[i].y,
          endX: newCrystals[i + 1].x,
          endY: newCrystals[i + 1].y,
          active: false,
        })
      }
      setEnergyBeams(newBeams)
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleCrystalClick = (id: number) => {
    playSound("crystal")

    // Toggle crystal active state
    setCrystals(crystals.map((crystal) => (crystal.id === id ? { ...crystal, active: !crystal.active } : crystal)))

    // Update active crystal count
    const updatedCrystals = crystals.map((crystal) =>
      crystal.id === id ? { ...crystal, active: !crystal.active } : crystal,
    )

    const activeCount = updatedCrystals.filter((c) => c.active).length
    setActiveCrystalCount(activeCount)

    // Update energy beams
    if (activeCount >= 2) {
      const activeCrystalIds = updatedCrystals
        .filter((c) => c.active)
        .map((c) => c.id)
        .sort((a, b) => a - b)

      // Activate beams between consecutive active crystals
      const newBeams = [...energyBeams]
      for (let i = 0; i < activeCrystalIds.length - 1; i++) {
        const startId = activeCrystalIds[i]
        const endId = activeCrystalIds[i + 1]

        if (endId - startId === 1) {
          newBeams[startId].active = true
        }
      }

      setEnergyBeams(newBeams)
    } else {
      // Deactivate all beams if less than 2 active crystals
      setEnergyBeams(energyBeams.map((beam) => ({ ...beam, active: false })))
    }

    // Check if all crystals are active
    if (updatedCrystals.every((c) => c.active) && !foundSecret) {
      setFoundSecret(true)
      discoverWorld("garden")
      playSound("discovery")
    }
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setIsInteracting(true)
      setTimeout(() => setIsInteracting(false), 1000)

      // Create ripple effect
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Make nearby crystals glow temporarily
        setCrystals(
          crystals.map((crystal) => {
            const distance = Math.sqrt(Math.pow(x - crystal.x, 2) + Math.pow(y - crystal.y, 2))

            if (distance < 100) {
              playSound("crystal-ping")
              return { ...crystal, size: crystal.size + 5 }
            }
            return crystal
          }),
        )

        // Reset crystal sizes after animation
        setTimeout(() => {
          setCrystals(
            crystals.map((crystal) => ({
              ...crystal,
              size: 30 + Math.random() * 20,
            })),
          )
        }, 500)
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 to-purple-900 rounded-lg cursor-pointer"
      onClick={handleBackgroundClick}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Central energy source */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full opacity-30"
        style={{
          boxShadow: "0 0 40px 20px rgba(255, 255, 255, 0.3)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Energy beams */}
      {energyBeams.map((beam) => (
        <motion.div
          key={beam.id}
          className={`absolute ${beam.active ? "opacity-70" : "opacity-0"} transition-opacity duration-500`}
          style={{
            left: beam.startX,
            top: beam.startY,
            width: Math.sqrt(Math.pow(beam.endX - beam.startX, 2) + Math.pow(beam.endY - beam.startY, 2)),
            height: 3,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.7) 100%)",
            transformOrigin: "0 0",
            transform: `rotate(${Math.atan2(beam.endY - beam.startY, beam.endX - beam.startX)}rad)`,
          }}
          animate={
            beam.active
              ? {
                  opacity: [0.5, 1, 0.5],
                  height: [2, 4, 2],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Crystals */}
      {crystals.map((crystal) => (
        <motion.div
          key={crystal.id}
          className="absolute cursor-pointer"
          style={{
            left: crystal.x,
            top: crystal.y,
            transform: `translate(-50%, -50%) rotate(${crystal.rotation}deg)`,
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleCrystalClick(crystal.id)
          }}
          whileHover={{ scale: 1.1 }}
          animate={
            crystal.active
              ? {
                  scale: [1, 1.1, 1],
                  rotate: crystal.rotation + [0, 5, 0],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: crystal.active ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {/* Crystal shape */}
          <div
            className={`relative ${crystal.active ? "animate-pulse" : ""}`}
            style={{
              filter: crystal.active ? `drop-shadow(0 0 8px ${crystal.color})` : "none",
            }}
          >
            <svg width={crystal.size} height={crystal.size * 2} viewBox="0 0 100 200">
              <polygon
                points="50,0 100,70 80,200 20,200 0,70"
                fill={crystal.color}
                fillOpacity={crystal.active ? 0.8 : 0.6}
              />
              <polygon points="50,0 100,70 50,180 0,70" fill="white" fillOpacity={crystal.active ? 0.5 : 0.2} />
            </svg>

            {crystal.active && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-full h-full text-white opacity-70" />
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-70"
          style={{
            left: Math.random() * dimensions.width,
            top: Math.random() * dimensions.height,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20],
            y: [0, Math.random() * 40 - 20],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-cyan-300">水晶世界</div>
      <div className="absolute top-12 left-4 text-sm text-cyan-200">The Crystal World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-white bg-cyan-500/30 px-2 py-1 rounded">
        Click the crystals to activate them
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-white">
        Crystals activated: {activeCrystalCount}/{crystals.length}
      </div>

      {/* Secret discovery notification */}
      {foundSecret && (
        <Badge className="absolute top-4 right-4 bg-amber-400 text-amber-900 animate-pulse">
          <Sparkles className="h-3 w-3 mr-1" />
          New world discovered!
        </Badge>
      )}
    </div>
  )
}
