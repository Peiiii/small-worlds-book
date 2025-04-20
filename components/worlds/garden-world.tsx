"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useWorlds } from "@/components/worlds-context"
import { useSound } from "@/hooks/use-sound"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export function GardenWorld() {
  const [flowers, setFlowers] = useState<
    { id: number; x: number; y: number; size: number; color: string; bloomed: boolean }[]
  >([])
  const [butterflies, setButterflies] = useState<{ id: number; x: number; y: number; color: string; path: number }[]>(
    [],
  )
  const [fairies, setFairies] = useState<{ id: number; x: number; y: number; visible: boolean }[]>([])
  const [foundSecret, setFoundSecret] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [bloomedCount, setBloomedCount] = useState(0)
  const { discoverWorld } = useWorlds()
  const { playSound } = useSound()

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate flowers
      const flowerColors = [
        "#ef4444", // red
        "#f97316", // orange
        "#eab308", // yellow
        "#22c55e", // green
        "#3b82f6", // blue
        "#a855f7", // purple
        "#ec4899", // pink
      ]

      const newFlowers = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 50 + Math.random() * (width - 100),
        y: height - 50 - Math.random() * 100,
        size: 20 + Math.random() * 15,
        color: flowerColors[i % flowerColors.length],
        bloomed: false,
      }))
      setFlowers(newFlowers)

      // Generate butterflies
      const newButterflies = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: 50 + Math.random() * (height - 100),
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
        path: Math.floor(Math.random() * 3),
      }))
      setButterflies(newButterflies)

      // Generate fairies
      const newFairies = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        x: 50 + Math.random() * (width - 100),
        y: 50 + Math.random() * (height - 100),
        visible: false,
      }))
      setFairies(newFairies)
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

  const handleFlowerClick = (id: number) => {
    playSound("flower-bloom")

    // Bloom the flower
    setFlowers(flowers.map((flower) => (flower.id === id ? { ...flower, bloomed: true } : flower)))

    // Update bloomed count
    const updatedFlowers = flowers.map((flower) => (flower.id === id ? { ...flower, bloomed: true } : flower))

    const newBloomedCount = updatedFlowers.filter((f) => f.bloomed).length
    setBloomedCount(newBloomedCount)

    // Show a fairy randomly when blooming flowers
    if (Math.random() > 0.6) {
      setFairies(
        fairies.map((fairy, index) => ({
          ...fairy,
          visible: index === Math.floor(Math.random() * fairies.length),
          x: updatedFlowers[id].x,
          y: updatedFlowers[id].y - 30,
        })),
      )
      playSound("fairy")
    }

    // Check if all flowers are bloomed
    if (newBloomedCount === flowers.length && !foundSecret) {
      setFoundSecret(true)
      discoverWorld("sky")
      playSound("discovery")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move butterflies
      setButterflies((prev) =>
        prev.map((butterfly) => {
          const time = Date.now() / 1000
          let newX, newY

          // Different flight patterns
          switch (butterfly.path) {
            case 0: // Figure 8
              newX = butterfly.x + Math.sin(time) * 2
              newY = butterfly.y + Math.sin(time * 2) * 1
              break
            case 1: // Circle
              newX = butterfly.x + Math.sin(time) * 2
              newY = butterfly.y + Math.cos(time) * 2
              break
            case 2: // Random
              newX = butterfly.x + (Math.random() - 0.5) * 4
              newY = butterfly.y + (Math.random() - 0.5) * 4
              break
            default:
              newX = butterfly.x
              newY = butterfly.y
          }

          // Keep within bounds
          newX = Math.max(0, Math.min(dimensions.width, newX))
          newY = Math.max(0, Math.min(dimensions.height, newY))

          return {
            ...butterfly,
            x: newX,
            y: newY,
          }
        }),
      )

      // Hide fairies after a while
      setFairies((prev) =>
        prev.map((fairy) => {
          if (fairy.visible && Math.random() > 0.95) {
            return { ...fairy, visible: false }
          }
          return fairy
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width, dimensions.height])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-green-100 to-emerald-200 rounded-lg"
    >
      {/* Sun */}
      <div
        className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-80"
        style={{ boxShadow: "0 0 20px 10px rgba(234, 179, 8, 0.3)" }}
      />

      {/* Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-green-500" />

      {/* Flowers */}
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute cursor-pointer"
          style={{
            left: flower.x,
            top: flower.y,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => !flower.bloomed && handleFlowerClick(flower.id)}
        >
          {/* Stem */}
          <div
            className="absolute left-1/2 bottom-0 w-1 bg-green-600"
            style={{
              height: flower.size * 1.5,
              transform: "translateX(-50%)",
            }}
          />

          {/* Leaves */}
          <div
            className="absolute left-1/2 bottom-1/3 w-8 h-3 bg-green-500 rounded-full"
            style={{
              transform: "translateX(-100%) rotate(-20deg)",
            }}
          />
          <div
            className="absolute left-1/2 bottom-2/3 w-8 h-3 bg-green-500 rounded-full"
            style={{
              transform: "translateX(0%) rotate(20deg)",
            }}
          />

          {/* Flower head */}
          <motion.div
            className="absolute left-1/2 bottom-full"
            style={{
              transform: "translateX(-50%)",
            }}
            animate={
              flower.bloomed
                ? {
                    rotate: [0, 5, -5, 0],
                  }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {flower.bloomed ? (
              // Bloomed flower
              <div className="relative">
                {/* Petals */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: flower.size / 2,
                      height: flower.size,
                      backgroundColor: flower.color,
                      transform: `rotate(${i * 45}deg)`,
                      transformOrigin: "center bottom",
                      left: flower.size / 4,
                      bottom: 0,
                    }}
                  />
                ))}

                {/* Center */}
                <div
                  className="absolute rounded-full bg-yellow-400"
                  style={{
                    width: flower.size / 2,
                    height: flower.size / 2,
                    left: flower.size / 4,
                    bottom: flower.size / 4,
                  }}
                />
              </div>
            ) : (
              // Unopened bud
              <div
                className="rounded-t-full bg-green-700"
                style={{
                  width: flower.size / 2,
                  height: flower.size / 2,
                }}
              />
            )}
          </motion.div>
        </div>
      ))}

      {/* Butterflies */}
      {butterflies.map((butterfly) => (
        <motion.div
          key={butterfly.id}
          className="absolute"
          style={{
            left: butterfly.x,
            top: butterfly.y,
            width: 15,
            height: 15,
          }}
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Butterfly wings */}
          <svg width="15" height="15" viewBox="0 0 15 15">
            <path d="M7.5,2 Q2,0 2,5 Q2,10 7.5,8 Q13,10 13,5 Q13,0 7.5,2 Z" fill={butterfly.color} opacity="0.8" />
            <path d="M7.5,2 L7.5,8" stroke="black" strokeWidth="0.5" />
          </svg>
        </motion.div>
      ))}

      {/* Fairies */}
      {fairies.map(
        (fairy) =>
          fairy.visible && (
            <motion.div
              key={fairy.id}
              className="absolute"
              style={{
                left: fairy.x,
                top: fairy.y,
                width: 10,
                height: 15,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [fairy.y, fairy.y - 30, fairy.y - 60],
              }}
              transition={{
                duration: 3,
                ease: "easeOut",
              }}
            >
              {/* Fairy body */}
              <div className="relative">
                <div className="absolute w-2 h-4 bg-pink-200 rounded-full left-1/2 transform -translate-x-1/2" />
                <div className="absolute w-4 h-2 bg-white opacity-50 rounded-full left-1/2 top-1 transform -translate-x-1/2 rotate-45" />
                <div className="absolute w-4 h-2 bg-white opacity-50 rounded-full left-1/2 top-1 transform -translate-x-1/2 -rotate-45" />
                <div className="absolute inset-0">
                  <Sparkles className="w-full h-full text-yellow-200" />
                </div>
              </div>
            </motion.div>
          ),
      )}

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-emerald-800">花园世界</div>
      <div className="absolute top-12 left-4 text-sm text-emerald-700">The Garden World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-emerald-900 bg-white/30 px-2 py-1 rounded">
        Click the flower buds to make them bloom
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-emerald-900">
        Flowers bloomed: {bloomedCount}/{flowers.length}
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
