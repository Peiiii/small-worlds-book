"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function DesertWorld() {
  const [sandParticles, setSandParticles] = useState<
    { id: number; x: number; y: number; size: number; opacity: number }[]
  >([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const [windDirection, setWindDirection] = useState(1)

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate sand particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: height - 100 + Math.random() * 100,
        size: 1 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.5,
      }))
      setSandParticles(newParticles)
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

    // Change wind direction
    setWindDirection(-windDirection)

    // Add more sand particles
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: sandParticles.length + i,
        x: Math.random() * width,
        y: height - 100 + Math.random() * 100,
        size: 1 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.5,
      }))
      setSandParticles([...sandParticles, ...newParticles])
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move sand particles
      setSandParticles(
        (prev) =>
          prev
            .map((particle) => {
              const newX = particle.x + windDirection * (1 + Math.random() * 2)
              const newY = particle.y - (0.5 + Math.random() * 1)

              // Reset particles that go out of bounds
              if (newX > dimensions.width || newX < 0 || newY < 0) {
                return {
                  ...particle,
                  x: Math.random() * dimensions.width,
                  y: dimensions.height - 50 + Math.random() * 50,
                }
              }

              return {
                ...particle,
                x: newX,
                y: newY,
              }
            })
            .slice(0, 100), // Limit the number of particles
      )
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width, dimensions.height, windDirection])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-200 to-amber-400 rounded-lg"
      onClick={handleInteraction}
    >
      {/* Sun */}
      <div
        className="absolute top-8 right-8 w-16 h-16 bg-yellow-500 rounded-full opacity-90"
        style={{ boxShadow: "0 0 20px 10px rgba(234, 179, 8, 0.3)" }}
      />

      {/* Desert ground */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-amber-600" />

      {/* Dunes */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0,40 Q25,20 50,30 T100,40 V40 H0 Z" fill="#d97706" />
          <path d="M0,40 Q40,15 80,25 T100,40 V40 H0 Z" fill="#b45309" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Cactus */}
      <div className="absolute bottom-32 left-1/4">
        <div className="w-6 h-24 bg-green-700 rounded-md relative">
          <div className="absolute top-6 right-0 w-12 h-4 bg-green-700 rounded-md transform rotate-12" />
          <div className="absolute top-14 left-0 w-10 h-4 bg-green-700 rounded-md transform -rotate-12" />
        </div>
      </div>

      {/* Pyramid */}
      <div className="absolute bottom-24 right-1/4">
        <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-800" />
      </div>

      {/* Sand particles */}
      {sandParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-amber-200"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={isInteracting ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.5 }}
        />
      ))}

      {/* Mirage effect */}
      <div className="absolute bottom-24 left-0 right-0 h-8 bg-white opacity-10" />

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-amber-900">沙漠世界</div>
      <div className="absolute top-12 left-4 text-sm text-amber-800">The Desert World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-amber-900 bg-amber-100/50 px-2 py-1 rounded">
        Click to change wind direction
      </div>
    </div>
  )
}
