"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useSound } from "@/shared/hooks/use-sound"

interface TableOfContentsProps {
  worlds: {
    id: string
    name: string
    chineseName: string
    description: string
    color: string
    discovered: boolean
  }[]
  currentPage: number
  onSelectPage: (index: number) => void
  onClose: () => void
}

export function TableOfContents({ worlds, currentPage, onSelectPage, onClose }: TableOfContentsProps) {
  const { playSound } = useSound()

  const handleSelectWorld = (index: number) => {
    if (worlds[index].discovered) {
      onSelectPage(index)
      playSound("page-turn")
    } else {
      playSound("error")
    }
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
        className="bg-amber-50 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-amber-900" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Table of Contents</h2>

        <div className="grid gap-2">
          {worlds.map((world, index) => (
            <div
              key={world.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                world.discovered
                  ? `hover:bg-${world.color}-100 ${currentPage === index ? `bg-${world.color}-100 border border-${world.color}-300` : "bg-amber-100/50"}`
                  : "bg-gray-200 cursor-not-allowed"
              }`}
              onClick={() => handleSelectWorld(index)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-bold ${world.discovered ? `text-${world.color}-900` : "text-gray-500"}`}>
                    {world.chineseName}
                  </h3>
                  <p className={`text-sm ${world.discovered ? `text-${world.color}-700` : "text-gray-400"}`}>
                    {world.name}
                  </p>
                </div>
                <div className={`text-sm ${world.discovered ? "text-amber-600" : "text-gray-400"}`}>{index + 1}</div>
              </div>

              {world.discovered && <p className="text-xs mt-1 text-gray-500">{world.description}</p>}

              {!world.discovered && <p className="text-xs mt-1 text-gray-400 italic">Undiscovered world</p>}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
