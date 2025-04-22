"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useSound } from "@/shared/hooks/use-sound"

type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy"

interface WeatherSystemProps {
  onWeatherChange: (weather: WeatherType) => void
}

export function WeatherSystem({ onWeatherChange }: WeatherSystemProps) {
  const [currentWeather, setCurrentWeather] = useState<WeatherType>("sunny")
  const [isAutomatic, setIsAutomatic] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day")
  const { playSound } = useSound()

  useEffect(() => {
    if (isAutomatic) {
      // Change weather automatically every 2 minutes
      const weatherInterval = setInterval(() => {
        const weathers: WeatherType[] = ["sunny", "cloudy", "rainy", "snowy", "stormy", "windy"]
        const newWeather = weathers[Math.floor(Math.random() * weathers.length)]
        setCurrentWeather(newWeather)
        onWeatherChange(newWeather)
        playSound("wind")
      }, 120000)

      // Change time of day every 5 minutes
      const timeInterval = setInterval(() => {
        setTimeOfDay((prev) => (prev === "day" ? "night" : "day"))
      }, 300000)

      return () => {
        clearInterval(weatherInterval)
        clearInterval(timeInterval)
      }
    }
  }, [isAutomatic, onWeatherChange, playSound])

  const handleWeatherChange = (weather: WeatherType) => {
    setCurrentWeather(weather)
    onWeatherChange(weather)
    playSound("wind")

    // Disable automatic changes when manually changing weather
    setIsAutomatic(false)
  }

  const toggleTimeOfDay = () => {
    setTimeOfDay((prev) => (prev === "day" ? "night" : "day"))
    playSound("magic")
  }

  const toggleAutomatic = () => {
    setIsAutomatic(!isAutomatic)
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${currentWeather === "sunny" ? "bg-amber-200" : "bg-white/50"} hover:bg-amber-100`}
                  onClick={() => handleWeatherChange("sunny")}
                >
                  <Sun className="h-4 w-4 text-amber-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>晴天</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${currentWeather === "cloudy" ? "bg-slate-200" : "bg-white/50"} hover:bg-slate-100`}
                  onClick={() => handleWeatherChange("cloudy")}
                >
                  <Cloud className="h-4 w-4 text-slate-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>多云</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${currentWeather === "rainy" ? "bg-blue-200" : "bg-white/50"} hover:bg-blue-100`}
                  onClick={() => handleWeatherChange("rainy")}
                >
                  <CloudRain className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>雨天</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${currentWeather === "snowy" ? "bg-cyan-200" : "bg-white/50"} hover:bg-cyan-100`}
                  onClick={() => handleWeatherChange("snowy")}
                >
                  <CloudSnow className="h-4 w-4 text-cyan-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>雪天</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${currentWeather === "stormy" ? "bg-purple-200" : "bg-white/50"} hover:bg-purple-100`}
                  onClick={() => handleWeatherChange("stormy")}
                >
                  <CloudLightning className="h-4 w-4 text-purple-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>雷暴</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${currentWeather === "windy" ? "bg-emerald-200" : "bg-white/50"} hover:bg-emerald-100`}
                  onClick={() => handleWeatherChange("windy")}
                >
                  <Wind className="h-4 w-4 text-emerald-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>大风</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${timeOfDay === "night" ? "bg-indigo-200" : "bg-white/50"} hover:bg-indigo-100`}
                  onClick={toggleTimeOfDay}
                >
                  {timeOfDay === "day" ? (
                    <Sun className="h-4 w-4 text-amber-600" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 3C10.8065 4.19347 10.136 5.81217 10.136 7.5C10.136 9.18783 10.8065 10.8065 12 12C13.1935 13.1935 14.8122 13.864 16.5 13.864C18.1878 13.864 19.8065 13.1935 21 12C21 13.78 20.4722 15.5201 19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.9891 21.1743 10.2442 20.8271C8.49936 20.4798 6.89472 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5006 3.17294 13.7558C2.82567 12.0109 3.0039 10.2004 3.68509 8.55585C4.36628 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3Z"
                        stroke="#4338ca"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{timeOfDay === "day" ? "切换到夜晚" : "切换到白天"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isAutomatic ? "bg-green-200" : "bg-white/50"} hover:bg-green-100`}
                  onClick={toggleAutomatic}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.7285 10.9288C20.4413 13.5978 19.7507 16.5635 17.6569 18.6573C14.5327 21.7815 9.46734 21.7815 6.34315 18.6573C3.21895 15.5331 3.21895 10.4677 6.34315 7.34354C9.46734 4.21935 14.5327 4.21935 17.6569 7.34354"
                      stroke="#16a34a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 7L16 11L12 7"
                      stroke="#16a34a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAutomatic ? "自动天气已开启" : "自动天气已关闭"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}
