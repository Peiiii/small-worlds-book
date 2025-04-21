import { useState, useEffect } from "react"
import { Book } from "@/components/book"
import { WorldsProvider } from "@/components/worlds-context"
import { MusicPlayer } from "@/components/music-player"
import { Settings } from "@/components/settings"
import { Inventory } from "@/components/inventory"
import { CharacterCreator } from "@/components/character-creator"
import { WeatherSystem } from "@/components/weather-system"
import { Cog, Volume2, Package, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function App() {
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showCharacterCreator, setShowCharacterCreator] = useState(false)
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy">("sunny")

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
        className={`flex min-h-screen flex-col items-center justify-center p-4 transition-colors duration-1000
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

        <div className="relative w-full max-w-4xl">
          <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-5xl">
            <span className="text-amber-400">小世界之书</span>
            <span className="block text-xl font-normal text-amber-200 mt-2">The Book of Small Worlds</span>
          </h1>

          <div className="absolute top-0 right-0 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCharacterCreator(true)}
                    className="text-amber-400 hover:text-amber-300 hover:bg-slate-800/50"
                  >
                    <User className="h-5 w-5" />
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
                    className="text-amber-400 hover:text-amber-300 hover:bg-slate-800/50"
                  >
                    <Package className="h-5 w-5" />
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
                    className="text-amber-400 hover:text-amber-300 hover:bg-slate-800/50"
                  >
                    <Volume2 className="h-5 w-5" />
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
                    className="text-amber-400 hover:text-amber-300 hover:bg-slate-800/50"
                  >
                    <Cog className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>设置</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {showMusicPlayer && <MusicPlayer />}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
        {showCharacterCreator && <CharacterCreator onClose={() => setShowCharacterCreator(false)} />}

        <Book />
        <WeatherSystem onWeatherChange={handleWeatherChange} />

        <footer className="mt-8 text-center text-sm text-white/70">
          <p>点击角落翻页 • 与每个世界互动 • 发现隐藏故事 • 收集神秘物品</p>
        </footer>
      </div>
    </WorldsProvider>
  )
} 