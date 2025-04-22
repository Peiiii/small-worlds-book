"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Volume2, Sparkles, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import { Slider } from "@/shared/components/ui/slider"
import { useWorlds } from "@/features/world/stores/worlds-context"
import { useSound } from "@/shared/hooks/use-sound"
import { useAnimationStore } from "@/core/stores/animation-store"

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const { loadProgress, saveProgress } = useWorlds()
  const { volume, setVolume, soundEnabled, setSoundEnabled } = useSound()
  const { pageTransitionSpeed, setPageTransitionSpeed } = useAnimationStore()
  const [particleEffects, setParticleEffects] = useState(true)
  const [highQuality, setHighQuality] = useState(true)

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress? This will remove all discovered worlds.")) {
      localStorage.removeItem("discoveredWorlds")
      loadProgress()
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0])
  }

  const handleSpeedChange = (newSpeed: number[]) => {
    setPageTransitionSpeed(newSpeed[0])
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800 text-white rounded-lg p-6 max-w-md w-full relative"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-bold mb-6">设置</h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">声音</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <Label htmlFor="sound-toggle">音效</Label>
              </div>
              <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="volume-slider">音量</Label>
                <span className="text-sm text-slate-400">{Math.round(volume * 100)}%</span>
              </div>
              <Slider id="volume-slider" value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">视觉效果</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <Label htmlFor="particles-toggle">粒子效果</Label>
              </div>
              <Switch id="particles-toggle" checked={particleEffects} onCheckedChange={setParticleEffects} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="quality-toggle">高质量图形</Label>
              <Switch id="quality-toggle" checked={highQuality} onCheckedChange={setHighQuality} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="speed-slider">翻页速度</Label>
                </div>
                <span className="text-sm text-slate-400">{Math.round(pageTransitionSpeed * 100)}%</span>
              </div>
              <Slider 
                id="speed-slider" 
                value={[pageTransitionSpeed]} 
                min={0.1} 
                max={1} 
                step={0.1} 
                onValueChange={handleSpeedChange} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">进度</h3>

            <Button variant="destructive" className="w-full" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              重置进度
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
