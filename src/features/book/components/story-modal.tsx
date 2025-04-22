import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

interface StoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StoryModal({ isOpen, onClose }: StoryModalProps) {
  if (!isOpen) return null

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

        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Story</h2>

        <div className="prose prose-amber max-w-none">
          <p>
            这是一个关于小世界的故事。每个世界都有其独特的风景和故事，等待着你去探索。
          </p>
          <p>
            通过翻页，你可以探索不同的世界，发现它们的故事和秘密。
          </p>
          <p>
            每个世界都有其独特的氛围和体验，希望你能享受这段旅程。
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
} 