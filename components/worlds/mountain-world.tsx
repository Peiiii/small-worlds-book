"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function MountainWorld() {
  const [clouds, setClouds] = useState<{ id: number; x: number; y: number; width: number; speed: number }[]>([])
  const [snowflakes, setSnowflakes] = useState<{ id: number; x: number; y: number; size: number; speed: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate clouds
      const newClouds = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: 50 + Math.random() * 100,
        width: 60 + Math.random() * 100,
        speed: 0.2 + Math.random() * 0.5,
      }))
      setClouds(newClouds)

      // Generate snowflakes
      const newSnowflakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5,
      }))
      setSnowflakes(newSnowflakes)
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

    // Add more snowflakes
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const newSnowflakes = Array.from({ length: 20 }, (_, i) => ({
        id: snowflakes.length + i,
        x: Math.random() * width,
        y: 0,
        size: 2 + Math.random() * 4,
        speed: 1 + Math.random() * 3,
      }))
      setSnowflakes([...snowflakes, ...newSnowflakes])
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move clouds
      setClouds((prev) =>
        prev.map((cloud) => {
          let newX = cloud.x + cloud.speed
          if (newX > dimensions.width) {
            newX = -cloud.width
          }

          return {
            ...cloud,
            x: newX,
          }
        }),
      )

      // Move snowflakes
      setSnowflakes(
        (prev) =>
          prev
            .map((flake) => {
              const newY = flake.y + flake.speed
              const newX = flake.x + (Math.random() - 0.5)

              if (newY > dimensions.height) {
                return {
                  ...flake,
                  y: -10,
                  x: Math.random() * dimensions.width,
                }
              }

              return {
                ...flake,
                y: newY,
                x: newX,
              }
            })
            .slice(0, 100), // Limit the number of snowflakes
      )
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width, dimensions.height])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg"
      onClick={handleInteraction}
    >
      {/* Mountains */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Background mountains */}
          <path d="M0,100 L20,40 L40,70 L60,30 L80,60 L100,20 L100,100 Z" fill="#94a3b8" />

          {/* Middle mountains */}
          <path d="M0,100 L30,50 L45,65 L70,35 L100,70 L100,100 Z" fill="#64748b" />

          {/* Foreground mountains with snow caps */}
          <path d="M0,100 L15,60 L30,80 L50,40 L70,75 L85,55 L100,80 L100,100 Z" fill="#334155" />
          <path d="M15,60 L20,55 L25,58 L30,80 L15,60 Z" fill="white" />
          <path d="M50,40 L55,35 L65,45 L70,75 L50,40 Z" fill="white" />
          <path d="M85,55 L90,50 L95,55 L100,80 L85,55 Z" fill="white" />
        </svg>
      </div>

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

      {/* Snowflakes */}
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: flake.x,
            top: flake.y,
            width: flake.size,
            height: flake.size,
          }}
          animate={isInteracting ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.5 }}
        />
      ))}

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-slate-800">山脉世界</div>
      <div className="absolute top-12 left-4 text-sm text-slate-700">The Mountain World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-white bg-slate-500/30 px-2 py-1 rounded">
        Click to create snowfall
      </div>
    </div>
  )
}
