import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react'

export type ToolType = {
  id: string
  icon: ReactNode
  onClick: () => void
  tooltip?: string
  text?: string    // 添加文本支持
  priority?: number  // 用于排序，数字越小优先级越高
  isWorldSpecific?: boolean  // 标记是否为世界特定工具
}

type ToolbarContextType = {
  tools: ToolType[]
  registerTool: (tool: ToolType) => void
  unregisterTool: (id: string) => void
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined)

export const ToolbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<ToolType[]>([])

  const registerTool = useCallback((tool: ToolType) => {
    setTools(prev => {
      // 避免重复注册
      const filtered = prev.filter(t => t.id !== tool.id)
      // 为世界特定工具设置较高的优先级数字(显示靠后)
      const priority = tool.isWorldSpecific ? (tool.priority || 1000) : (tool.priority || 100)
      return [...filtered, { ...tool, priority }]
    })
  }, [])

  const unregisterTool = useCallback((id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id))
  }, [])
  
  // 使用useMemo缓存排序后的工具列表
  const sortedTools = useMemo(() => {
    return [...tools].sort((a, b) => {
      // 首先按isWorldSpecific排序，世界特定工具显示在最后
      if (a.isWorldSpecific !== b.isWorldSpecific) {
        return a.isWorldSpecific ? 1 : -1
      }
      // 然后按priority排序
      return (a.priority || 100) - (b.priority || 100)
    })
  }, [tools])

  return (
    <ToolbarContext.Provider value={{ tools: sortedTools, registerTool, unregisterTool }}>
      {children}
    </ToolbarContext.Provider>
  )
}

export const useToolbar = () => {
  const context = useContext(ToolbarContext)
  if (!context) {
    throw new Error('useToolbar must be used within a ToolbarProvider')
  }
  return context
} 