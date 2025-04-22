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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToolbarProvider, useToolbar } from "@/components/toolbar-context"
import { SharedToolbar } from "@/components/shared-toolbar"

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

  // 添加键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage()
      if (e.key === 'ArrowRight') handleNextPage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevPage, handleNextPage])

  // 创建一个内部组件来使用useToolbar钩子
  function BookContent() {
    const { registerTool, unregisterTool } = useToolbar();
    
    // 注册全局工具
    useEffect(() => {
      // 注册目录按钮
      registerTool({
        id: 'contents',
        icon: <BookOpen className="h-4 w-4 text-amber-800/70" />,
        onClick: () => setShowToc(true),
        tooltip: 'Contents',
        priority: 1  // 设置最低的优先级数字
      });
      
      // 注册故事按钮
      registerTool({
        id: 'story',
        icon: <Info className="h-4 w-4 text-amber-800/70" />,
        onClick: () => setShowStory(true),
        tooltip: 'Story',
        priority: 2  // 设置第二低的优先级数字
      });
      
      return () => {
        // 清理
        unregisterTool('contents');
        unregisterTool('story');
      };
    }, [registerTool, unregisterTool]);

    return (
      <div className="relative w-full max-w-4xl aspect-[3/2] perspective-1000">
        <SharedToolbar />
        
        {/* 窗口外左上角毛玻璃工具栏 - 已通过SharedToolbar替代 */}
        
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
      </div>
    );
  }

  return (
    <ToolbarProvider>
      <BookContent />

      {showStory && <StoryModal worldId={worlds[currentPage].id} onClose={() => setShowStory(false)} />}

      {showToc && (
        <TableOfContents
          worlds={worlds}
          currentPage={currentPage}
          onSelectPage={goToPage}
          onClose={() => setShowToc(false)}
        />
      )}
    </ToolbarProvider>
  )
}
