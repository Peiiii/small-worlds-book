# ADR 0004: 项目架构重构

## 状态
- 状态：提议
- 创建日期：2024-03-21
- 最后更新：2024-03-21

## 背景
当前项目结构存在以下问题：
1. 目录结构过于扁平，缺乏更深层次的模块化
2. 组件和业务逻辑混合
3. 缺乏清晰的数据流管理
4. 缺乏类型定义和接口规范
5. 缺乏测试目录结构
6. 缺乏国际化支持
7. 缺乏错误处理机制

## 决策
采用功能模块化的架构重构方案，将项目结构重组为以下形式：

```
src/
├── features/           # 按功能模块组织
│   ├── world/         # 世界相关功能
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── character/     # 角色相关功能
│   └── story/         # 故事相关功能
├── shared/            # 共享资源
│   ├── components/    # 通用组件
│   ├── hooks/         # 通用 hooks
│   ├── types/         # 通用类型
│   └── utils/         # 通用工具
├── core/              # 核心功能
│   ├── api/          # API 调用
│   ├── store/        # 状态管理
│   └── config/       # 配置管理
└── styles/            # 样式文件
```

## 文件迁移指南

### 1. 创建新目录结构
```bash
mkdir -p src/{features/{world,character,story}/{components,hooks,types,utils},shared/{components,hooks,types,utils},core/{api,store,config},styles}
```

### 2. 文件迁移映射

#### 2.1 世界系统迁移
```
src/components/worlds/ -> src/features/world/components/
src/components/worlds-3d/ -> src/features/world/components/3d/
src/components/world-transitions/ -> src/features/world/components/transitions/
src/components/worlds-context.tsx -> src/features/world/store/context.tsx
```

#### 2.2 角色系统迁移
```
src/components/character-creator.tsx -> src/features/character/components/creator.tsx
src/components/inventory.tsx -> src/features/character/components/inventory.tsx
```

#### 2.3 故事系统迁移
```
src/components/story-modal.tsx -> src/features/story/components/modal.tsx
src/components/table-of-contents.tsx -> src/features/story/components/contents.tsx
```

#### 2.4 共享资源迁移
```
src/components/ui/ -> src/shared/components/ui/
src/hooks/use-mobile.tsx -> src/shared/hooks/use-mobile.tsx
src/hooks/use-sound.tsx -> src/shared/hooks/use-sound.tsx
src/hooks/use-toast.ts -> src/shared/hooks/use-toast.ts
src/lib/utils.ts -> src/shared/utils/index.ts
src/lib/theme.tsx -> src/shared/utils/theme.tsx
```

#### 2.5 核心功能迁移
```
src/components/toolbar-context.tsx -> src/core/store/toolbar.tsx
src/components/settings.tsx -> src/core/config/settings.tsx
```

#### 2.6 样式迁移
```
src/index.css -> src/styles/index.css
```

### 3. 文件改造步骤

#### 3.1 世界系统
1. 创建类型定义：
```typescript
// src/features/world/types/index.ts
export interface World {
  id: string;
  name: string;
  // ... 其他属性
}

export interface WorldState {
  currentWorld: World | null;
  // ... 其他状态
}
```

2. 创建 hooks：
```typescript
// src/features/world/hooks/use-world.ts
import { useContext } from 'react';
import { WorldContext } from '../store/context';

export const useWorld = () => {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return context;
};
```

3. 迁移组件：
```typescript
// src/features/world/components/World.tsx
import { useWorld } from '../hooks/use-world';
import type { World } from '../types';

export const World: React.FC = () => {
  const { currentWorld } = useWorld();
  // ... 组件实现
};
```

#### 3.2 角色系统
1. 创建类型定义：
```typescript
// src/features/character/types/index.ts
export interface Character {
  id: string;
  name: string;
  // ... 其他属性
}

export interface Inventory {
  items: Item[];
  // ... 其他属性
}
```

2. 创建 hooks：
```typescript
// src/features/character/hooks/use-character.ts
import { useState } from 'react';
import type { Character } from '../types';

export const useCharacter = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  // ... hook 实现
  return { character, setCharacter };
};
```

#### 3.3 故事系统
1. 创建类型定义：
```typescript
// src/features/story/types/index.ts
export interface Story {
  id: string;
  title: string;
  content: string;
  // ... 其他属性
}

export interface StoryState {
  currentStory: Story | null;
  // ... 其他状态
}
```

2. 创建 hooks：
```typescript
// src/features/story/hooks/use-story.ts
import { useContext } from 'react';
import { StoryContext } from '../store/context';

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
```

### 4. 依赖关系处理

#### 4.1 更新导入路径
- 使用相对路径导入
- 使用别名导入（需要在 tsconfig.json 中配置）

#### 4.2 配置路径别名
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@core/*": ["src/core/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

### 5. 测试迁移
1. 为每个功能模块创建测试目录：
```
src/features/world/__tests__/
src/features/character/__tests__/
src/features/story/__tests__/
```

2. 迁移现有测试：
```
src/components/__tests__/worlds.test.tsx -> src/features/world/__tests__/world.test.tsx
```

### 6. 文档更新
1. 更新 README.md
2. 为每个功能模块创建 README.md
3. 更新组件文档

## 迁移顺序
1. 创建新目录结构
2. 迁移类型定义
3. 迁移 hooks
4. 迁移组件
5. 迁移测试
6. 更新文档

## 注意事项
1. 保持向后兼容
2. 确保测试覆盖
3. 保持代码质量
4. 及时更新文档
5. 进行代码审查

## 回滚计划
1. 保存当前代码的备份
2. 记录所有修改
3. 准备回滚脚本
4. 设置回滚检查点

## 结论
这个重构方案通过模块化的方式重新组织代码，提高了代码的可维护性和可扩展性。虽然需要一定的改造成本，但长期来看是值得的。 