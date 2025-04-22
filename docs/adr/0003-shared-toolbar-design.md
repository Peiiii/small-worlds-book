# ADR 0003: 共享工具栏设计

## 状态
已接受

## 背景
当前应用中的工具按钮（如目录、故事、3D视图切换等）存在以下问题：
1. 每个组件单独实现自己的工具按钮，导致样式和位置不一致
2. 代码重复，维护困难
3. 工具功能与世界内容紧耦合
4. 缺乏统一的交互模式
5. 难以扩展新的工具功能
6. 按钮缺乏文本说明，纯图标不够直观

## 设计方案

### 方案一：全局工具栏组件（高阶组件模式）
设计思路：
- 创建一个通用的`WorldToolbar`组件
- 使用高阶组件模式，让每个世界传入自定义工具
- 统一处理布局、样式和交互

优点：
- 简单直接
- 容易理解

缺点：
- 组件树中的props钻取问题
- 难以动态更新工具
- 跨组件管理工具困难

### 方案二：上下文提供者模式（Context API）
设计思路：
- 使用React Context API创建工具栏上下文
- 各世界通过上下文注册/修改工具
- 在Book组件层面统一渲染所有工具

优点：
- 避免props钻取
- 动态注册/注销工具
- 符合React数据流
- 解耦工具与使用者

缺点：
- 增加额外的上下文状态
- 需要处理工具排序和去重

### 方案三：事件驱动模型（发布/订阅模式）
设计思路：
- 创建事件总线，各组件通过事件通信
- 工具栏组件订阅工具变化事件
- 世界组件发布工具注册/取消事件

优点：
- 完全解耦
- 适合复杂系统

缺点：
- 状态追踪困难
- 调试复杂
- 学习曲线高

### 方案四：配置驱动模式（声明式API）
设计思路：
- 每个世界组件声明所需工具配置
- Book组件读取当前世界的工具配置
- 统一渲染工具栏

优点：
- 声明式编程
- 配置清晰

缺点：
- 不适合动态变化的工具
- 难以响应状态变化

## 决策
采用方案二（上下文提供者模式），具体实现包括：
1. 创建`ToolbarContext`提供工具状态管理
2. 实现`SharedToolbar`组件，统一渲染工具按钮
3. 使用`useToolbar`钩子在各组件中注册/注销工具
4. 支持工具排序和优先级机制，保证世界特定工具显示在末尾
5. 支持工具文本显示，提高可读性
6. 保持工具UI风格统一

## 后果
### 优点
1. 统一的工具按钮位置和样式
2. 各组件可独立注册自己的工具
3. 避免了代码重复
4. 降低了维护成本
5. 便于添加新功能
6. 提高了用户体验一致性
7. 支持文本与图标结合，提高可读性

### 缺点
1. 增加了代码复杂度
2. 引入了额外的状态管理
3. 需要注意工具之间的冲突管理
4. 文本显示增加了工具栏宽度，需要处理空间限制

## 实现细节
```typescript
// 工具类型定义
export type ToolType = {
  id: string
  icon: ReactNode
  onClick: () => void
  tooltip?: string
  text?: string    // 添加文本支持
  priority?: number  // 用于排序，数字越小优先级越高
  isWorldSpecific?: boolean  // 标记是否为世界特定工具
}

// 工具栏上下文
const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined)

export const ToolbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<ToolType[]>([])

  const registerTool = (tool: ToolType) => {
    setTools(prev => {
      // 避免重复注册
      const filtered = prev.filter(t => t.id !== tool.id)
      // 为世界特定工具设置较高的优先级数字(显示靠后)
      const priority = tool.isWorldSpecific ? (tool.priority || 1000) : (tool.priority || 100)
      return [...filtered, { ...tool, priority }]
    })
  }

  const unregisterTool = (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id))
  }
  
  // 对工具按优先级排序
  useEffect(() => {
    setTools(prev => [...prev].sort((a, b) => (a.priority || 100) - (b.priority || 100)))
  }, [tools.length])

  return (
    <ToolbarContext.Provider value={{ tools, registerTool, unregisterTool }}>
      {children}
    </ToolbarContext.Provider>
  )
}

// 共享工具栏组件
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
```

## 后续工作
1. 添加工具分组功能
2. 实现响应式工具栏布局
3. 增强工具交互动画
4. 添加键盘快捷键支持
5. 考虑添加工具条件显示逻辑
6. 优化移动端显示策略，处理文本按钮在小屏幕上的显示 