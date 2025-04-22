"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useSound } from "@/shared/hooks/use-sound"

interface StoryModalProps {
  worldId: string
  onClose: () => void
}

export function StoryModal({ worldId, onClose }: StoryModalProps) {
  const [story, setStory] = useState("")
  const { playSound } = useSound()

  useEffect(() => {
    // Load story based on worldId
    const stories: Record<string, string> = {
      forest: `In the beginning, there was the Forest World, where ancient trees whispered secrets of life. 
      
      The trees have stood for thousands of years, witnessing the birth of all other worlds. They say if you listen carefully to the rustling leaves, you can hear echoes of the past and glimpses of the future.
      
      Legend has it that magical mushrooms hidden among the roots can reveal pathways to other realms for those patient enough to find them.`,

      ocean: `Beneath the surface of the Ocean World lies a vast kingdom of wonder and mystery.
      
      The currents carry ancient songs between worlds, connecting the deepest trenches to the highest peaks. Schools of luminous fish create patterns that mirror the constellations above.
      
      Sailors tell tales of a hidden coral palace where the guardian of waters resides, maintaining the balance between all liquid elements across the worlds.`,

      space: `The Space World exists beyond the veil of our atmosphere, an infinite canvas of cosmic wonder.
      
      Stars are born and die in spectacular fashion, their energy flowing through invisible channels to sustain life in all other worlds. The planets dance in perfect harmony, each one a potential home for unique forms of existence.
      
      Astronomers believe that certain alignments of celestial bodies can temporarily open doorways between worlds, allowing brief glimpses across realms.`,

      desert: `The Desert World preserves the memory of time itself in its endless sands.
      
      Each grain contains a fragment of history, stories carried by the wind across eons. Beneath the scorching sun, ancient structures stand as testament to civilizations that understood the connections between worlds.
      
      Desert nomads speak of mirages that are actually windows to other realms, visible only to those who have learned to see beyond the physical.`,

      mountain: `The Mountain World reaches toward the heavens, its peaks touching the boundary between realms.
      
      Snow-capped summits serve as anchors, tethering the physical world to the spiritual. The thin air at high altitudes allows thoughts to travel more freely between dimensions.
      
      Mountain sages have long known that certain caves contain resonant chambers where one can hear echoes from other worlds if they sit in perfect stillness.`,

      city: `The City World represents the culmination of conscious creation, where thought becomes form.
      
      Buildings rise and fall like the breathing of a living entity, streets rearrange themselves according to the collective dreams of inhabitants. The city never sleeps, its lights forming patterns that mirror the constellations of the Space World.
      
      Urban explorers sometimes stumble upon doorways in forgotten alleys that lead to parallel versions of the same city in different worlds.`,

      crystal: `The Crystal World vibrates with pure energy, each formation a perfect geometric expression of universal law.
      
      Discovered by those who found the secret mushrooms in the Forest World, this realm exists as a bridge between physical and energetic states. Light refracts through crystal structures to create codes that contain the blueprints of all possible realities.
      
      Crystal healers believe that certain formations can amplify intentions and project them across the boundaries between worlds.`,

      garden: `The Garden World flourishes with impossible beauty, where every plant contains consciousness.
      
      Revealed to those who activated the crystal network, this realm demonstrates the perfect harmony between intention and growth. Flowers bloom in response to emotions, creating living mandalas that tell stories of other worlds.
      
      Gardeners who tend these special plants sometimes find seeds that, when planted in other worlds, create doorways back to this magical garden.`,

      sky: `The Sky World floats among the clouds, islands of possibility suspended in endless blue.
      
      Discovered by those who helped all flowers bloom in the Garden World, this realm represents freedom and connection. Bridges of light form between floating islands when inhabitants focus on unity rather than separation.
      
      Sky sailors navigate between islands using thought-powered vessels, occasionally discovering currents that allow brief journeys to other worlds entirely.`,

      ancient: `The Ancient World holds the wisdom of all that has been and all that could be.
      
      As the final world to be discovered, it serves as the repository of knowledge connecting all realms. Artifacts of immense power stand in geometric patterns, their activation revealing the true nature of reality as a single, interconnected system.
      
      The ancient ones who built this place left instructions for travelers from all worlds, explaining how to maintain balance across the multiverse through conscious intention and collective harmony.`,
    }

    setStory(stories[worldId] || "The story of this world has yet to be discovered...")
    playSound("paper")
  }, [worldId, playSound])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-amber-50 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-amber-900" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>

          <h2 className="text-xl font-bold text-amber-900 mb-4">
            The Tale of the {worldId.charAt(0).toUpperCase() + worldId.slice(1)} World
          </h2>

          <div className="prose prose-amber">
            {story.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-amber-800">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
