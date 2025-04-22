"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Slider } from "@/shared/components/ui/slider"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const tracks = [
    { title: "Forest Whispers", artist: "Nature Sounds" },
    { title: "Ocean Depths", artist: "Aquatic Melodies" },
    { title: "Cosmic Journey", artist: "Stellar Harmonies" },
    { title: "Desert Winds", artist: "Sand Dunes" },
  ]

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/placeholder-audio.mp3")

    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume
    }

    // Event listeners
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      handleNext()
    }

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)
    }

    return () => {
      if (audio) {
        audio.pause()
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0]
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  const handleSeek = (newTime: number[]) => {
    const value = newTime[0]
    setCurrentTime(value)
    if (audioRef.current) {
      audioRef.current.currentTime = value
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 w-full max-w-md z-40 text-white"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{tracks[currentTrack].title}</h3>
            <p className="text-xs text-slate-300">{tracks[currentTrack].artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <div className="w-20">
              <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1">
            <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700" onClick={handlePrev}>
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700 h-10 w-10" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700" onClick={handleNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
