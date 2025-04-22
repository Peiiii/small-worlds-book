import React from 'react'
import { useToolbar } from './toolbar-context'
import { Button } from '@/components/ui/button'

export const SharedToolbar: React.FC = () => {
  const { tools } = useToolbar()

  return (
    <div className="absolute -top-10 left-0 z-30 flex flex-row gap-2">
      {tools.map(tool => (
        <Button
          key={tool.id}
          variant="ghost"
          size={tool.text ? "sm" : "icon"}
          className={`group ${tool.text 
            ? "h-8 px-3 py-1" 
            : "w-8 h-8"} bg-amber-100/10 backdrop-blur-sm border border-amber-200/20 hover:bg-amber-200/20 hover:border-amber-300/30 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-md flex items-center gap-1.5`}
          onClick={tool.onClick}
        >
          {tool.icon}
          {tool.text && (
            <span className="text-xs text-amber-800/70">{tool.text}</span>
          )}
          {tool.tooltip && !tool.text && (
            <span className="sr-only">{tool.tooltip}</span>
          )}
        </Button>
      ))}
    </div>
  )
} 