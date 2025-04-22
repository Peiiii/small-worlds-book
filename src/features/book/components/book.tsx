"use client"

import { BookOpen, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useToolbarStore } from "@/core/stores/toolbar-store"
import { SharedToolbar } from "@/core/components/shared-toolbar"
import { AnimatePresence, motion } from "framer-motion"
import { ForestWorld } from "@/features/world/components/worlds/forest-world"
import { DesertWorld } from "@/features/world/components/worlds/desert-world"
import { OceanWorld } from "@/features/world/components/worlds/ocean-world"
import { SpaceWorld } from "@/features/world/components/worlds/space-world"
import { MountainWorld } from "@/features/world/components/worlds/mountain-world"
import { CityWorld } from "@/features/world/components/worlds/city-world"
import { CrystalWorld } from "@/features/world/components/worlds/crystal-world"
import { GardenWorld } from "@/features/world/components/worlds/garden-world"
import { SkyWorld } from "@/features/world/components/worlds/sky-world"
import { AncientWorld } from "@/features/world/components/worlds/ancient-world"
import { TableOfContents } from "./table-of-contents"
import { StoryModal } from "@/features/book/components/story-modal"

export function Book() {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showToc, setShowToc] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const bookRef = useRef<HTMLDivElement>(null)
  const { registerTool, unregisterTool } = useToolbarStore()

  const worldComponents = [
    <ForestWorld key="forest" />,
    <DesertWorld key="desert" />,
    <OceanWorld key="ocean" />,
    <SpaceWorld key="space" />,
    <MountainWorld key="mountain" />,
    <CityWorld key="city" />,
    <CrystalWorld key="crystal" />,
    <GardenWorld key="garden" />,
    <SkyWorld key="sky" />,
    <AncientWorld key="ancient" />
  ]

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setDirection(-1)
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < worldComponents.length - 1) {
      setDirection(1)
      setCurrentPage(currentPage + 1)
    }
  }

  // 注册全局工具
  useEffect(() => {
    // 注册目录按钮
    registerTool({
      id: 'contents',
      icon: <BookOpen className="h-4 w-4 text-amber-800/70" />,
      onClick: () => setShowToc(true),
      tooltip: 'Contents',
      priority: 1  // 设置最低的优先级数字
    })
    
    // 注册故事按钮
    registerTool({
      id: 'story',
      icon: <Info className="h-4 w-4 text-amber-800/70" />,
      onClick: () => setShowStory(true),
      tooltip: 'Story',
      priority: 2  // 设置第二低的优先级数字
    })
    
    return () => {
      // 清理
      unregisterTool('contents')
      unregisterTool('story')
    }
  }, [registerTool, unregisterTool])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage()
      } else if (e.key === 'ArrowRight') {
        handleNextPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevPage, handleNextPage])

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className="relative w-full max-w-4xl aspect-[3/2] perspective-1000">
      <SharedToolbar />
      
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

        {/* 侧边翻页按钮 */}
        {currentPage > 0 && (
          <button
            onClick={handlePrevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-20 md:w-8 md:h-24 bg-gradient-to-r from-amber-100/60 to-transparent z-20 rounded-r-lg hover:from-amber-200/60 transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-md"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 text-amber-800/70 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {currentPage < worldComponents.length - 1 && (
          <button
            onClick={handleNextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-20 md:w-8 md:h-24 bg-gradient-to-l from-amber-100/60 to-transparent z-20 rounded-l-lg hover:from-amber-200/60 transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-md"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4 text-amber-800/70 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Bookmark ribbon */}
        <div className="absolute top-0 right-1/4 w-8 h-24 bg-red-500 z-10 bookmark-ribbon" />

        {/* Page number */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-amber-800/70 text-sm">
          {currentPage + 1} / {worldComponents.length}
        </div>

        {/* 键盘导航提示 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-amber-800/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <kbd className="px-2 py-1 bg-amber-100/50 rounded">←</kbd>
          <span>翻页</span>
          <kbd className="px-2 py-1 bg-amber-100/50 rounded">→</kbd>
        </div>
      </div>

      {/* 目录模态框 */}
      <TableOfContents
        isOpen={showToc}
        onClose={() => setShowToc(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* 故事模态框 */}
      <StoryModal
        isOpen={showStory}
        onClose={() => setShowStory(false)}
      />
    </div>
  )
}
