"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useWorlds } from "@/features/world/stores/worlds-context"
import { useSound } from "@/shared/hooks/use-sound"
import { Badge } from "@/shared/components/ui/badge"
import { Sparkles } from "lucide-react"
import { Forest3DWorld } from "@/features/world/components/worlds-3d/forest-3d-world"
import { Button } from "@/shared/components/ui/button"
import { useToolbar } from "@/core/stores/toolbar-context"
import { Box } from "lucide-react"

export function ForestWorld() {
  const [is3DMode, setIs3DMode] = useState(false)
  const [leaves, setLeaves] = useState<{ id: number; x: number; y: number; rotation: number; scale: number }[]>([])
  const [birds, setBirds] = useState<{ id: number; x: number; y: number; direction: number }[]>([])
  const [squirrels, setSquirrels] = useState<{ id: number; x: number; y: number; visible: boolean }[]>([])
  const [mushrooms, setMushrooms] = useState<{ id: number; x: number; y: number; size: number; glowing: boolean }[]>([])
  const [foundSecret, setFoundSecret] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const { discoverWorld } = useWorlds()
  const { playSound } = useSound()
  const { registerTool, unregisterTool } = useToolbar()

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Generate leaves
      const newLeaves = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
      }))
      setLeaves(newLeaves)

      // Generate birds
      const newBirds = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: 50 + Math.random() * (height / 3),
        direction: Math.random() > 0.5 ? 1 : -1,
      }))
      setBirds(newBirds)

      // Generate squirrels
      const newSquirrels = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        x: 50 + Math.random() * (width - 100),
        y: height - 100 - Math.random() * 100,
        visible: false,
      }))
      setSquirrels(newSquirrels)

      // Generate mushrooms
      const newMushrooms = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 30 + Math.random() * (width - 60),
        y: height - 30 - Math.random() * 60,
        size: 10 + Math.random() * 15,
        glowing: false,
      }))
      setMushrooms(newMushrooms)
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

  const handleInteraction = (e: React.MouseEvent) => {
    setIsInteracting(true)
    setTimeout(() => setIsInteracting(false), 2000)
    playSound("forest-rustle")

    // Count interactions
    setInteractionCount((prev) => prev + 1)

    // Move leaves
    setLeaves(
      leaves.map((leaf) => ({
        ...leaf,
        y: leaf.y + 20,
        rotation: leaf.rotation + (Math.random() * 40 - 20),
      })),
    )

    // Show random squirrel
    if (Math.random() > 0.7) {
      setSquirrels(
        squirrels.map((squirrel, index) => ({
          ...squirrel,
          visible: index === Math.floor(Math.random() * squirrels.length),
        })),
      )
      playSound("squirrel")
    }

    // Check if clicked on a mushroom
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mushrooms.forEach((mushroom, index) => {
        const distance = Math.sqrt(Math.pow(x - mushroom.x, 2) + Math.pow(y - mushroom.y, 2))

        if (distance < mushroom.size) {
          // Toggle mushroom glow
          setMushrooms(mushrooms.map((m, i) => (i === index ? { ...m, glowing: !m.glowing } : m)))
          playSound("magic")

          // Check if all mushrooms are glowing
          const updatedMushrooms = [...mushrooms]
          updatedMushrooms[index].glowing = !updatedMushrooms[index].glowing

          if (updatedMushrooms.every((m) => m.glowing) && !foundSecret) {
            setFoundSecret(true)
            discoverWorld("crystal")
            playSound("discovery")
          }
        }
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setBirds((prev) =>
        prev.map((bird) => ({
          ...bird,
          x: (bird.x + bird.direction * 2) % (dimensions.width + 100),
          y: bird.y + (Math.random() - 0.5) * 2,
        })),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [dimensions.width])

  // 在组件挂载时注册3D切换工具
  useEffect(() => {
    registerTool({
      id: 'forest-3d-toggle',
      icon: <Box className="h-4 w-4 text-green-800/70" />,
      onClick: () => setIs3DMode(!is3DMode),
      text: is3DMode ? '2D 视图' : '3D 视图',
      tooltip: is3DMode ? '2D 视图' : '3D 视图',
      isWorldSpecific: true,  // 标记为世界特定工具
      priority: 9999  // 设置一个非常大的优先级数字
    })
    
    return () => {
      // 组件卸载时清理
      unregisterTool('forest-3d-toggle')
    }
  }, [registerTool, unregisterTool, is3DMode])

  return (
    <>
      {is3DMode ? (
        <div className="relative w-full h-full">
          <Forest3DWorld />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden bg-gradient-to-b from-green-200 to-green-400 rounded-lg cursor-pointer"
          onClick={handleInteraction}
        >
          {/* Sun */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-80 shadow-lg" />

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-800 to-green-700" />

          {/* Trees */}
          <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-8 h-40 bg-amber-800 rounded-md mx-auto" />
              <motion.div
                className="w-48 h-48 bg-green-600 rounded-full absolute bottom-32 left-1/2 transform -translate-x-1/2"
                animate={isInteracting ? { y: [0, -10, 0], scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <div className="absolute bottom-0 right-1/4 transform translate-x-1/2">
            <div className="relative">
              <div className="w-6 h-32 bg-amber-900 rounded-md mx-auto" />
              <motion.div
                className="w-36 h-36 bg-green-700 rounded-full absolute bottom-28 left-1/2 transform -translate-x-1/2"
                animate={isInteracting ? { y: [0, -8, 0], scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-3/4 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-5 h-24 bg-amber-700 rounded-md mx-auto" />
              <motion.div
                className="w-28 h-28 bg-green-500 rounded-full absolute bottom-20 left-1/2 transform -translate-x-1/2"
                animate={isInteracting ? { y: [0, -5, 0], scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>

          {/* Mushrooms */}
          {mushrooms.map((mushroom) => (
            <div
              key={mushroom.id}
              className="absolute"
              style={{
                left: mushroom.x,
                top: mushroom.y,
                transform: `translate(-50%, -50%)`,
              }}
            >
              <div
                className={`relative ${mushroom.glowing ? "animate-pulse" : ""}`}
                style={{ filter: mushroom.glowing ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))" : "none" }}
              >
                <div
                  className={`w-${Math.round(mushroom.size / 4)} h-${Math.round(mushroom.size / 3)} rounded-full ${mushroom.glowing ? "bg-red-400" : "bg-red-600"}`}
                  style={{
                    width: `${mushroom.size}px`,
                    height: `${mushroom.size / 2}px`,
                    backgroundColor: mushroom.glowing ? "#f87171" : "#dc2626",
                  }}
                />
                <div
                  className={`w-${Math.round(mushroom.size / 8)} h-${Math.round(mushroom.size / 2)} ${mushroom.glowing ? "bg-pink-200" : "bg-pink-100"} mx-auto`}
                  style={{
                    width: `${mushroom.size / 3}px`,
                    height: `${mushroom.size}px`,
                    backgroundColor: mushroom.glowing ? "#fbcfe8" : "#f9a8d4",
                  }}
                />
                {mushroom.glowing && (
                  <div className="absolute inset-0 opacity-50">
                    <Sparkles className="w-full h-full text-yellow-200" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Falling leaves */}
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              className="absolute w-4 h-4 bg-yellow-100 opacity-70"
              style={{
                left: leaf.x,
                top: leaf.y,
                borderRadius: "50% 0 50% 50%",
                transform: `rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
              }}
              animate={{
                y: dimensions.height + 20,
                x: leaf.x + (Math.random() * 100 - 50),
                rotate: leaf.rotation + 360,
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Birds */}
          {birds.map((bird) => (
            <motion.div
              key={bird.id}
              className="absolute"
              style={{
                left: bird.x,
                top: bird.y,
                transform: `scaleX(${bird.direction})`,
              }}
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path d="M1,5 Q5,0 10,5 Q15,0 19,5" stroke="black" strokeWidth="1.5" fill="none" />
              </svg>
            </motion.div>
          ))}

          {/* Squirrels */}
          {squirrels.map(
            (squirrel) =>
              squirrel.visible && (
                <motion.div
                  key={squirrel.id}
                  className="absolute"
                  style={{
                    left: squirrel.x,
                    top: squirrel.y,
                    width: 20,
                    height: 20,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10,2 Q14,2 14,6 L14,12 Q14,16 10,16 Q6,16 6,12 L6,6 Q6,2 10,2 Z" fill="#a16207" />
                    <path d="M14,5 Q18,5 18,9 L14,9 Z" fill="#a16207" />
                    <circle cx="8" cy="7" r="1" fill="black" />
                    <path d="M14,5 Q18,5 18,9 L14,9 Z" fill="#a16207" />
                    <circle cx="8" cy="7" r="1" fill="black" />
                    <circle cx="12" cy="7" r="1" fill="black" />
                  </svg>
                </motion.div>
              ),
          )}

          {/* Title */}
          <div className="absolute top-4 left-4 text-2xl font-bold text-green-900">森林世界</div>
          <div className="absolute top-12 left-4 text-sm text-green-800">The Forest World</div>

          {/* Interaction hint */}
          <div className="absolute bottom-4 right-4 text-xs text-green-900 bg-white/30 px-2 py-1 rounded">
            Click to rustle the leaves and find secrets
          </div>

          {/* Secret discovery notification */}
          {foundSecret && (
            <Badge className="absolute top-4 right-4 bg-amber-400 text-amber-900 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              New world discovered!
            </Badge>
          )}
        </div>
      )}
    </>
  )
}
