"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useWorlds } from "@/components/worlds-context"
import { useSound } from "@/hooks/use-sound"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wind } from "lucide-react"

export function SkyWorld() {
  const [islands, setIslands] = useState<
    { id: number; x: number; y: number; size: number; rotation: number; connected: boolean }[]
  >([])
  const [bridges, setBridges] = useState<{ id: number; startId: number; endId: number; visible: boolean }[]>([])
  const [clouds, setClouds] = useState<{ id: number; x: number; y: number; width: number; speed: number }[]>([])
  const [birds, setBirds] = useState<{ id: number; x: number; y: number; direction: number }[]>([])
  const [windDirection, setWindDirection] = useState(1)
  const [foundSecret, setFoundSecret] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [connectedCount, setConnectedCount] = useState(0)
  const { discoverWorld } = useWorlds()
  const { playSound } = useSound()

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate floating islands
      const newIslands = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 100 + (width - 200) * (i / 4),
        y: height / 2 + (i % 2 === 0 ? -50 : 50),
        size: 60 + Math.random() * 40,
        rotation: Math.random() * 10 - 5,
        connected: false,
      }))
      setIslands(newIslands)

      // Generate potential bridges between islands
      const newBridges = []
      for (let i = 0; i < 4; i++) {
        newBridges.push({
          id: i,
          startId: i,
          endId: i + 1,
          visible: false,
        })
      }
      setBridges(newBridges)

      // Generate clouds
      const newClouds = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: 50 + Math.random() * (height - 100),
        width: 60 + Math.random() * 100,
        speed: 0.2 + Math.random() * 0.5,
      }))
      setClouds(newClouds)

      // Generate birds
      const newBirdsData = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: 50 + Math.random() * (height / 3),
        direction: Math.random() > 0.5 ? 1 : -1,
      }))
      setBirds(newBirdsData)
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

  const handleIslandClick = (id: number) => {
    playSound("island")

    // Connect the island
    setIslands(islands.map((island) => (island.id === id ? { ...island, connected: !island.connected } : island)))

    // Update connected count
    const updatedIslands = islands.map((island) =>
      island.id === id ? { ...island, connected: !island.connected } : island,
    )

    const newConnectedCount = updatedIslands.filter((i) => i.connected).length
    setConnectedCount(newConnectedCount)

    // Update bridges
    const newBridges = [...bridges]
    bridges.forEach((bridge, index) => {
      if (bridge.startId === id || bridge.endId === id) {
        const startConnected = updatedIslands[bridge.startId].connected
        const endConnected = updatedIslands[bridge.endId].connected

        newBridges[index].visible = startConnected && endConnected
      }
    })
    setBridges(newBridges)

    // Check if all islands are connected
    if (newConnectedCount === islands.length && !foundSecret) {
      setFoundSecret(true)
      discoverWorld("ancient")
      playSound("discovery")
    }
  }

  const handleWindChange = () => {
    setWindDirection(-windDirection)
    playSound("wind")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move clouds
      setClouds((prev) =>
        prev.map((cloud) => {
          let newX = cloud.x + cloud.speed * windDirection
          if (newX > dimensions.width + cloud.width / 2) {
            newX = -cloud.width / 2
          } else if (newX < -cloud.width / 2) {
            newX = dimensions.width + cloud.width / 2
          }

          return {
            ...cloud,
            x: newX,
          }
        }),
      )

      // Move birds
      setBirds((prev) =>
        prev.map((bird) => {
          let newX = bird.x + bird.direction * 2 * windDirection
          let newDirection = bird.direction

          if (newX > dimensions.width + 50) {
            newX = -50
          } else if (newX < -50) {
            newX = dimensions.width + 50
          }

          // Occasionally change direction
          if (Math.random() < 0.01) {
            newDirection = -newDirection
          }

          return {
            ...bird,
            x: newX,
            direction: newDirection,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width, windDirection])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg"
    >
      {/* Sun */}
      <div
        className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-80"
        style={{ boxShadow: "0 0 20px 10px rgba(234, 179, 8, 0.3)" }}
      />

      {/* Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            left: cloud.x,
            top: cloud.y,
            width: cloud.width,
            height: cloud.width / 2,
          }}
        >
          <div className="absolute w-1/2 h-1/2 bg-white rounded-full opacity-90 left-0 top-1/4" />
          <div className="absolute w-1/3 h-1/3 bg-white rounded-full opacity-90 left-1/4 top-0" />
          <div className="absolute w-1/2 h-1/2 bg-white rounded-full opacity-90 left-1/3 top-1/4" />
          <div className="absolute w-1/3 h-1/3 bg-white rounded-full opacity-90 left-2/3 top-1/6" />
        </div>
      ))}

      {/* Bridges */}
      {bridges.map(
        (bridge) =>
          bridge.visible && (
            <div
              key={bridge.id}
              className="absolute"
              style={{
                left: islands[bridge.startId].x,
                top: islands[bridge.startId].y,
                width: Math.sqrt(
                  Math.pow(islands[bridge.endId].x - islands[bridge.startId].x, 2) +
                    Math.pow(islands[bridge.endId].y - islands[bridge.startId].y, 2),
                ),
                height: 10,
                background: "linear-gradient(90deg, #78350f 0%, #92400e 100%)",
                transformOrigin: "0 0",
                transform: `rotate(${Math.atan2(
                  islands[bridge.endId].y - islands[bridge.startId].y,
                  islands[bridge.endId].x - islands[bridge.startId].x,
                )}rad)`,
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                zIndex: 10,
              }}
            >
              {/* Bridge railings */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-700" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-700" />
            </div>
          ),
      )}

      {/* Floating Islands */}
      {islands.map((island) => (
        <motion.div
          key={island.id}
          className="absolute cursor-pointer"
          style={{
            left: island.x,
            top: island.y,
            width: island.size,
            height: island.size / 2,
            transform: `translate(-50%, -50%) rotate(${island.rotation}deg)`,
            zIndex: 20,
          }}
          animate={{
            y: [island.y - 5, island.y + 5, island.y - 5],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          onClick={() => handleIslandClick(island.id)}
          whileHover={{ scale: 1.05 }}
        >
          {/* Island base */}
          <div className="relative w-full h-full">
            {/* Bottom rock */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/3 bg-stone-600 rounded-b-full"
              style={{
                boxShadow: island.connected ? "0 0 15px rgba(234, 179, 8, 0.5)" : "none",
              }}
            />

            {/* Top soil */}
            <div className="absolute top-0 left-0 right-0 h-2/3 bg-green-700 rounded-t-full overflow-hidden">
              {/* Grass */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-green-500 rounded-t-full" />

              {/* Trees or structures */}
              {island.id % 3 === 0 && (
                <div className="absolute top-1/4 left-1/4 w-1/6 h-1/3 bg-amber-800">
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-amber-700 rounded-t-lg" />
                </div>
              )}

              {island.id % 3 === 1 && (
                <div className="absolute top-1/4 right-1/4 w-1/8 h-1/4 bg-amber-900 rounded-full">
                  <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-green-600 rounded-full" />
                </div>
              )}

              {island.id % 3 === 2 && (
                <div className="absolute top-1/4 left-1/2 w-1/10 h-1/3 bg-stone-400 rounded-lg" />
              )}
            </div>

            {/* Glow effect when connected */}
            {island.connected && (
              <div className="absolute inset-0 opacity-50">
                <Sparkles className="w-full h-full text-yellow-200" />
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Birds */}
      {birds.map((bird) => (
        <motion.div
          key={bird.id}
          className="absolute"
          style={{
            left: bird.x,
            top: bird.y,
            transform: `scaleX(${bird.direction * windDirection})`,
          }}
        >
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path d="M1,5 Q5,0 10,5 Q15,0 19,5" stroke="black" strokeWidth="1.5" fill="none" />
          </svg>
        </motion.div>
      ))}

      {/* Wind direction button */}
      <button
        className="absolute top-4 right-4 p-2 bg-sky-700/50 rounded-full hover:bg-sky-600/50 transition-colors"
        onClick={handleWindChange}
      >
        <Wind className={`h-5 w-5 text-white transform ${windDirection > 0 ? "rotate-0" : "rotate-180"}`} />
      </button>

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-sky-900">天空世界</div>
      <div className="absolute top-12 left-4 text-sm text-sky-800">The Sky World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-sky-900 bg-white/30 px-2 py-1 rounded">
        Click islands to connect them with bridges
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-sky-900">
        Islands connected: {connectedCount}/{islands.length}
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
