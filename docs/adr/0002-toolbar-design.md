# ADR 0002: 工具栏设计决策

## 状态
已接受

## 背景
当前的工具栏设计存在以下问题：
1. 按钮位置和大小不合适，遮挡了主要内容
2. 视觉层次不够精致
3. 交互体验不够优雅
4. 缺乏一致的设计语言
5. 在移动端体验不佳
6. 与内容距离过远，缺乏上下文关联
7. 提示信息与其他元素视觉冲突

## 设计方案

### 方案一：优雅的宝石式设计
设计理念：
- 借鉴 macOS 的简洁和优雅
- 融入书本的精致感
- 使用宝石切割效果
- 半透明玻璃拟态

具体设计：
1. 按钮样式：
   - 六边形宝石切割形状
   - 半透明玻璃效果背景
   - 精致的图标设计
   - 优雅的悬停动画

2. 视觉风格：
   - 背景：`bg-amber-100/10 backdrop-blur-sm`
   - 边框：`border border-amber-200/20`
   - 悬停：`hover:bg-amber-200/20 hover:border-amber-300/30`
   - 阴影：`shadow-[0_2px_8px_rgba(0,0,0,0.1)]`
   - 过渡：`transition-all duration-300`

3. 交互设计：
   - 悬停时轻微放大
   - 点击时宝石切割面反光
   - 优雅的提示动画

### 方案二：复古书签式设计
设计理念：
- 借鉴传统书本的书签设计
- 现代简约风格
- 优雅的折叠效果
- 精致的装饰元素

具体设计：
1. 按钮样式：
   - 书签形状
   - 优雅的折叠角
   - 精致的装饰线
   - 复古的纹理

2. 视觉风格：
   - 背景：`bg-amber-50/80`
   - 边框：`border-r-2 border-amber-200`
   - 悬停：`hover:bg-amber-100/90`
   - 阴影：`shadow-[2px_2px_4px_rgba(0,0,0,0.1)]`
   - 过渡：`transition-all duration-300`

3. 交互设计：
   - 悬停时轻微展开
   - 点击时优雅折叠
   - 复古的提示效果

### 方案三：魔法卷轴式设计
设计理念：
- 借鉴魔法卷轴的设计元素
- 神秘优雅的风格
- 卷曲的纸张效果
- 魔法光效

具体设计：
1. 按钮样式：
   - 卷轴形状
   - 优雅的卷曲效果
   - 魔法光效装饰
   - 精致的图标

2. 视觉风格：
   - 背景：`bg-amber-50/60`
   - 边框：`border border-amber-200/30`
   - 悬停：`hover:bg-amber-100/70`
   - 阴影：`shadow-[0_2px_8px_rgba(251,191,36,0.2)]`
   - 过渡：`transition-all duration-300`

3. 交互设计：
   - 悬停时轻微展开
   - 点击时魔法光效
   - 优雅的提示动画

### 方案四：窗口外毛玻璃式设计（推荐）
设计理念：
- 借鉴现代应用的毛玻璃效果
- 简洁而不干扰内容
- 将交互元素与内容分离
- 精致的方形按钮

具体设计：
1. 按钮样式：
   - 方形按钮
   - 毛玻璃效果背景
   - 精致的图标设计
   - 优雅的悬停动画

2. 视觉风格：
   - 背景：`bg-amber-100/10 backdrop-blur-sm`
   - 边框：`border border-amber-200/20`
   - 悬停：`hover:bg-amber-200/20 hover:border-amber-300/30`
   - 阴影：`shadow-[0_2px_8px_rgba(0,0,0,0.1)]`
   - 过渡：`transition-all duration-300`

3. 交互设计：
   - 悬停时显示提示文字
   - 完全不干扰内容区域
   - 优雅的提示动画

## 布局方案

### 方案一：macOS 风格左上角布局
设计特点：
- 类似 macOS 窗口的左上角操作按钮排列
- 横向排列的按钮组
- 保持一致的间距和大小
- 位于书本的左上角

### 方案二：双角布局
设计特点：
- 左上角和右上角各放置一个按钮
- 平衡书本两侧的视觉重量
- 按功能区分摆放位置
- 保持一致的设计风格

### 方案三：书脊布局
设计特点：
- 模拟真实书籍的装订位置
- 按钮垂直排列在左侧"书脊"位置
- 创造出更真实的书本感
- 突出内容区域的完整性

### 方案四：浮动角落布局
设计特点：
- 按钮置于四个角落
- 根据功能重要性分配位置
- 更均匀分布的视觉重量
- 避免内容中心区域干扰

### 方案五：窗口外布局（推荐）
设计特点：
- 按钮完全位于书本窗口之外
- 不占用内容空间
- 横向排列在左上角
- 最大程度保持内容的完整性

## 决策
采用窗口外毛玻璃式设计（方案四）和窗口外布局（布局方案五），具体实现包括：
1. 按钮放置在书本窗口之外的左上角
2. 使用方形毛玻璃按钮
3. 横向排列两个按钮
4. 优雅的悬停和提示效果
5. 支持键盘导航和触觉反馈

## 后果
### 优点
1. 不会干扰主要内容区域
2. 简洁而精致的视觉效果
3. 优雅的毛玻璃交互体验
4. 视觉上更加现代和高级
5. 布局清晰，不造成视觉混乱
6. 性能影响小，兼容性好

### 缺点
1. 在极小屏幕上可能需要特殊处理
2. 移动端体验需要进一步优化
3. 可能需要添加额外的提示元素

## 实现细节
```typescript
// 工具栏组件
<div className="absolute -top-10 left-0 z-30 flex flex-row gap-2">
  <Button
    variant="ghost"
    size="icon"
    className="group w-8 h-8 bg-amber-100/10 backdrop-blur-sm border border-amber-200/20 hover:bg-amber-200/20 hover:border-amber-300/30 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-md"
    onClick={() => setShowToc(true)}
  >
    <BookOpen className="h-4 w-4 text-amber-800/70" />
    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-amber-100/80 px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
      Contents
    </span>
  </Button>
  
  <Button
    variant="ghost"
    size="icon"
    className="group w-8 h-8 bg-amber-100/10 backdrop-blur-sm border border-amber-200/20 hover:bg-amber-200/20 hover:border-amber-300/30 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-md"
    onClick={() => setShowStory(true)}
  >
    <Info className="h-4 w-4 text-amber-800/70" />
    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-amber-100/80 px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
      Story
    </span>
  </Button>
</div>
```

## 后续工作
1. 优化移动端体验
2. 添加更多交互反馈
3. 实现暗色模式支持
4. 添加手势支持
5. 优化可访问性 