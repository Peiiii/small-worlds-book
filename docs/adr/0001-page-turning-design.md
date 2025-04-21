# ADR 0001: 页面翻页设计决策

## 状态
已接受

## 背景
当前的书本翻页设计存在以下问题：
1. 翻页按钮位置固定在上方，可能遮挡内容
2. 视觉层次不够突出
3. 交互方式单一
4. 缺乏手势支持
5. 用户体验不够自然

## 决策
采用侧边翻页设计，具体实现包括：
1. 翻页按钮位于页面两侧
2. 使用渐变背景和阴影提升视觉层次
3. 添加悬停动画效果
4. 支持键盘导航
5. 预留手势支持接口

## 后果
### 优点
1. 更符合书籍翻页的自然体验
2. 不会遮挡主要内容
3. 提供更大的点击区域
4. 视觉上更加优雅
5. 实现简单，维护成本低
6. 性能影响小，兼容性好

### 缺点
1. 需要重新设计页面布局
2. 可能需要调整现有动画效果
3. 在窄屏设备上可能需要特殊处理

## 实现细节
```typescript
// 翻页按钮组件
<button
  onClick={handlePrevPage}
  className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-24 md:w-10 md:h-32 bg-gradient-to-r from-amber-100/80 to-transparent z-20 rounded-r-lg hover:from-amber-200/80 transition-all duration-300 flex items-center justify-center group"
  aria-label="Previous page"
>
  <ChevronLeft className="h-5 w-5 text-amber-800/70 group-hover:scale-110 transition-transform" />
</button>

// 键盘导航支持
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevPage()
    if (e.key === 'ArrowRight') handleNextPage()
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

## 后续工作
1. 实现手势支持
2. 添加更多视觉反馈
3. 优化移动端体验
4. 添加暗色模式支持 