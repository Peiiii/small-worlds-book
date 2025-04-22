import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import { useBookmarkStore } from "@/core/stores/bookmark-store"
import { useEffect } from "react"

export function BookmarkRibbon() {
  const {
    currentPage,
    hasBookmark,
    isExpanded,
    readingTime,
    lastReadTime,
    setHasBookmark,
    setIsExpanded,
    setReadingTime,
    setLastReadTime,
    totalPages
  } = useBookmarkStore()

  // 自动记录阅读时间
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(readingTime + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [readingTime, setReadingTime])

  // 自动保存最后阅读时间
  useEffect(() => {
    setLastReadTime(new Date())
  }, [currentPage, setLastReadTime])

  const handleClick = () => {
    setIsExpanded(!isExpanded)
    setHasBookmark(!hasBookmark)
  }

  const formatReadingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatLastReadTime = (dateStr: string) => {
    if (!dateStr) return '未读'
    
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return '今天'
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <motion.div
      className="absolute top-0 right-1/4 z-10"
      animate={{
        width: isExpanded ? '48px' : '24px',
        height: isExpanded ? '160px' : '24px'
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <motion.button
        onClick={handleClick}
        className={`w-full h-full transition-colors flex flex-col items-center justify-center relative overflow-hidden ${
          hasBookmark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-400 hover:bg-red-500'
        }`}
        aria-label={hasBookmark ? "移除书签" : "添加书签"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 卷轴顶部装饰 */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-red-600"
          animate={{
            height: isExpanded ? '8px' : '4px',
            borderRadius: isExpanded ? '4px 4px 0 0' : '2px 2px 0 0'
          }}
        />

        {/* 卷轴底部装饰 */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-red-600"
          animate={{
            height: isExpanded ? '8px' : '4px',
            borderRadius: isExpanded ? '0 0 4px 4px' : '0 0 2px 2px'
          }}
        />

        {/* 卷轴内容 */}
        <motion.div
          className="flex flex-col items-center justify-center w-full h-full px-2"
          animate={{
            opacity: isExpanded ? 1 : 0,
            y: isExpanded ? 0 : 20,
            scale: isExpanded ? 1 : 0.8
          }}
          transition={{
            delay: isExpanded ? 0.1 : 0,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {/* 页码 - 最重要的信息 */}
          <motion.div
            className="text-white text-lg font-medium mb-4"
            animate={{
              y: isExpanded ? 0 : 20,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{
              delay: isExpanded ? 0.2 : 0
            }}
          >
            {currentPage + 1}
          </motion.div>

          {/* 阅读时间 - 次要信息 */}
          <motion.div
            className="text-white/80 text-xs mb-3"
            animate={{
              y: isExpanded ? 0 : 20,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{
              delay: isExpanded ? 0.3 : 0
            }}
          >
            {formatReadingTime(readingTime)}
          </motion.div>

          {/* 最后阅读时间 - 最次要信息 */}
          <motion.div
            className="text-white/60 text-xs"
            animate={{
              y: isExpanded ? 0 : 20,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{
              delay: isExpanded ? 0.4 : 0
            }}
          >
            {formatLastReadTime(lastReadTime)}
          </motion.div>
        </motion.div>

        {/* 卷轴收起时的图标 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isExpanded ? 0 : 1,
            scale: isExpanded ? 0.8 : 1,
            rotate: isExpanded ? 180 : 0
          }}
          transition={{
            delay: isExpanded ? 0 : 0.1,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <Bookmark className="h-4 w-4 text-white" />
        </motion.div>

        {/* 卷轴展开时的装饰线 */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-red-600/30"
          animate={{
            opacity: isExpanded ? 1 : 0,
            scaleY: isExpanded ? 1 : 0
          }}
          transition={{
            delay: isExpanded ? 0.2 : 0
          }}
        />
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-1 bg-red-600/30"
          animate={{
            opacity: isExpanded ? 1 : 0,
            scaleY: isExpanded ? 1 : 0
          }}
          transition={{
            delay: isExpanded ? 0.2 : 0
          }}
        />
      </motion.button>
    </motion.div>
  )
} 