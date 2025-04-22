import { create } from 'zustand'
import { ReactNode } from 'react'

export type ToolType = {
  id: string
  icon: ReactNode
  onClick: () => void
  tooltip?: string
  text?: string
  priority?: number
  isWorldSpecific?: boolean
}

interface ToolbarState {
  tools: ToolType[]
  sortedTools: ToolType[]
  registerTool: (tool: ToolType) => void
  unregisterTool: (id: string) => void
}

export const useToolbarStore = create<ToolbarState>((set, get) => ({
  tools: [],
  sortedTools: [],

  registerTool: (tool: ToolType) => {
    set((state) => {
      // 避免重复注册
      const filtered = state.tools.filter((t) => t.id !== tool.id)
      // 为世界特定工具设置较高的优先级数字(显示靠后)
      const priority = tool.isWorldSpecific ? (tool.priority || 1000) : (tool.priority || 100)
      const newTools = [...filtered, { ...tool, priority }]
      
      // 计算排序后的工具列表
      const sortedTools = [...newTools].sort((a, b) => {
        // 首先按isWorldSpecific排序，世界特定工具显示在最后
        if (a.isWorldSpecific !== b.isWorldSpecific) {
          return a.isWorldSpecific ? 1 : -1
        }
        // 然后按priority排序
        return (a.priority || 100) - (b.priority || 100)
      })

      return { 
        tools: newTools,
        sortedTools
      }
    })
  },

  unregisterTool: (id: string) => {
    set((state) => {
      const newTools = state.tools.filter((tool) => tool.id !== id)
      
      // 重新计算排序后的工具列表
      const sortedTools = [...newTools].sort((a, b) => {
        if (a.isWorldSpecific !== b.isWorldSpecific) {
          return a.isWorldSpecific ? 1 : -1
        }
        return (a.priority || 100) - (b.priority || 100)
      })

      return { 
        tools: newTools,
        sortedTools
      }
    })
  }
})) 