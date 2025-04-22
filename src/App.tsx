"use client"

import { useState, useEffect, useCallback } from "react"
import { Book } from "@/features/story/components/book"
import { WorldsProvider } from "@/features/world/stores/worlds-context"
import { MusicPlayer } from "@/core/components/music-player"
import { Settings } from "@/core/components/settings"
import { Inventory } from "@/features/character/components/inventory"
import { CharacterCreator } from "@/features/character/components/character-creator"
import { WeatherSystem } from "@/features/weather/components/weather-system"
import { Cog, Volume2, Package, User } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showCharacterCreator, setShowCharacterCreator] = useState(false)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy">("sunny")

  // 工具栏滚动隐藏逻辑
  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastScrollY = window.scrollY
    let ticking = false

    const updateToolbarVisibility = () => {
      const currentScrollY = window.scrollY
      const isMobile = window.innerWidth < 640 // 添加移动端判断

      // 只在非移动端应用滚动隐藏逻辑
      if (!isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setIsToolbarVisible(false)
        } else {
          setIsToolbarVisible(true)
        }
      } else {
        // 移动端始终显示工具栏
        setIsToolbarVisible(true)
      }

      lastScrollY = currentScrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateToolbarVisibility()
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleWeatherChange = (newWeather: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy") => {
    setWeather(newWeather)
  }

  return (
    <WorldsProvider>
      <div
        className={`flex min-h-screen flex-col items-center justify-center transition-colors duration-1000 relative
        ${
          weather === "sunny"
            ? "bg-gradient-to-b from-sky-400 to-sky-700"
            : weather === "cloudy"
              ? "bg-gradient-to-b from-slate-400 to-slate-700"
              : weather === "rainy"
                ? "bg-gradient-to-b from-blue-500 to-blue-800"
                : weather === "snowy"
                  ? "bg-gradient-to-b from-cyan-300 to-cyan-700"
                  : weather === "stormy"
                    ? "bg-gradient-to-b from-purple-600 to-purple-900"
                    : "bg-gradient-to-b from-emerald-400 to-emerald-700"
        }`}
      >
        {/* Weather Effects */}
        {weather === "rainy" && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-10 bg-blue-200 opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${0.5 + Math.random() * 1}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {weather === "snowy" && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        )}

        {weather === "stormy" && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-full bg-white opacity-0 lightning"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${0.1 + Math.random() * 0.2}s`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        )}

        {weather === "windy" && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-0.5 bg-white opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${20 + Math.random() * 100}px`,
                  animationDuration: `${1 + Math.random() * 3}s`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative w-full max-w-4xl px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="mb-4 sm:mb-8 text-center text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            <span className="text-amber-400 block">小世界之书</span>
            <span className="block text-lg sm:text-xl font-normal text-amber-200 mt-2">The Book of Small Worlds</span>
          </h1>

          {/* 工具栏 - 移动端在顶部固定，平板及以上在右上角 */}
          <div className={`tools-container fixed top-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:static sm:absolute sm:top-0 sm:right-0 sm:left-auto flex flex-row justify-center gap-2 p-2 transition-all duration-300 backdrop-blur-sm z-50 ${!isToolbarVisible ? 'translate-y-full opacity-0 sm:translate-y-0 sm:opacity-100' : ''}`}>
            <div className="flex flex-row gap-1 sm:gap-2 p-1 sm:p-0 bg-slate-800/30 sm:bg-slate-800/20 rounded-lg shadow-lg">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCharacterCreator(true)}
                      className="tool-button w-12 h-12 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-amber-400 hover:text-amber-300 hover:bg-slate-800/50 transition-all duration-200"
                      aria-label="角色创建"
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">角色创建</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>角色创建</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowInventory(true)}
                      className="tool-button w-12 h-12 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-amber-400 hover:text-amber-300 hover:bg-slate-800/50 transition-all duration-200"
                      aria-label="物品收藏"
                    >
                      <Package className="h-5 w-5" />
                      <span className="sr-only">物品收藏</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>物品收藏</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                      className="tool-button w-12 h-12 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-amber-400 hover:text-amber-300 hover:bg-slate-800/50 transition-all duration-200"
                      aria-label="音乐播放器"
                    >
                      <Volume2 className="h-5 w-5" />
                      <span className="sr-only">音乐播放器</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>音乐播放器</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(!showSettings)}
                      className="tool-button w-12 h-12 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-amber-400 hover:text-amber-300 hover:bg-slate-800/50 transition-all duration-200"
                      aria-label="设置"
                    >
                      <Cog className="h-5 w-5" />
                      <span className="sr-only">设置</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>设置</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {showMusicPlayer && <MusicPlayer />}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
        {showCharacterCreator && <CharacterCreator onClose={() => setShowCharacterCreator(false)} />}

        <Book />
        <WeatherSystem onWeatherChange={handleWeatherChange} />

        <footer className="mt-8 text-center text-sm text-white/70 z-10">
          <p>点击角落翻页 • 与每个世界互动 • 发现隐藏故事 • 收集神秘物品</p>
        </footer>

        {/* 滚动监测元素 */}
        <div className="scroll-sentinel h-px w-full absolute bottom-0" />
      </div>
    </WorldsProvider>
  )
}
