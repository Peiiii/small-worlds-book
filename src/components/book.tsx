"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, BookOpen, Info } from "lucide-react"
import { useWorlds } from "@/components/worlds-context"
import { ForestWorld } from "@/components/worlds/forest-world"
import { OceanWorld } from "@/components/worlds/ocean-world"
import { SpaceWorld } from "@/components/worlds/space-world"
import { DesertWorld } from "@/components/worlds/desert-world"
import { MountainWorld } from "@/components/worlds/mountain-world"
import { CityWorld } from "@/components/worlds/city-world"
import { CrystalWorld } from "@/components/worlds/crystal-world"
import { GardenWorld } from "@/components/worlds/garden-world"
import { SkyWorld } from "@/components/worlds/sky-world"
import { AncientWorld } from "@/components/worlds/ancient-world"
import { StoryModal } from "@/components/story-modal"
import { TableOfContents } from "@/components/table-of-contents"
import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/use-sound"

export function Book() {
  const [currentPage, setCurrentPage] = useState(0)
  const { worlds } = useWorlds()
  const bookRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [showStory, setShowStory] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    if (bookRef.current) {
      setDimensions({
        width: bookRef.current.offsetWidth,
        height: bookRef.current.offsetHeight,
      })
    }

    const handleResize = () => {
      if (bookRef.current) {
        setDimensions({
          width: bookRef.current.offsetWidth,
          height: bookRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const worldComponents = [
    <ForestWorld key="forest" />,
    <OceanWorld key="ocean" />,
    <SpaceWorld key="space" />,
    <DesertWorld key="desert" />,
    <MountainWorld key="mountain" />,
    <CityWorld key="city" />,
    <CrystalWorld key="crystal" />,
    <GardenWorld key="garden" />,
    <SkyWorld key="sky" />,
    <AncientWorld key="ancient" />,
  ]

  const nextPage = () => {
    if (currentPage < worldComponents.length - 1) {
      playSound("page-turn")
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      playSound("page-turn")
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < worldComponents.length) {
      playSound("page-turn")
      setCurrentPage(pageIndex)
      setShowToc(false)
    }
  }

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? dimensions.width : -dimensions.width,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        rotateY: { duration: 0.8 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? dimensions.width : -dimensions.width,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        rotateY: { duration: 0.8 },
      },
    }),
  }

  const [direction, setDirection] = useState(0)

  const handleNextPage = () => {
    setDirection(1)
    nextPage()
  }

  const handlePrevPage = () => {
    setDirection(-1)
    prevPage()
  }

  return (
    <>
      <div className="relative w-full max-w-4xl aspect-[3/2] perspective-1000">
        <div className="absolute top-0 left-0 z-20 flex gap-2 m-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-amber-100/80 hover:bg-amber-200/80 text-amber-900"
            onClick={() => setShowToc(true)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Contents
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-amber-100/80 hover:bg-amber-200/80 text-amber-900"
            onClick={() => setShowStory(true)}
          >
            <Info className="h-4 w-4 mr-2" />
            Story
          </Button>
        </div>

        <div
          ref={bookRef}
          className="relative w-full h-full bg-amber-50 rounded-lg shadow-2xl overflow-hidden book-container"
          style={{
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="absolute inset-0 bg-amber-100/30 pointer-events-none z-10 book-texture" />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-full p-4 md:p-8">{worldComponents[currentPage]}</div>
            </motion.div>
          </AnimatePresence>

          {/* Page corners for turning */}
          {currentPage > 0 && (
            <button
              onClick={handlePrevPage}
              className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-amber-100 to-transparent z-20 rounded-br-lg hover:from-amber-200 transition-colors duration-300 flex items-start justify-start p-2"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6 text-amber-800/70" />
            </button>
          )}

          {currentPage < worldComponents.length - 1 && (
            <button
              onClick={handleNextPage}
              className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-bl from-amber-100 to-transparent z-20 rounded-bl-lg hover:from-amber-200 transition-colors duration-300 flex items-start justify-end p-2"
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6 text-amber-800/70" />
            </button>
          )}

          {/* Bookmark ribbon */}
          <div className="absolute top-0 right-1/4 w-8 h-24 bg-red-500 z-10 bookmark-ribbon" />

          {/* Page number */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-amber-800/70 text-sm">
            {currentPage + 1} / {worldComponents.length}
          </div>
        </div>
      </div>

      {showStory && <StoryModal worldId={worlds[currentPage].id} onClose={() => setShowStory(false)} />}

      {showToc && (
        <TableOfContents
          worlds={worlds}
          currentPage={currentPage}
          onSelectPage={goToPage}
          onClose={() => setShowToc(false)}
        />
      )}
    </>
  )
}
