"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Save, RefreshCw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { useSound } from "@/shared/hooks/use-sound"

type CharacterType = {
  name: string
  avatar: string
  skinTone: string
  hairColor: string
  hairStyle: number
  eyeColor: string
  accessory: number
}

interface CharacterCreatorProps {
  onClose: () => void
}

export function CharacterCreator({ onClose }: CharacterCreatorProps) {
  const [character, setCharacter] = useState<CharacterType>({
    name: "旅行者",
    avatar: "",
    skinTone: "#f5d0a9",
    hairColor: "#4a3000",
    hairStyle: 1,
    eyeColor: "#3b82f6",
    accessory: 0,
  })
  const { playSound } = useSound()

  useEffect(() => {
    // Load character from localStorage
    const savedCharacter = localStorage.getItem("worldsCharacter")
    if (savedCharacter) {
      try {
        setCharacter(JSON.parse(savedCharacter))
      } catch (e) {
        console.error("Failed to parse saved character", e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("worldsCharacter", JSON.stringify(character))
    playSound("magic")
    onClose()
  }

  const handleRandomize = () => {
    const skinTones = ["#f5d0a9", "#e3b081", "#c68642", "#8d5524", "#503335"]
    const hairColors = ["#4a3000", "#000000", "#6b3e2e", "#c19a6b", "#e6be8a", "#d8c078", "#8e8e8e"]
    const eyeColors = ["#3b82f6", "#10b981", "#8b5cf6", "#6b7280", "#1e3a8a", "#065f46"]

    setCharacter({
      ...character,
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      hairStyle: Math.floor(Math.random() * 5) + 1,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      accessory: Math.floor(Math.random() * 5),
    })

    playSound("magic")
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
          className="bg-amber-50 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-amber-900" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-amber-700 mr-2" />
            <h2 className="text-xl font-bold text-amber-900">角色创建</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Character Preview */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 bg-amber-100 rounded-lg mb-4 flex items-center justify-center relative">
                {/* Character Avatar */}
                <div className="relative">
                  {/* Head */}
                  <div className="w-24 h-24 rounded-full" style={{ backgroundColor: character.skinTone }} />

                  {/* Hair */}
                  <div className="absolute top-0 left-0 w-full">
                    {character.hairStyle === 1 && (
                      <div className="w-24 h-12 rounded-t-full" style={{ backgroundColor: character.hairColor }} />
                    )}
                    {character.hairStyle === 2 && (
                      <div
                        className="w-28 h-8 rounded-t-full -mt-2 -ml-2"
                        style={{ backgroundColor: character.hairColor }}
                      />
                    )}
                    {character.hairStyle === 3 && (
                      <div className="relative">
                        <div className="w-24 h-6 rounded-t-full" style={{ backgroundColor: character.hairColor }} />
                        <div
                          className="absolute top-4 left-16 w-10 h-20 rounded-md"
                          style={{ backgroundColor: character.hairColor }}
                        />
                      </div>
                    )}
                    {character.hairStyle === 4 && (
                      <div className="w-24 h-16 rounded-t-full" style={{ backgroundColor: character.hairColor }} />
                    )}
                    {character.hairStyle === 5 && (
                      <div className="relative">
                        <div className="w-24 h-8 rounded-t-full" style={{ backgroundColor: character.hairColor }} />
                        <div
                          className="absolute top-6 left-2 w-4 h-10"
                          style={{ backgroundColor: character.hairColor }}
                        />
                        <div
                          className="absolute top-6 right-2 w-4 h-10"
                          style={{ backgroundColor: character.hairColor }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Eyes */}
                  <div className="absolute top-10 left-0 w-full flex justify-center space-x-6">
                    <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: character.eyeColor }} />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: character.eyeColor }} />
                    </div>
                  </div>

                  {/* Mouth */}
                  <div className="absolute top-16 left-0 w-full flex justify-center">
                    <div className="w-6 h-2 rounded-full bg-red-400" />
                  </div>

                  {/* Accessories */}
                  {character.accessory === 1 && (
                    <div className="absolute top-6 right-0 w-6 h-6 rounded-full border-2 border-amber-900" />
                  )}
                  {character.accessory === 2 && (
                    <div className="absolute top-8 left-0 w-full flex justify-center">
                      <div className="w-12 h-1 bg-amber-900" />
                    </div>
                  )}
                  {character.accessory === 3 && (
                    <div className="absolute top-0 left-0 w-full flex justify-center">
                      <div className="w-8 h-3 bg-amber-400 rounded-md" />
                    </div>
                  )}
                  {character.accessory === 4 && (
                    <div className="absolute top-10 right-2 w-4 h-4 rounded-full bg-green-500" />
                  )}
                </div>
              </div>

              <Input
                value={character.name}
                onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                className="mb-4 text-center"
                maxLength={12}
                placeholder="输入角色名称"
              />

              <Button variant="outline" className="mb-2 w-full" onClick={handleRandomize}>
                <RefreshCw className="h-4 w-4 mr-2" />
                随机生成
              </Button>

              <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存角色
              </Button>
            </div>

            {/* Character Customization */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>肤色</Label>
                <div className="flex space-x-2">
                  {["#f5d0a9", "#e3b081", "#c68642", "#8d5524", "#503335"].map((color) => (
                    <div
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer ${character.skinTone === color ? "ring-2 ring-amber-600 ring-offset-2" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCharacter({ ...character, skinTone: color })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>发色</Label>
                <div className="flex space-x-2 flex-wrap">
                  {["#4a3000", "#000000", "#6b3e2e", "#c19a6b", "#e6be8a", "#d8c078", "#8e8e8e"].map((color) => (
                    <div
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer mb-2 ${character.hairColor === color ? "ring-2 ring-amber-600 ring-offset-2" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCharacter({ ...character, hairColor: color })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>发型</Label>
                <RadioGroup
                  value={character.hairStyle.toString()}
                  onValueChange={(value) => setCharacter({ ...character, hairStyle: Number.parseInt(value) })}
                  className="flex space-x-2"
                >
                  {[1, 2, 3, 4, 5].map((style) => (
                    <div key={style} className="flex items-center space-x-1">
                      <RadioGroupItem value={style.toString()} id={`hairstyle-${style}`} />
                      <Label htmlFor={`hairstyle-${style}`}>{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>眼睛颜色</Label>
                <div className="flex space-x-2">
                  {["#3b82f6", "#10b981", "#8b5cf6", "#6b7280", "#1e3a8a", "#065f46"].map((color) => (
                    <div
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer ${character.eyeColor === color ? "ring-2 ring-amber-600 ring-offset-2" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCharacter({ ...character, eyeColor: color })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>配饰</Label>
                <RadioGroup
                  value={character.accessory.toString()}
                  onValueChange={(value) => setCharacter({ ...character, accessory: Number.parseInt(value) })}
                  className="flex space-x-2"
                >
                  {[0, 1, 2, 3, 4].map((accessory) => (
                    <div key={accessory} className="flex items-center space-x-1">
                      <RadioGroupItem value={accessory.toString()} id={`accessory-${accessory}`} />
                      <Label htmlFor={`accessory-${accessory}`}>{accessory === 0 ? "无" : accessory}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
