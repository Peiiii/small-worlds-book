"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function OceanWorld() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([])
  const [fish, setFish] = useState<
    { id: number; x: number; y: number; speed: number; color: string; size: number; direction: number }[]
  >([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate bubbles
      const newBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: height + Math.random() * 100,
        size: 5 + Math.random() * 15,
      }))
      setBubbles(newBubbles)

      // Generate fish
      const fishColors = ["#FF9F1C", "#2EC4B6", "#E71D36", "#FF9F1C", "#4361EE"]
      const newFish = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: 100 + Math.random() * (height - 200),
        speed: 0.5 + Math.random() * 2,
        color: fishColors[Math.floor(Math.random() * fishColors.length)],
        size: 0.5 + Math.random() * 1,
        direction: Math.random() > 0.5 ? 1 : -1,
      }))
      setFish(newFish)
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

  const handleInteraction = () => {
    setIsInteracting(true)
    setTimeout(() => setIsInteracting(false), 2000)

    // Add more bubbles
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const newBubbles = Array.from({ length: 10 }, (_, i) => ({
        id: bubbles.length + i,
        x: Math.random() * width,
        y: height,
        size: 5 + Math.random() * 15,
      }))
      setBubbles([...bubbles, ...newBubbles])
    }

    // Scare the fish
    setFish(
      fish.map((f) => ({
        ...f,
        x: f.x + (Math.random() * 100 - 50) * f.direction,
        y: f.y + (Math.random() * 60 - 30),
        direction: Math.random() > 0.3 ? f.direction : -f.direction,
      })),
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move fish
      setFish((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.speed * fish.direction
          let newDirection = fish.direction

          // Change direction if hitting the edge
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
            ...fish,
            x: newX,
            y: fish.y + (Math.random() - 0.5) * 2,
            direction: newDirection,
          }
        }),
      )

      // Move bubbles
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - 1 - bubble.size / 10,
            x: bubble.x + (Math.random() - 0.5),
          }))
          .filter((bubble) => bubble.y > -bubble.size),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-blue-300 to-blue-700 rounded-lg"
      onClick={handleInteraction}
    >
      {/* Ocean surface */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-blue-300 opacity-50" />

      {/* Seaweed */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-8 h-40 origin-bottom"
        style={{ background: "linear-gradient(to bottom, #15803d, #166534)" }}
        animate={isInteracting ? { skewX: [0, 15, -15, 0] } : { skewX: [0, 5, -5, 0] }}
        transition={{ duration: isInteracting ? 2 : 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-6 h-32 origin-bottom"
        style={{ background: "linear-gradient(to bottom, #15803d, #166534)" }}
        animate={isInteracting ? { skewX: [0, -15, 15, 0] } : { skewX: [0, -5, 5, 0] }}
        transition={{
          duration: isInteracting ? 2 : 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-7 h-36 origin-bottom"
        style={{ background: "linear-gradient(to bottom, #15803d, #166534)" }}
        animate={isInteracting ? { skewX: [0, 15, -15, 0] } : { skewX: [0, 5, -5, 0] }}
        transition={{ duration: isInteracting ? 2 : 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
      />

      {/* Coral */}
      <div className="absolute bottom-0 right-1/3 w-24 h-20">
        <div className="absolute bottom-0 left-0 w-8 h-16 bg-pink-400 rounded-t-full" />
        <div className="absolute bottom-0 left-6 w-10 h-20 bg-orange-400 rounded-t-full" />
        <div className="absolute bottom-0 right-0 w-7 h-14 bg-purple-400 rounded-t-full" />
      </div>

      {/* Sand */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-200" />

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full border border-white/50 bg-white/20"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{
            duration: 3,
            times: [0, 0.2, 1],
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}

      {/* Fish */}
      {fish.map((fish) => (
        <motion.div
          key={fish.id}
          className="absolute"
          style={{
            left: fish.x,
            top: fish.y,
            transform: `scaleX(${fish.direction}) scale(${fish.size})`,
          }}
        >
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path
              d="M10,10 L30,2 L30,18 L10,10 Z M30,10 L35,10 M5,5 A5,5 0 0 0 5,15 A5,5 0 0 0 5,5 Z"
              fill={fish.color}
              stroke="black"
              strokeWidth="1"
            />
            <circle cx="7" cy="10" r="1.5" fill="black" />
          </svg>
        </motion.div>
      ))}

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-white">海洋世界</div>
      <div className="absolute top-12 left-4 text-sm text-blue-100">The Ocean World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-white bg-blue-500/30 px-2 py-1 rounded">
        Click to create bubbles
      </div>
    </div>
  )
}
