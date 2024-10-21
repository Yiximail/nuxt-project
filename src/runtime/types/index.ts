export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> | undefined }

export type ClassNameValue =
  | string
  | (string | undefined)[]
  | Record<string, unknown>

export type IconComponent =
  | string
  | {
    class?: string
    name?: string
    svg?: string
    src?: string
  }

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ComponentSlot = any

export interface ReferenceAbleComponent {
  reference: HTMLElement | undefined
}

export type Colors = typeof import("#build/ui.config/colors").default
export type Color = Colors[number]

export type Placement = import("@floating-ui/dom").Placement
export type PopperTrigger =
  | "click"
  | "contextmenu"
  | "hover"
  | "focus"
  | "manual"
  | ("click" | "contextmenu" | "hover" | "focus")[]

export type DragPosition = "before" | "inner" | "after"

export type QuillFormats =
  | "font" /** 字体 */
  | "header" /** 内容级别 */
  | "size" /** 字体大小 */
  | "align" /** 对齐 */
  | "bold" /** 粗体 */
  | "italic" /** 斜体 */
  | "underline" /** 下划线 */
  | "strike" /** 删除线 */
  | "blockquote" /** 引用块 */
  | "link" /** 链接 */
  | "image" /** 图片 */
  | "video" /** 视频 */
  | "list" /** 列表 */
  | "indent" /** 缩进 */
  | "color" /** 文字颜色 */
  | "background" /** 背景颜色 */
  | "clean" /** 清除格式 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type QuillImports = Record<string, any>

export interface ImagePreviewConfig {
  id?: string
  src: string
  /** 图片渲染格式 */
  format?: "webp" | "avif" | "jpeg" | "jpg" | "png" | "gif" | "svg"
}

export type SelectValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | null
  | undefined
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type SelectOption = Record<string, any>

export type CascaderValue = string | number | boolean | null | undefined
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type CascaderItem = Record<string, any>
export interface CascaderOption {
  path: CascaderItem[]
  item: CascaderItem
}
export interface CascaderGenericOption<T> {
  path: T[]
  item: T
}

export type FormValidateStatus =
  | "success"
  | "error"
  | "warning"
  | string
  | undefined
export type FormValidateMessage = string | (() => ComponentSlot) | undefined
export type FormValidateResult =
  | undefined
  | string
  | { status?: FormValidateStatus; message?: FormValidateMessage }
export interface FormItem<T> {
  id: string
  value?: T
  label?: string
  status?: FormValidateStatus
  message?: FormValidateMessage
  validate: () => void
}
export type FormValue =
  | string
  | number
  | boolean
  | SelectValue[]
  | Record<string, unknown>
  | null
  | undefined
export type FormTrigger =
  | "input"
  | "change"
  | "focus"
  | "blur"
  | "safe-blur"
  | "safe-change"
export interface ValidateOptions {
  /** 标签 */
  label?: string
  /** 类型 */
  type: "emits" | "validate"
  /** 是否必填 */
  required?: boolean
  /** 必填错误提示 */
  requiredError?: string
  /** 正则匹配 */
  regexp?: RegExp
  /** 正则匹配错误提示 */
  regexpError?: string
}

export interface MessageConfig {
  /** 颜色 */
  color?: Color
  /** 容器类名 */
  class?: ClassNameValue
  /** 图标 */
  icon?: IconComponent
  /** 标题 */
  title?: string
  /** 内容  */
  message?: string | ((props: { hide: () => void }) => ComponentSlot)
  /** 关闭时长 */
  duration?: number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  footer?: (props: { hide: () => void }) => ComponentSlot
  onClose?: () => void
}

export interface DialogConfig {
  /** 容器类名 */
  class?: ClassNameValue
  /** 图标 */
  icon?: IconComponent
  /** 标题 */
  title?: string
  /** 内容  */
  message?: string | ((props: { hide: () => void }) => ComponentSlot)
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 点击遮罩层关闭 */
  closeOnClick?: boolean
  /** 显示确定按钮 */
  showConfirm?: boolean
  /** 显示取消按钮 */
  showCancel?: boolean
  /** 确定按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮颜色 */
  confirmColor?: Color
  /** 取消按钮颜色 */
  cancelColor?: Color
  header?: (props: { hide: () => void }) => ComponentSlot
  footer?: (props: { hide: () => void }) => ComponentSlot
  onConfirm?: () => void
  onCancel?: () => void
}
export type DialogResult = "confirm" | "cancel" | "close"

export interface NotificationConfig {
  /** 容器类名 */
  class?: ClassNameValue
  /** 图标 */
  icon?: IconComponent
  /** 标题 */
  title?: string
  /** 内容  */
  message?: string | ((props: { hide: () => void }) => ComponentSlot)
  /** 进度条颜色 */
  progressColor?: Color
  /** 关闭时长 */
  duration?: number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  header?: (props: { hide: () => void }) => ComponentSlot
  footer?: (props: { hide: () => void }) => ComponentSlot
  onClose?: () => void
}

export type UploaderStatus = "pending" | "loading" | "success" | "fail"
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type UploadData = any
export interface UploaderItem {
  /** 唯一标识 */
  id: string
  /** 状态 */
  status: UploaderStatus
  /** 百分比 */
  percentage?: number
  /** 文件 */
  file?: File
  /** 地址 */
  src?: string
  /** 文件名 */
  name?: string
  /** 额外数据 */
  data?: UploadData
}
export type UploadFunction = (
  file: File,
  cb: (percentage: number) => void
) => Promise<{ status: "success" | "fail"; data: UploadData } | void>

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type TableData = any
export type TableItem = Record<string, TableData>
export interface TableDragObject<T> {
  row: T
  index: number
}
export interface TableSelectedInfo {
  /** 是否全选 */
  isSelectAll: boolean
  /** 包含的列表，仅有非全选的时候有效 */
  includeList: TableItem[]
  /** 剔除的列表，仅有全选的时候有效 */
  excludeList: TableItem[]
}
export interface TableSelectedGenericInfo<T extends TableItem> {
  /** 是否全选 */
  isSelectAll: boolean
  /** 包含的列表，仅有非全选的时候有效 */
  includeList: T[]
  /** 剔除的列表，仅有全选的时候有效 */
  excludeList: T[]
}

export type TreeValue = string | number | boolean | null | undefined
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type TreeItem = Record<string, any>
export interface TreeObject {
  path: TreeItem[]
  item: TreeItem
}
export interface TreeGenericObject<T> {
  path: T[]
  item: T
}
export interface TreeDragObject<T> {
  parent: T | undefined
  siblings: T[]
  index: number
  item: T
  path: T[]
}

export type StepsStatus = "wait" | "process" | "finish" | "error"

export interface PopperProps {
  /** 是否显示 非undefined则视为手动 */
  modelValue?: boolean
  /** 弹出层类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<typeof import("../ui").default["popper"]>
  /** 是否禁用 */
  disabled?: boolean

  /** 出现之前 */
  beforeShow?: () => void | boolean | Promise<void> | Promise<boolean>
  /** 消失之前 */
  beforeHide?: () => void | boolean | Promise<void> | Promise<boolean>
  /** 点击外部关闭 */
  clickOutsideClose?: boolean

  /** 是否到body */
  toBody?: boolean
  /** 参照元素 */
  reference?: HTMLElement | ReferenceAbleComponent
  /** 触发方式 */
  trigger?: PopperTrigger
  /** hover 和 focus 触发器的开启延迟 */
  openDelay?: number
  /** hover 和 focus 触发器的关闭延迟 */
  closeDelay?: number
  /** 动画时长 */
  duration?: number

  /** 继承reference宽度 */
  inheritWidth?: boolean
  /** 定位策略 */
  strategy?: "absolute" | "fixed"
  /** 位置 */
  placement?: Placement | Placement[]
  /** 位置策略 */
  placementStrategy?: "flip" | "auto"
  /** 边缘冗余距离 */
  padding?: number
  /** 偏移距离 */
  offset?: number
  /** 箭头 */
  arrow?: boolean
  /** 箭头距离边距 */
  arrowPadding?: number

  /** 拦截继承属性，非响应 */
  interceptProps?: boolean
  /** 拦截form校验，非响应 */
  interceptForm?: boolean
}

export type Size = "xl" | "lg" | "md" | "sm" | "xs"
export type UI = typeof import("../ui").default
