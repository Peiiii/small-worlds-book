"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Volume2, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useWorlds } from "@/components/worlds-context"
import { useSound } from "@/hooks/use-sound"

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const { loadProgress, saveProgress } = useWorlds()
  const { volume, setVolume, soundEnabled, setSoundEnabled } = useSound()
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

        <h2 className="text-xl font-bold mb-6">Settings</h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Sound</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <Label htmlFor="sound-toggle">Sound Effects</Label>
              </div>
              <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="volume-slider">Volume</Label>
                <span className="text-sm text-slate-400">{Math.round(volume * 100)}%</span>
              </div>
              <Slider id="volume-slider" value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Visual Effects</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <Label htmlFor="particles-toggle">Particle Effects</Label>
              </div>
              <Switch id="particles-toggle" checked={particleEffects} onCheckedChange={setParticleEffects} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="quality-toggle">High Quality Graphics</Label>
              <Switch id="quality-toggle" checked={highQuality} onCheckedChange={setHighQuality} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Progress</h3>

            <Button variant="destructive" className="w-full" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
