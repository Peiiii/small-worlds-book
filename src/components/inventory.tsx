"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Package, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSound } from "@/hooks/use-sound"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ItemType = {
  id: string
  name: string
  description: string
  image: string
  type: "artifact" | "key" | "collectible" | "tool"
  worldOrigin: string
  discovered: boolean
  usable: boolean
  used: boolean
}

interface InventoryProps {
  onClose: () => void
}

export function Inventory({ onClose }: InventoryProps) {
  const [items, setItems] = useState<ItemType[]>([])
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    // Load inventory from localStorage
    const savedInventory = localStorage.getItem("worldsInventory")
    if (savedInventory) {
      try {
        setItems(JSON.parse(savedInventory))
      } catch (e) {
        console.error("Failed to parse saved inventory", e)
      }
    } else {
      // Initialize with some starter items
      const initialItems: ItemType[] = [
        {
          id: "magic_key",
          name: "魔法钥匙",
          description: "一把神秘的钥匙，似乎可以打开通往其他世界的门。",
          image: "/placeholder.svg?height=50&width=50",
          type: "key",
          worldOrigin: "forest",
          discovered: true,
          usable: true,
          used: false,
        },
        {
          id: "crystal_shard",
          name: "水晶碎片",
          description: "从水晶世界收集的闪亮碎片，散发着微弱的能量。",
          image: "/placeholder.svg?height=50&width=50",
          type: "collectible",
          worldOrigin: "crystal",
          discovered: true,
          usable: false,
          used: false,
        },
        {
          id: "ancient_map",
          name: "古代地图",
          description: "一张神秘的地图，标记着所有小世界之间的联系。",
          image: "/placeholder.svg?height=50&width=50",
          type: "artifact",
          worldOrigin: "ancient",
          discovered: false,
          usable: true,
          used: false,
        },
        {
          id: "watering_can",
          name: "魔法浇水壶",
          description: "可以让花园世界的花朵立即盛开。",
          image: "/placeholder.svg?height=50&width=50",
          type: "tool",
          worldOrigin: "garden",
          discovered: true,
          usable: true,
          used: false,
        },
        {
          id: "cloud_essence",
          name: "云朵精华",
          description: "从天空世界收集的轻盈物质，触摸时会感到一阵微风。",
          image: "/placeholder.svg?height=50&width=50",
          type: "collectible",
          worldOrigin: "sky",
          discovered: true,
          usable: false,
          used: false,
        },
      ]
      setItems(initialItems)
      localStorage.setItem("worldsInventory", JSON.stringify(initialItems))
    }
  }, [])

  const handleItemClick = (item: ItemType) => {
    setSelectedItem(item)
    playSound("paper")
  }

  const handleUseItem = (item: ItemType) => {
    if (item.usable && !item.used) {
      playSound("magic")

      // Mark item as used
      const updatedItems = items.map((i) => (i.id === item.id ? { ...i, used: true } : i))
      setItems(updatedItems)
      localStorage.setItem("worldsInventory", JSON.stringify(updatedItems))

      // Close item detail
      setSelectedItem(null)
    }
  }

  const handleDiscoverItem = (itemId: string) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, discovered: true } : item))
    setItems(updatedItems)
    localStorage.setItem("worldsInventory", JSON.stringify(updatedItems))
  }

  const filterItemsByType = (type: ItemType["type"]) => {
    return items.filter((item) => item.type === type && item.discovered)
  }

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
          className="bg-amber-50 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden relative"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-amber-900" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-amber-700 mr-2" />
            <h2 className="text-xl font-bold text-amber-900">物品收藏</h2>
          </div>

          {selectedItem ? (
            <div className="h-[calc(80vh-120px)] overflow-y-auto">
              <Button variant="ghost" size="sm" className="mb-4 text-amber-700" onClick={() => setSelectedItem(null)}>
                ← 返回
              </Button>

              <div className="bg-amber-100/50 rounded-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                  <div className="w-24 h-24 bg-amber-200 rounded-lg flex items-center justify-center">
                    <img
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-900">{selectedItem.name}</h3>
                    <p className="text-sm text-amber-700 mb-2">
                      类型:{" "}
                      {selectedItem.type === "artifact"
                        ? "神器"
                        : selectedItem.type === "key"
                          ? "钥匙"
                          : selectedItem.type === "collectible"
                            ? "收藏品"
                            : "工具"}
                    </p>
                    <p className="text-sm text-amber-700 mb-4">
                      来源:{" "}
                      {selectedItem.worldOrigin === "forest"
                        ? "森林世界"
                        : selectedItem.worldOrigin === "ocean"
                          ? "海洋世界"
                          : selectedItem.worldOrigin === "space"
                            ? "宇宙世界"
                            : selectedItem.worldOrigin === "desert"
                              ? "沙漠世界"
                              : selectedItem.worldOrigin === "mountain"
                                ? "山脉世界"
                                : selectedItem.worldOrigin === "city"
                                  ? "城市世界"
                                  : selectedItem.worldOrigin === "crystal"
                                    ? "水晶世界"
                                    : selectedItem.worldOrigin === "garden"
                                      ? "花园世界"
                                      : selectedItem.worldOrigin === "sky"
                                        ? "天空世界"
                                        : "古代世界"}
                    </p>
                    <p className="text-amber-800 mb-6">{selectedItem.description}</p>

                    {selectedItem.usable && (
                      <Button
                        variant={selectedItem.used ? "outline" : "default"}
                        disabled={selectedItem.used}
                        onClick={() => handleUseItem(selectedItem)}
                        className={
                          selectedItem.used ? "bg-amber-100 text-amber-400" : "bg-amber-600 hover:bg-amber-700"
                        }
                      >
                        {selectedItem.used ? "已使用" : "使用物品"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-amber-100/30 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  物品历史
                </h4>
                <p className="text-sm text-amber-700">
                  这个
                  {selectedItem.type === "artifact"
                    ? "神器"
                    : selectedItem.type === "key"
                      ? "钥匙"
                      : selectedItem.type === "collectible"
                        ? "收藏品"
                        : "工具"}
                  是在你探索
                  {selectedItem.worldOrigin === "forest"
                    ? "森林世界"
                    : selectedItem.worldOrigin === "ocean"
                      ? "海洋世界"
                      : selectedItem.worldOrigin === "space"
                        ? "宇宙世界"
                        : selectedItem.worldOrigin === "desert"
                          ? "沙漠世界"
                          : selectedItem.worldOrigin === "mountain"
                            ? "山脉世界"
                            : selectedItem.worldOrigin === "city"
                              ? "城市世界"
                              : selectedItem.worldOrigin === "crystal"
                                ? "水晶世界"
                                : selectedItem.worldOrigin === "garden"
                                  ? "花园世界"
                                  : selectedItem.worldOrigin === "sky"
                                    ? "天空世界"
                                    : "古代世界"}
                  时发现的。它似乎与这个小世界有着深厚的联系。
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[calc(80vh-120px)] overflow-y-auto">
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="artifacts">神器</TabsTrigger>
                  <TabsTrigger value="keys">钥匙</TabsTrigger>
                  <TabsTrigger value="tools">工具</TabsTrigger>
                  <TabsTrigger value="collectibles">收藏品</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {items
                    .filter((item) => item.discovered)
                    .map((item) => (
                      <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                    ))}
                </TabsContent>

                <TabsContent value="artifacts" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filterItemsByType("artifact").map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </TabsContent>

                <TabsContent value="keys" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filterItemsByType("key").map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </TabsContent>

                <TabsContent value="tools" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filterItemsByType("tool").map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </TabsContent>

                <TabsContent value="collectibles" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filterItemsByType("collectible").map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ItemCard({ item, onClick }: { item: ItemType; onClick: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="bg-amber-100/50 rounded-lg p-3 cursor-pointer hover:bg-amber-100 transition-colors flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
          >
            <div className="w-16 h-16 bg-amber-200 rounded-lg mb-2 flex items-center justify-center">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h3 className="text-sm font-medium text-amber-900 text-center">{item.name}</h3>
            <span className="text-xs text-amber-700 mt-1">
              {item.type === "artifact"
                ? "神器"
                : item.type === "key"
                  ? "钥匙"
                  : item.type === "collectible"
                    ? "收藏品"
                    : "工具"}
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
