"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useWorlds } from "@/features/world/stores/worlds-context"
import { useSound } from "@/shared/hooks/use-sound"
import { Badge } from "@/shared/components/ui/badge"
import { Sparkles } from "lucide-react"

export function AncientWorld() {
  const [artifacts, setArtifacts] = useState<{ id: number; x: number; y: number; type: string; activated: boolean }[]>(
    [],
  )
  const [glyphs, setGlyphs] = useState<{ id: number; x: number; y: number; symbol: string; glowing: boolean }[]>([])
  const [energyBeams, setEnergyBeams] = useState<
    { id: number; startX: number; startY: number; endX: number; endY: number; visible: boolean }[]
  >([])
  const [foundSecret, setFoundSecret] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [activatedCount, setActivatedCount] = useState(0)
  const { discoverWorld } = useWorlds()
  const { playSound } = useSound()

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate artifacts
      const artifactTypes = ["statue", "tablet", "crystal", "orb", "totem"]
      const newArtifacts = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 100 + (width - 200) * (i / 4),
        y: height / 2,
        type: artifactTypes[i],
        activated: false,
      }))
      setArtifacts(newArtifacts)

      // Generate glyphs
      const symbols = ["𓀀", "𓁹", "𓃾", "𓆣", "𓇯", "𓊖", "𓏲", "𓐍"]
      const newGlyphs = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 50 + Math.random() * (width - 100),
        y: 50 + Math.random() * (height - 100),
        symbol: symbols[i % symbols.length],
        glowing: false,
      }))
      setGlyphs(newGlyphs)

      // Generate energy beams
      const newBeams = []
      for (let i = 0; i < 4; i++) {
        newBeams.push({
          id: i,
          startX: newArtifacts[i].x,
          startY: newArtifacts[i].y,
          endX: newArtifacts[i + 1].x,
          endY: newArtifacts[i + 1].y,
          visible: false,
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

  const handleArtifactClick = (id: number) => {
    playSound("artifact")

    // Activate the artifact
    setArtifacts(
      artifacts.map((artifact) => (artifact.id === id ? { ...artifact, activated: !artifact.activated } : artifact)),
    )

    // Update activated count
    const updatedArtifacts = artifacts.map((artifact) =>
      artifact.id === id ? { ...artifact, activated: !artifact.activated } : artifact,
    )

    const newActivatedCount = updatedArtifacts.filter((a) => a.activated).length
    setActivatedCount(newActivatedCount)

    // Make nearby glyphs glow
    setGlyphs(
      glyphs.map((glyph) => {
        const distance = Math.sqrt(
          Math.pow(glyph.x - updatedArtifacts[id].x, 2) + Math.pow(glyph.y - updatedArtifacts[id].y, 2),
        )

        if (distance < 100) {
          return { ...glyph, glowing: updatedArtifacts[id].activated }
        }
        return glyph
      }),
    )

    // Update energy beams
    const newBeams = [...energyBeams]
    energyBeams.forEach((beam, index) => {
      if (beam.startX === updatedArtifacts[id].x || beam.endX === updatedArtifacts[id].x) {
        const startId = artifacts.findIndex((a) => a.x === beam.startX)
        const endId = artifacts.findIndex((a) => a.x === beam.endX)

        if (startId >= 0 && endId >= 0) {
          const startActivated = updatedArtifacts[startId].activated
          const endActivated = updatedArtifacts[endId].activated

          newBeams[index].visible = startActivated && endActivated
        }
      }
    })
    setEnergyBeams(newBeams)

    // Check if all artifacts are activated
    if (newActivatedCount === artifacts.length && !foundSecret) {
      setFoundSecret(true)
      playSound("discovery")

      // All worlds discovered!
      setTimeout(() => {
        playSound("completion")
      }, 1000)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-stone-700 to-stone-900 rounded-lg"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-stone-texture opacity-20" />

      {/* Temple structure */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/3">
        {/* Steps */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-stone-600" />
        <div className="absolute bottom-1/4 left-5 right-5 h-1/4 bg-stone-600" />
        <div className="absolute bottom-2/4 left-10 right-10 h-1/4 bg-stone-600" />

        {/* Columns */}
        <div className="absolute bottom-0 left-1/6 w-1/12 h-2/3 bg-stone-500">
          <div className="absolute top-0 left-0 right-0 h-1/6 bg-stone-400" />
          <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-stone-400" />
        </div>

        <div className="absolute bottom-0 right-1/6 w-1/12 h-2/3 bg-stone-500">
          <div className="absolute top-0 left-0 right-0 h-1/6 bg-stone-400" />
          <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-stone-400" />
        </div>
      </div>

      {/* Energy beams */}
      {energyBeams.map(
        (beam) =>
          beam.visible && (
            <motion.div
              key={beam.id}
              className="absolute bg-amber-400/70"
              style={{
                left: beam.startX,
                top: beam.startY,
                width: Math.sqrt(Math.pow(beam.endX - beam.startX, 2) + Math.pow(beam.endY - beam.startY, 2)),
                height: 3,
                transformOrigin: "0 0",
                transform: `rotate(${Math.atan2(beam.endY - beam.startY, beam.endX - beam.startX)}rad)`,
                zIndex: 10,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                height: [2, 4, 2],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ),
      )}

      {/* Artifacts */}
      {artifacts.map((artifact) => (
        <motion.div
          key={artifact.id}
          className="absolute cursor-pointer"
          style={{
            left: artifact.x,
            top: artifact.y,
            transform: "translate(-50%, -50%)",
            zIndex: 20,
          }}
          onClick={() => handleArtifactClick(artifact.id)}
          whileHover={{ scale: 1.1 }}
          animate={
            artifact.activated
              ? {
                  y: [artifact.y, artifact.y - 10, artifact.y],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: artifact.activated ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {/* Different artifact types */}
          <div
            className={`relative ${artifact.activated ? "animate-pulse" : ""}`}
            style={{
              filter: artifact.activated ? "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))" : "none",
            }}
          >
            {artifact.type === "statue" && (
              <div className="w-12 h-24 bg-stone-400">
                <div className="absolute top-0 left-0 right-0 h-1/4 rounded-full bg-stone-300" />
                <div className="absolute top-1/4 left-1/4 right-1/4 h-1/2 bg-stone-300" />
              </div>
            )}

            {artifact.type === "tablet" && (
              <div className="w-20 h-16 bg-stone-500 rounded-sm">
                <div className="absolute inset-2 bg-stone-600 flex items-center justify-center">
                  <span className="text-stone-300 text-xs">𓀀𓁹𓃾𓆣</span>
                </div>
              </div>
            )}

            {artifact.type === "crystal" && (
              <div className="w-10 h-20">
                <svg viewBox="0 0 100 200" width="100%" height="100%">
                  <polygon
                    points="50,0 100,70 80,200 20,200 0,70"
                    fill="#a16207"
                    fillOpacity={artifact.activated ? 0.8 : 0.6}
                  />
                  <polygon
                    points="50,0 100,70 50,180 0,70"
                    fill="#fbbf24"
                    fillOpacity={artifact.activated ? 0.5 : 0.2}
                  />
                </svg>
              </div>
            )}

            {artifact.type === "orb" && (
              <div className="w-16 h-16 rounded-full bg-stone-400">
                <div className="absolute inset-2 rounded-full bg-amber-600 opacity-60" />
              </div>
            )}

            {artifact.type === "totem" && (
              <div className="w-10 h-24 bg-stone-700">
                <div className="absolute top-0 left-0 right-0 h-1/4 bg-stone-600" />
                <div className="absolute top-1/4 left-0 right-0 h-1/4 bg-stone-500" />
                <div className="absolute top-2/4 left-0 right-0 h-1/4 bg-stone-600" />
              </div>
            )}

            {/* Glow effect when activated */}
            {artifact.activated && (
              <div className="absolute inset-0 opacity-70">
                <Sparkles className="w-full h-full text-amber-300" />
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Glyphs */}
      {glyphs.map((glyph) => (
        <div
          key={glyph.id}
          className={`absolute text-xl ${glyph.glowing ? "text-amber-400" : "text-stone-400"} transition-colors duration-500`}
          style={{
            left: glyph.x,
            top: glyph.y,
            transform: "translate(-50%, -50%)",
            textShadow: glyph.glowing ? "0 0 5px rgba(251, 191, 36, 0.8)" : "none",
          }}
        >
          {glyph.symbol}
        </div>
      ))}

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-stone-300">古代世界</div>
      <div className="absolute top-12 left-4 text-sm text-stone-400">The Ancient World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-stone-300 bg-stone-600/50 px-2 py-1 rounded">
        Click the artifacts to activate them
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-stone-300">
        Artifacts activated: {activatedCount}/{artifacts.length}
      </div>

      {/* Secret discovery notification */}
      {foundSecret && (
        <Badge className="absolute top-4 right-4 bg-amber-400 text-amber-900 animate-pulse">
          <Sparkles className="h-3 w-3 mr-1" />
          All worlds discovered!
        </Badge>
      )}
    </div>
  )
}
