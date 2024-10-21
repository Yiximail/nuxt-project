import type {
  ClassNameValue,
  ComponentSlot,
  DragPosition,
  ImagePreviewConfig,
  SelectOption,
  CascaderItem,
  CascaderOption,
  ValidateOptions,
  FormValidateResult,
  FormTrigger,
  TableItem,
  TableDragObject,
  TreeObject,
  TreeItem,
  TreeDragObject,
  StepsStatus
} from "./index"

export interface ScrollbarInjection {
  /** 滚动条元素 */
  scrollbar: import("vue").Ref<HTMLElement | undefined>
}

export interface PopperInjection {
  setPopper: (id: string) => void
  removePopper: (id: string) => void
}

export interface ImagePreviewInjection {
  show: (id?: string) => void
  hide: () => void
  setImage: (config: ImagePreviewConfig) => void
  removeImage: (id: string) => void
}

export interface FieldsetInjection {
  contentClass: import("vue").Ref<string>
  container: import("vue").Ref<HTMLElement | undefined>
}

export interface SelectOptionsInjection {
  /** 选项列表 */
  options: import("vue").Ref<SelectOption[]>
  /** 判断值的key name */
  keyName: import("vue").Ref<string>
  /** 显示名的key name */
  labelName: import("vue").Ref<string>
  /** 添加选项 */
  addOption: (option: SelectOption) => void
  /** 删除选项 */
  removeOption: (option: SelectOption) => void

  /** 插槽 */
  slots: {
    option?: (props: { option: SelectOption }) => ComponentSlot
    prepend?: (props: { option: SelectOption }) => ComponentSlot
    label?: (props: { option: SelectOption }) => ComponentSlot
    append?: (props: { option: SelectOption }) => ComponentSlot
  }
}
export interface SelectSelectInjection {
  /** 已选值 */
  selected: import("vue").Ref<SelectOption[]>
  /** 禁用选项 */
  disabledOption: import("vue").Ref<(option: SelectOption) => boolean>
  /** 选择 */
  selectHandle: (option: SelectOption) => void
  /** 取消选择 */
  unselectHandle: (option: SelectOption) => void
}

export interface CascaderOptionsInjection {
  /** 是否为多选 */
  multiple: boolean

  /** 激活项列表 */
  activedList: import("vue").Ref<CascaderItem[]>
  /** 更新index列表 */
  updateActivedList: (level: number, option: CascaderItem) => void

  /** 选项 */
  optionsList: import("vue").Ref<{ key: CascaderValue; list: CascaderItem[] }[]>
  /** 平铺选项 */
  flatOptions: import("vue").Ref<CascaderOption[]>

  /** 判断值的key name */
  keyName: import("vue").Ref<string>
  /** 显示名的key name */
  labelName: import("vue").Ref<string>
  /** 子选项的key name */
  childrenName: import("vue").Ref<string>
  /** 判断是否能选择非最末级 */
  checkStrictly: import("vue").Ref<boolean>
  /** 显示最高级数 */
  maxlevel: import("vue").Ref<number>

  /** 插槽 */
  slots: {
    option?: (props: { option: CascaderOption }) => ComponentSlot
    prepend?: (props: { option: CascaderOption }) => ComponentSlot
    label?: (props: { option: CascaderOption }) => ComponentSlot
    append?: (props: { option: CascaderOption }) => ComponentSlot
  }
}
export interface CascaderSelectInjection {
  /** 已选项 */
  // selected: import("vue").Ref<CascaderOption[]>
  /** 获取最后一个已选 */
  getLastSelected: () => CascaderOption | undefined
  /** 是否已选 */
  isSelected: (option: CascaderOption) => boolean
  /** 已选子项数量 */
  getChildrenSelectedCount: (option: CascaderOption) => number
  /** 禁用选项 */
  disabledOption: import("vue").Ref<(option: CascaderOption) => boolean>

  /** 选择 */
  selectHandle: (option: CascaderOption) => void
  /** 取消选择 */
  unselectHandle: (option: CascaderOption) => void
}

export interface FormInjectionItem {
  /** 表单项id */
  id: string
  /** 表单项标签 */
  label: string | undefined
  /** 表单项校验 */
  validate: (type?: "emits" | "validate") => Promise<boolean>
  /** 表单项清除 */
  clearValidate: () => void
  /** 滚动到视角 */
  scrollIntoView: () => void
}
export interface FormInjection {
  /** 添加表单项 */
  addFormItem: (item: FormInjectionItem) => void
  /** 更新label */
  updateLabel: (id: string, label: string | undefined) => void
  /** 移除表单项 */
  removeFormItem: (id: string) => void

  /** 表单校验 */
  validate: () => Promise<boolean>
  /** 清除校验 */
  clearValidate: () => void
}

export interface FormItemInjectionItem {
  /** 表单项id */
  id: string
  /** 表单项校验 */
  validate: (options: ValidateOptions) => Promise<FormValidateResult>
  /** 重置校验 */
  resetValidate: () => void
  /** 激活 */
  active?: () => void
}
export interface FormItemInjection {
  /** 注册表单输入项 */
  setItem: (item: FormItemInjectionItem) => void
  /** 删除表单输入项 */
  removeItem: (id: string) => void

  emits: (event: FormTrigger) => void
}

export interface TabsInjection {
  /** 当前激活项 */
  actived: import("vue").Ref<string | number | undefined>
  /** 更新激活项 */
  setActived: (
    key: string | number | undefined,
    content?: import("vue").VNode
  ) => void
  /** 更新激活元素 */
  updateElement: (element: HTMLElement | undefined) => void
}

export interface DropdownInjection {
  /** 是否显示弹窗 */
  isShowPopper: import("vue").Ref<boolean>
  /** 是否点击关闭 */
  clickClose: import("vue").Ref<boolean>
  /** 收起 */
  hidePopper: () => void
}

export interface TableColumnClasses {
  /** 表头行类 */
  headRow: string
  /** 表头单元格类 */
  headCell: string
  /** 表头内容 */
  headContent: string
  /** 表体行类 */
  bodyRow: string
  /** 表体单元格类 */
  bodyCell: string
  /** 阴影容器类 */
  shadowContainer: string
  /** 左阴影类 */
  leftShadow: string
  /** 右阴影类 */
  rightShadow: string
  /** 拖拽中类 */
  dragover: {
    container: string
    before: string
    inner: string
    after: string
  }
}
export interface TableColumn {
  // 外部接收字段
  /** 表头，唯一，默认为head显示内容 */
  label: string
  /** 类型 */
  type: "default" | "select" | "drag"
  /** 列宽度 */
  width?: string
  /** 固定位置 */
  fixed?: "left" | "right"
  /** 默认是否显示 */
  show?: boolean
  /** 显示字段 */
  prop?: string
  /** 排序的sort key */
  sortKey?: string
  /** 头部类 */
  headCellClass?: ClassNameValue
  /** 头部容器类 */
  headContentClass?: ClassNameValue
  /** 表体单元格类 */
  bodyCellClass?: ClassNameValue

  // 内部使用字段
  /** 实际宽度 */
  realWidth?: number
  /** 固定距离 */
  fixedDistance?: number
  /** 固定zindex */
  fixedZindex?: number
  /** 显示阴影 */
  shadow?: boolean
  /** 阴影样式 */
  shadowStyle?: import("vue").CSSProperties

  /** 插槽 */
  slots: {
    head?: () => ComponentSlot
    default?: (props: { row: TableItem }) => ComponentSlot
  }
}
export interface TableColumnControl {
  /** 表头，唯一，对应列名 */
  label: string
  /** 是否显示 */
  show?: boolean
  /** 固定位置 */
  fixed?: "left" | "right"
  /** 列宽度 */
  width?: string
}
export interface TableInjection {
  /** 表格类 */
  classes: import("vue").Ref<TableColumnClasses>
  /** 左阴影 */
  rightShadowIndex: import("vue").Ref<number>
  /** 右阴影 */
  leftShadowIndex: import("vue").Ref<number>

  /** 总数 */
  total: import("vue").Ref<number>

  /** 显示的列 */
  displayColumns: import("vue").Ref<TableColumn[]>
  /** 列 */
  columns: import("vue").Ref<TableColumn[]>
  /** 设置列 */
  setColumn: (column: TableColumn) => void
  /** 删除列 */
  removeColumn: (id: string) => void
  /** 控制列表 */
  controlList: import("vue").Ref<TableColumnControl[]>
  /** 更新控制列表 */
  updateControlList: (list: TableColumnControl[]) => void
  /** 重置控制列表 */
  resetControlList: () => void
  /** 移动 */
  moveColumn: (from: string, to: string, position: DragPosition) => void
  /** 变更show */
  changeShow: (label: string, val: TableColumnControl["show"]) => void
  /** 变更fixed */
  changeFixed: (label: string, fixed: TableColumnControl["fixed"]) => void
  /** 变更宽度 */
  changeWidth: (label: string, width?: TableColumnControl["width"]) => void

  /** 选项判断值 */
  selectKey: import("vue").Ref<string | undefined>
  /** 是否选择全部 */
  isSelectedAll: import("vue").Ref<boolean | undefined>
  /** 已选的key列表 */
  selectedKeyList: import("vue").Ref<string[] | undefined>
  /** 判断是否已选 */
  isSelected: (key: string) => boolean
  /** 切换一项的选择 */
  toggleSelect: (val: boolean, row: TableItem) => void
  /** 选择所有数据 */
  selectAll: () => void
  /** 取消选择所有数据 */
  unselectAll: () => void
  /** 选择当前页 */
  selectPage: () => void
  /** 取消选择当前页 */
  unselectPage: () => void

  /** 排序字段 */
  sortKey: import("vue").Ref<string | undefined>
  /** 排序顺序 */
  sortOrder: import("vue").Ref<"asc" | "desc">
  /** 更新排序字段 */
  updateSortKey: (key: string) => void
  /** 更新排序顺序 */
  updateSortOrder: (order: "asc" | "desc") => void

  /** 鼠标移入单元格 v-table-ellipsis */
  mouseenterCell: (el: HTMLElement, row: TableItem, column: TableColumn) => void
  /** 鼠标移出单元格 v-table-ellipsis */
  mouseleaveCell: (el: HTMLElement) => void
  /** 鼠标移入行 v-table-hover */
  mouseenterRow: (el: HTMLElement, row: TableItem) => void
  /** 鼠标移出行 v-table-hover */
  mouseleaveRow: (el: HTMLElement) => void
  /** 拖拽中的行 */
  draggingRow: import("vue").Ref<TableDragObject<TableItem> | undefined>
  /** 拖拽至 */
  dragoverRow: import("vue").Ref<TableDragObject<TableItem> | undefined>
  /** 拖拽位置 */
  dragoverPosition: import("vue").Ref<DragPosition | undefined>

  /** 刷新 */
  refresh: () => void
}
export type TableHeadInjection = {
  column: import("vue").Ref<TableColumn>
}

export interface TreeItemClasses {
  item: string
  block: string
  button: string
  drag: string
  checkbox: string
  arrow: string
  arrowActive: string
  label: string
  dragover: {
    item: string
    before: string
    inner: string
    after: string
  }
}
export interface TreeInjection {
  /** 节点的类 */
  classes: import("vue").Ref<TreeItemClasses>

  /** 判断值的key name */
  keyName: import("vue").Ref<string>
  /** 显示名的key name */
  labelName: import("vue").Ref<string>
  /** 子选项的key name */
  childrenName: import("vue").Ref<string>
  /** 最高级数 */
  maxlevel: import("vue").Ref<number>

  /** 展开的列表 */
  expandedKeys: import("vue").Ref<unknown[]>
  /** 展开中 */
  expandingKey: import("vue").Ref<unknown>
  /** 关闭中 */
  collapsingKey: import("vue").Ref<unknown>
  /** 切换展开 */
  toggleExpand: (key: unknown) => void

  /** 平铺选项 */
  flatObjectList: import("vue").Ref<TreeObject[]>

  /** 是否可选择 */
  selectable: import("vue").Ref<boolean>
  /** 是否已选 */
  isSelected: (option: TreeObject) => boolean
  /** 已选子项数量 */
  getChildrenSelectedCount: (option: TreeObject) => number
  /** 选择 */
  selectHandle: (option: TreeObject) => void
  /** 取消选择 */
  unselectHandle: (option: TreeObject) => void

  /** 是否可拖拽 */
  draggable: import("vue").Ref<boolean>
  /** 拖拽中 */
  draggingObject: import("vue").Ref<TreeDragObject<TreeItem> | undefined>
  /** 拖拽至 */
  dragoverObject: import("vue").Ref<TreeDragObject<TreeItem> | undefined>
  /** 拖拽位置 */
  dragoverPosition: import("vue").Ref<DragPosition | undefined>
}

export interface DescriptionItem {
  /** 唯一标识 */
  id: string
  /** 标签 */
  label: string
  /** 占列数 */
  span: number
  /** 内容 */
  content: string
  /** item容器样式 */
  itemClass?: ClassNameValue
  /** label容器样式 */
  labelClass?: ClassNameValue
  /** content容器样式 */
  contentClass?: ClassNameValue
  /** 插槽 */
  slots: {
    label?: () => ComponentSlot
    content?: () => ComponentSlot
  }
}
export interface DescriptionInjection {
  /** 设置item */
  setItem: (item: DescriptionItem) => void
  /** 删除item */
  removeItem: (id: string) => void
}

export interface MenuItemClasses {
  container: string
  label: string
  arrow: string
  actived: {
    container: string
    label: string
    arrow: string
  }
  expanded: {
    container: string
    label: string
    arrow: string
  }
  disabled: {
    container: string
    label: string
    arrow: string
  }
}
export interface MenuInjection {
  /** menu类 */
  classes: import("vue").Ref<MenuItemClasses>
  /** 是否展开 */
  menuExpanded: import("vue").Ref<boolean>
  /** 当前激活列表 */
  activedList: import("vue").Ref<string[]>
  /** 更新激活 */
  updateActived: (id: string, value: boolean) => void
  /** 当前展开列表 */
  expandedList: import("vue").Ref<string[]>
  /** 更新展开 */
  updateExpanded: (id: string, value: boolean) => void
  /** 激活的路由 */
  currentRoute: import("vue").Ref<
  import("vue-router").RouteLocationNormalizedLoadedGeneric | undefined
  >
  /** 子级继承父级激活 */
  childInherit: import("vue").Ref<boolean>
  /** 子级激活，父级也激活 */
  parentActive: import("vue").Ref<boolean>
}
export interface MenuItemInjection {
  /** 级别 */
  level: import("vue").Ref<number>
  /** 父级激活 */
  parentActived: import("vue").Ref<boolean>
  /** 设置子菜单 */
  setMenu: (id: string, to?: import("vue-router").RouteLocationRaw) => void
  /** 移除子菜单 */
  removeMenu: (id: string) => void
}

export interface StepsInjection {
  /** 当前项 */
  current: import("vue").Ref<number>
  /** 当前项状态 */
  currentStatus: import("vue").Ref<StepsStatus>
  /** 类型 */
  type: import("vue").Ref<"horizontal" | "vertical">
}

export interface TimelineInjection {
  /** 类型 */
  type: import("vue").Ref<"horizontal" | "vertical">
  /** 线类型 */
  line: import("vue").Ref<"solid" | "dashed">
}
