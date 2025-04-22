"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useSound } from "@/shared/hooks/use-sound"

interface TableOfContentsProps {
  isOpen: boolean
  onClose: () => void
  currentPage: number
  onPageChange: (index: number) => void
}

export function TableOfContents({ isOpen, onClose, currentPage, onPageChange }: TableOfContentsProps) {
  const { playSound } = useSound()

  if (!isOpen) return null

  const worlds = [
    {
      id: 'forest',
      name: 'Forest World',
      chineseName: '森林世界',
      description: '一个充满生机的绿色世界',
      color: 'green',
      discovered: true
    },
    {
      id: 'desert',
      name: 'Desert World',
      chineseName: '沙漠世界',
      description: '一个充满神秘的金色世界',
      color: 'amber',
      discovered: true
    },
    {
      id: 'ocean',
      name: 'Ocean World',
      chineseName: '海洋世界',
      description: '一个充满活力的蓝色世界',
      color: 'blue',
      discovered: true
    },
    {
      id: 'space',
      name: 'Space World',
      chineseName: '太空世界',
      description: '一个充满未知的黑色世界',
      color: 'gray',
      discovered: false
    },
    {
      id: 'mountain',
      name: 'Mountain World',
      chineseName: '山脉世界',
      description: '一个充满挑战的灰色世界',
      color: 'slate',
      discovered: false
    },
    {
      id: 'city',
      name: 'City World',
      chineseName: '城市世界',
      description: '一个充满活力的灰色世界',
      color: 'zinc',
      discovered: false
    },
    {
      id: 'crystal',
      name: 'Crystal World',
      chineseName: '水晶世界',
      description: '一个充满魔法的紫色世界',
      color: 'purple',
      discovered: false
    },
    {
      id: 'garden',
      name: 'Garden World',
      chineseName: '花园世界',
      description: '一个充满芬芳的粉色世界',
      color: 'pink',
      discovered: false
    },
    {
      id: 'sky',
      name: 'Sky World',
      chineseName: '天空世界',
      description: '一个充满自由的蓝色世界',
      color: 'sky',
      discovered: false
    },
    {
      id: 'ancient',
      name: 'Ancient World',
      chineseName: '远古世界',
      description: '一个充满历史的棕色世界',
      color: 'brown',
      discovered: false
    }
  ]

  const handleSelectWorld = (index: number) => {
    if (worlds[index].discovered) {
      onPageChange(index)
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

        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">目录</h2>

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

              {!world.discovered && <p className="text-xs mt-1 text-gray-400 italic">未发现的世界</p>}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
