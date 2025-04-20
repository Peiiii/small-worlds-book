"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function SpaceWorld() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([])
  const [planets, setPlanets] = useState<
    { id: number; x: number; y: number; size: number; color: string; speed: number; angle: number }[]
  >([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate stars
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
      }))
      setStars(newStars)

      // Generate planets
      const planetColors = ["#FF9F1C", "#2EC4B6", "#E71D36", "#4361EE", "#7209B7"]
      const newPlanets = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: width / 2,
        y: height / 2,
        size: 10 + i * 5,
        color: planetColors[i],
        speed: 0.001 + i * 0.0005,
        angle: Math.random() * Math.PI * 2,
      }))
      setPlanets(newPlanets)
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

    // Make stars twinkle
    setStars(
      stars.map((star) => ({
        ...star,
        opacity: Math.random(),
      })),
    )

    // Speed up planets temporarily
    setPlanets(
      planets.map((planet) => ({
        ...planet,
        speed: planet.speed * 5,
      })),
    )

    setTimeout(() => {
      setPlanets(
        planets.map((planet) => ({
          ...planet,
          speed: planet.speed / 5,
        })),
      )
    }, 2000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move planets in orbit
      setPlanets((prev) =>
        prev.map((planet) => {
          const newAngle = planet.angle + planet.speed
          const orbitRadius = 30 + planet.id * 30

          return {
            ...planet,
            angle: newAngle,
            x: dimensions.width / 2 + Math.cos(newAngle) * orbitRadius,
            y: dimensions.height / 2 + Math.sin(newAngle) * orbitRadius,
          }
        }),
      )

      // Twinkle stars
      if (Math.random() < 0.1) {
        setStars((prev) =>
          prev.map((star) => {
            if (Math.random() < 0.3) {
              return {
                ...star,
                opacity: 0.3 + Math.random() * 0.7,
              }
            }
            return star
          }),
        )
      }
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width, dimensions.height])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 to-purple-900 rounded-lg"
      onClick={handleInteraction}
    >
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
          animate={isInteracting ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 1 }}
        />
      ))}

      {/* Sun */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-20 h-20 bg-yellow-500 rounded-full"
          style={{ boxShadow: "0 0 20px 10px rgba(255, 204, 0, 0.5)" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      {/* Planets */}
      {planets.map((planet) => (
        <motion.div
          key={planet.id}
          className="absolute rounded-full"
          style={{
            left: planet.x,
            top: planet.y,
            width: planet.size,
            height: planet.size,
            backgroundColor: planet.color,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Comet */}
      <motion.div
        className="absolute w-4 h-4 bg-blue-200 rounded-full"
        style={{ boxShadow: "-10px 0 20px 5px rgba(191, 219, 254, 0.5)" }}
        animate={{
          x: [dimensions.width, -100],
          y: [0, dimensions.height],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 15,
          ease: "linear",
        }}
      />

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-white">宇宙世界</div>
      <div className="absolute top-12 left-4 text-sm text-blue-200">The Space World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-white bg-purple-500/30 px-2 py-1 rounded">
        Click to create cosmic disturbance
      </div>
    </div>
  )
}
