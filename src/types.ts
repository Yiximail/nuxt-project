import type { DeepPartial } from "./runtime/types/build"

import type _ui from "./runtime/ui"

export interface ModuleAppConfig {
  /** 主题色 */
  primary: string
  /** 正反馈颜色 */
  success: string
  /** 警告颜色 */
  warning: string
  /** 负反馈颜色 */
  danger: string
  /** 基础色 */
  natural: string
  /** 颜色列表 */
  colors: string[]
}

export interface ModuleOptions {
  prefix?: string

  /** 主题色 */
  primary?: string
  /** 正反馈颜色 */
  success?: string
  /** 警告颜色 */
  warning?: string
  /** 负反馈颜色 */
  danger?: string
  /** 基础色 */
  natural?: string
  /** 颜色列表 */
  colors?: string[]

  /** 是否监听主题变化 */
  watchTheme?: boolean

  /** UI 配置 */
  ui?: DeepPartial<typeof _ui>
  /** UI 配置合并策略 */
  strategy?: "merge" | "replace"
}
