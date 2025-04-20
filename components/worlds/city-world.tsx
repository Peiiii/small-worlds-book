"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function CityWorld() {
  const [cars, setCars] = useState<
    { id: number; x: number; y: number; width: number; color: string; speed: number; direction: number }[]
  >([])
  const [lights, setLights] = useState<{ id: number; x: number; y: number; on: boolean }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isNight, setIsNight] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate cars
      const carColors = ["#FF9F1C", "#2EC4B6", "#E71D36", "#4361EE", "#7209B7"]
      const newCars = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: height - 50 - (i % 2) * 30,
        width: 30 + Math.random() * 20,
        color: carColors[Math.floor(Math.random() * carColors.length)],
        speed: 1 + Math.random() * 2,
        direction: i % 2 === 0 ? 1 : -1,
      }))
      setCars(newCars)

      // Generate lights
      const newLights = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 50 + (i % 5) * 80,
        y: 100 + Math.floor(i / 5) * 80,
        on: Math.random() > 0.3,
      }))
      setLights(newLights)
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

    // Toggle day/night
    setIsNight(!isNight)

    // Toggle random lights
    setLights(
      lights.map((light) => ({
        ...light,
        on: Math.random() > 0.3,
      })),
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Move cars
      setCars((prev) =>
        prev.map((car) => {
          let newX = car.x + car.speed * car.direction

          if (newX > dimensions.width + car.width) {
            newX = -car.width
          } else if (newX < -car.width) {
            newX = dimensions.width + car.width
          }

          return {
            ...car,
            x: newX,
          }
        }),
      )

      // Randomly toggle some lights if night
      if (isNight && Math.random() < 0.1) {
        setLights((prev) =>
          prev.map((light) => {
            if (Math.random() < 0.1) {
              return {
                ...light,
                on: !light.on,
              }
            }
            return light
          }),
        )
      }
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions.width, isNight])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden rounded-lg transition-colors duration-1000 ${
        isNight ? "bg-slate-900" : "bg-gradient-to-b from-blue-300 to-blue-500"
      }`}
      onClick={handleInteraction}
    >
      {/* Sun/Moon */}
      <div
        className={`absolute w-16 h-16 rounded-full transition-all duration-1000 ${
          isNight ? "bg-gray-200 right-8 top-8" : "bg-yellow-400 left-8 top-8"
        }`}
        style={{
          boxShadow: isNight ? "0 0 20px 5px rgba(255, 255, 255, 0.2)" : "0 0 20px 10px rgba(234, 179, 8, 0.3)",
        }}
      />

      {/* Stars (only visible at night) */}
      {isNight &&
        Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: Math.random() * dimensions.width,
              top: Math.random() * (dimensions.height / 2),
              opacity: 0.5 + Math.random() * 0.5,
            }}
          />
        ))}

      {/* Buildings */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3">
        {/* Background buildings */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`absolute bottom-0 bg-gray-700 ${isNight ? "opacity-70" : "opacity-100"}`}
              style={{
                left: `${i * 10}%`,
                width: `${8 + Math.random() * 4}%`,
                height: `${40 + Math.random() * 30}%`,
              }}
            >
              {/* Windows */}
              {Array.from({ length: 20 }).map((_, j) => {
                const row = Math.floor(j / 4)
                const col = j % 4
                const isOn = isNight && lights.some((light) => light.id === i * 20 + j && light.on)

                return (
                  <div
                    key={j}
                    className={`absolute w-1/5 h-1/10 ${
                      isNight ? (isOn ? "bg-yellow-300" : "bg-gray-800") : "bg-blue-200"
                    }`}
                    style={{
                      left: `${20 + col * 20}%`,
                      top: `${10 + row * 15}%`,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Foreground buildings */}
        <div className="absolute bottom-0 left-0 w-full h-3/4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`absolute bottom-0 ${isNight ? "bg-gray-800" : "bg-gray-600"}`}
              style={{
                left: `${i * 18}%`,
                width: `${15 + Math.random() * 5}%`,
                height: `${60 + Math.random() * 40}%`,
              }}
            >
              {/* Windows */}
              {Array.from({ length: 24 }).map((_, j) => {
                const row = Math.floor(j / 4)
                const col = j % 4
                const isOn = isNight && lights.some((light) => light.id === i * 24 + j && light.on)

                return (
                  <div
                    key={j}
                    className={`absolute w-1/5 h-1/12 ${
                      isNight ? (isOn ? "bg-yellow-300" : "bg-gray-900") : "bg-blue-300"
                    }`}
                    style={{
                      left: `${20 + col * 20}%`,
                      top: `${10 + row * 12}%`,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-800">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 dashed-line" />
      </div>

      {/* Cars */}
      {cars.map((car) => (
        <motion.div
          key={car.id}
          className="absolute"
          style={{
            left: car.x,
            top: car.y,
            width: car.width,
            height: car.width / 2,
            transform: `scaleX(${car.direction})`,
          }}
        >
          <div className="w-full h-1/2 rounded-t-lg" style={{ backgroundColor: car.color }} />
          <div className="w-2/3 h-1/2 mx-auto rounded-t-lg" style={{ backgroundColor: car.color }} />
          <div className="absolute bottom-0 left-1/6 w-1/6 h-1/4 bg-black rounded-full" />
          <div className="absolute bottom-0 right-1/6 w-1/6 h-1/4 bg-black rounded-full" />
          <div
            className={`absolute ${car.direction > 0 ? "right-0" : "left-0"} top-1/4 w-1/6 h-1/4 ${
              isNight ? "bg-yellow-300" : "bg-white"
            }`}
          />
        </motion.div>
      ))}

      {/* Street lights */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="absolute bottom-0" style={{ left: 100 + i * 150 }}>
          <div className="w-2 h-20 bg-gray-600" />
          <div className="w-10 h-4 bg-gray-700 -ml-4" />
          <div
            className={`w-4 h-4 rounded-full -ml-1 ${isNight ? "bg-yellow-300" : "bg-gray-400"}`}
            style={{
              boxShadow: isNight ? "0 0 10px 5px rgba(234, 179, 8, 0.3)" : "none",
            }}
          />
        </div>
      ))}

      {/* Title */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-white">城市世界</div>
      <div className="absolute top-12 left-4 text-sm text-gray-200">The City World</div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-white bg-gray-500/30 px-2 py-1 rounded">
        Click to toggle day/night
      </div>
    </div>
  )
}
