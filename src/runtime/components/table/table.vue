<template>
  <div
    ref="containerRef"
    :class="['group/container', containerClass]"
    :style="tableStyle"
  >
    <div ref="scrollerRef" :class="ui.scroller" @scroll="scrollHandle">
      <table ref="tableRef" :class="ui.table">
        <thead ref="theadRef" :class="ui.tableHead">
          <v-table-head-row @resize="updateFixedDistance" />
        </thead>
        <tbody :class="ui.tableBody">
          <v-table-body-row
            v-for="(row, index) in data"
            :key="index"
            :row="row"
            :index="index"
            :container="scrollerRef"
            @dragstart="dragstartHandle"
            @dragover="dragoverHandle"
            @dragend="dragendHandle"
          >
            <template v-if="$slots.hover" #hover>
              <slot name="hover" :row="row" />
            </template>
          </v-table-body-row>
        </tbody>
      </table>
    </div>
    <transition name="v-fade">
      <div
        v-if="loading"
        :class="ui.loading"
        :style="{ backdropFilter: 'blur(3px)' }"
      >
        <v-loading :text="loadingText" />
      </div>
      <div v-else-if="!data.length" :class="ui.empty">
        <v-empty :text="emptyText" />
      </div>
    </transition>
    <v-scrollbar-bar
      ref="verticalRef"
      :class="ui.verticalScrollbar"
      type="vertical"
      @scroll-to="scrollTo"
    />
    <v-scrollbar-bar
      ref="horizontalRef"
      :class="ui.horizontalScrollbar"
      type="horizontal"
      @scroll-to="scrollTo"
    />
    <v-table-ellipsis ref="ellipsisRef" />
    <v-table-hover
      v-if="$slots.hover"
      ref="hoverRef"
      :class="ui.hover"
      :scroller="scrollerRef"
      :hover-slot="hoverSlot"
    />
    <v-table-column-controller v-if="isMouned && controlList" />
    <div class="hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts" generic="GenericItem extends TableItem">
import VScrollbarBar from "../scrollbar/scrollbar-bar.vue"
import VLoading from "../loading/loading.vue"
import VEmpty from "../empty/empty.vue"
import VTableHeadRow from "./table-head-row.vue"
import VTableBodyRow from "./table-body-row.vue"
import VTableColumnController from "./table-column-controller.vue"
import VTableEllipsis from "./table-ellipsis.vue"
import VTableHover from "./table-hover.vue"
import useScrollbar from "../../composables/use-scrollbar"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TABLE_INJECTION } from "../../utils/injection-keys"
import {
  defineSlots,
  ref,
  computed,
  watch,
  toRef,
  onMounted,
  onBeforeUnmount,
  provide
} from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  TableSelectedGenericInfo,
  TableDragObject,
  DragPosition,
  TableItem,
  TableColumnControl,
  ComponentSlot,
  UI
} from "../../types"
import type { TableColumn } from "../../types/injections"
import type { CSSProperties } from "vue"

const containerRef = ref<HTMLDivElement>()
const scrollerRef = ref<HTMLDivElement>()
const tableRef = ref<HTMLTableElement>()
const theadRef = ref<HTMLTableSectionElement>()
const verticalRef = ref<InstanceType<typeof VScrollbarBar>>()
const horizontalRef = ref<InstanceType<typeof VScrollbarBar>>()
const ellipsisRef = ref<InstanceType<typeof VTableEllipsis>>()
const hoverRef = ref<InstanceType<typeof VTableHover>>()

const props = withDefaults(
  defineProps<{
    /** 选择列表 */
    selectedList?: GenericItem[]
    /** 选择信息 */
    selectedInfo?: TableSelectedGenericInfo<GenericItem>
    /** 选项判断值 */
    selectKey?: keyof GenericItem
    /** 控制列表 */
    controlList?: TableColumnControl[]
    /** 数据 */
    data: GenericItem[]
    /** 总数 */
    total?: number
    /** 默认排序字段 */
    sortKey?: string
    /** 排序顺序 */
    sortOrder?: "asc" | "desc"
    /** 空列表提示 */
    emptyText?: string
    /** 加载中 */
    loading?: boolean
    /** 加载提示 */
    loadingText?: string
    /** 拖拽排序 */
    draggable?: boolean
    /** 是否可放置 */
    droppable?:(
      dragging: TableDragObject<GenericItem>,
      target: TableDragObject<GenericItem>,
      position: DragPosition
    ) => boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["table"]>
  }>(),
  {
    selectedList: undefined,
    selectedInfo: undefined,
    controlList: undefined,
    selectKey: undefined,
    total: 0,
    sortKey: undefined,
    sortOrder: "desc",
    emptyText: "暂无数据",
    loading: false,
    loadingText: "加载中",
    draggable: false,
    droppable: () => true,
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  "update:selected-list": [list: GenericItem[]]
  "update:selected-info": [info: TableSelectedGenericInfo<GenericItem>]
  "update:sort-key": [key: string]
  "update:control-list": [list: TableColumnControl[]]
  "update:sort-order": [order: "asc" | "desc"]
  dragstart: [dragging: TableDragObject<GenericItem>]
  dragover: [
    dragging: TableDragObject<GenericItem>,
    target: TableDragObject<GenericItem>
  ]
  dragend: []
  drop: [
    dragging: TableDragObject<GenericItem>,
    target: TableDragObject<GenericItem>,
    position: DragPosition
  ]
  refresh: []
}>()

const slots = defineSlots<{
  default:() => ComponentSlot
  hover: (props: { row: GenericItem }) => ComponentSlot
}>()
const hoverSlot = computed(
  () => slots.hover as (props: { row: TableItem }) => ComponentSlot
)

const { ui } = useUi("table", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const tableStyle = computed(() => {
  const style: CSSProperties = {}
  style["--table-width"] = `${tableWidth.value}px`
  style["--table-head-height"] = `${tableHeadHeight.value}px`
  style["--table-scroller-width"] = `${scrollerWidth.value}px`
  style["--table-scroller-height"] = `${scrollerHeight.value}px`
  style["--table-head-zindex"] = headZIndex.value
  style["--table-hover-zindex"] = hoverZIndex.value
  return style
})

const { scrollTo } = useScrollbar(scrollerRef, tableRef, {
  verticalRef,
  horizontalRef
})

let scrollLeft: number | undefined
const scrollerWidth = ref(0)
const scrollerHeight = ref(0)
const tableWidth = ref(0)
const tableHeadHeight = ref(0)
const headZIndex = ref(0)
const hoverZIndex = ref(0)
const updateFixedDistance = () => {
  let zIndex = 1
  let left = 0
  for (let i = 0; i < displayColumns.value.length; i += 1) {
    const column = displayColumns.value[i]
    if (column.fixed === "left") {
      column.fixedDistance = left
      left += column.realWidth || 0
    } else if (column.fixed === "right") {
      column.fixedZindex = zIndex
      zIndex += 1
    }
  }
  let right = 0
  for (let i = displayColumns.value.length - 1; i >= 0; i--) {
    const column = displayColumns.value[i]
    if (column.fixed === "right") {
      column.fixedDistance = right
      right += column.realWidth || 0
    } else if (column.fixed === "left") {
      column.fixedZindex = zIndex
      zIndex += 1
    }

    if (column.fixed === "left") {
      column.shadowStyle = {
        left: `${(column.fixedDistance ?? 0) + (column.realWidth ?? 0)}px`,
        zIndex: column.fixedZindex
      }
    } else if (column.fixed === "right") {
      column.shadowStyle = {
        right: `${(column.fixedDistance ?? 0) + (column.realWidth ?? 0)}px`,
        zIndex: column.fixedZindex
      }
    }
  }
  hoverZIndex.value = zIndex
  headZIndex.value = zIndex + 1

  if (updateFrameId) cancelAnimationFrame(updateFrameId)
  // 这里强制其进行检索
  scrollLeft = undefined
  updateFrameId = requestAnimationFrame(updateShadowIndex)
}
onMounted(() => {
  watch(displayColumns, updateFixedDistance)
})

const leftShadowIndex = ref(-1)
const rightShadowIndex = ref(-1)
let updateFrameId: number | undefined
const updateShadowIndex = () => {
  updateFrameId = undefined
  const newScrollLeft = scrollerRef.value?.scrollLeft ?? 0
  if (newScrollLeft === scrollLeft) return
  scrollLeft = newScrollLeft
  if (scrollerWidth.value >= tableWidth.value) {
    leftShadowIndex.value = -1
    rightShadowIndex.value = -1
    return
  }
  if (scrollLeft === undefined) return
  let leftIndex = -1
  let rightIndex = -1
  let left = 0
  let right = 0
  let scrollRight = tableWidth.value - (scrollerWidth.value + scrollLeft)
  scrollRight = Math.floor(scrollRight)
  for (let i = 0; i < displayColumns.value.length; i += 1) {
    if (left >= scrollLeft) break
    const item = displayColumns.value[i]
    if (item.fixed === "left") {
      leftIndex = i
    } else {
      left += item.realWidth ?? 0
    }
  }
  for (let i = displayColumns.value.length - 1; i >= 0; i -= 1) {
    if (right >= scrollRight) break
    const item = displayColumns.value[i]
    if (item.fixed === "right") {
      rightIndex = i
    } else {
      right += item.realWidth ?? 0
    }
  }
  leftShadowIndex.value = leftIndex
  rightShadowIndex.value = rightIndex
}
const scrollHandle = () => {
  if (updateFrameId) cancelAnimationFrame(updateFrameId)
  updateFrameId = requestAnimationFrame(updateShadowIndex)
}
const resizeCallback = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    const val = entry.borderBoxSize[0]
    if (entry.target === scrollerRef.value) {
      scrollerWidth.value = val.inlineSize
      scrollerHeight.value = val.blockSize
    } else if (entry.target === tableRef.value) {
      tableWidth.value = val.inlineSize
    } else if (entry.target === theadRef.value) {
      tableHeadHeight.value = val.blockSize
    }
  }
  if (updateFrameId) cancelAnimationFrame(updateFrameId)
  updateFrameId = requestAnimationFrame(updateShadowIndex)
}
let observerInstance: ResizeObserver | undefined
onMounted(() => {
  observerInstance = new ResizeObserver(resizeCallback)
  if (scrollerRef.value && tableRef.value && theadRef.value) {
    observerInstance.observe(scrollerRef.value)
    observerInstance.observe(tableRef.value)
    observerInstance.observe(theadRef.value)
    requestAnimationFrame(() => {
      if (!scrollerRef.value || !tableRef.value || !theadRef.value) return
      const scrollerRect = scrollerRef.value.getBoundingClientRect()
      scrollerWidth.value = scrollerRect.width
      scrollerHeight.value = scrollerRect.height
      tableWidth.value = tableRef.value.getBoundingClientRect().width
      tableHeadHeight.value = theadRef.value.getBoundingClientRect().height
    })
  }
})
onBeforeUnmount(() => {
  observerInstance?.disconnect()
})

// 这里只生成一次，否则每次都会重新渲染
const dragColumn = ref<TableColumn>({
  label: "dragColumn",
  type: "drag",
  width: "24px",
  realWidth: 24,
  fixed: "left",
  show: true,
  slots: {}
})
const selectColumn = ref<TableColumn>({
  label: "selectColumn",
  type: "select",
  width: "36px",
  realWidth: 36,
  fixed: "left",
  show: true,
  slots: {}
})
const displayColumns = computed(() => {
  const list: TableColumn[] = []
  const dragColumn = columns.value.find((column) => column.type === "drag")
  if (dragColumn) list.push(dragColumn)
  const selectColumn = columns.value.find((column) => column.type === "select")
  if (selectColumn) list.push(selectColumn)
  for (let i = 0; i < _controlList.value.length; i++) {
    const control = _controlList.value[i]
    if (!control.show) continue
    const column = columns.value.find(
      (column) => column.label === control.label
    )
    if (column) {
      list.push({ ...column, fixed: control.fixed, width: control.width })
    }
  }
  return list
})
const columns = computed(() => {
  const list = [...injectionColumns.value]
  if (!list.length) return []
  const key = props.selectKey
  if (props.selectedList || props.selectedInfo) {
    if (!key) {
      console.warn("[v-table] selectKey 需要设置才能使用选择")
    } else {
      list.unshift(selectColumn.value)
    }
  }
  if (props.draggable) list.unshift(dragColumn.value)
  return list
})
const injectionColumns = ref<TableColumn[]>([])
const setColumn = (column: TableColumn) => {
  const item = injectionColumns.value.find(
    (item) => item.label === column.label
  )
  if (item) {
    Object.assign(item, column)
  } else {
    injectionColumns.value.push(column)
  }
}
const removeColumn = (label: string) => {
  const index = injectionColumns.value.findIndex((item) => item.label === label)
  if (index !== -1) {
    injectionColumns.value.splice(index, 1)
  }
}

const _controlList = ref<TableColumnControl[]>([])
const updateControlList = (list: TableColumnControl[]) => {
  const tableList = columns.value.filter((column) => column.type === "default")
  let change = false
  if (list) {
    switch (true) {
      case list.length !== tableList.length:
      case list.some((i) => !tableList.some((c) => c.label === i.label)):
      case tableList.some((c) => !list.some((i) => i.label === c.label)):
        change = true
        break
    }
  }
  if (change) {
    // 这里列表发生了变化，直接初始化
    resetControlList()
  } else {
    _controlList.value = list
    emits("update:control-list", _controlList.value)
  }
}
const resetControlList = () => {
  const tableList = columns.value.filter((column) => column.type === "default")
  _controlList.value = tableList.map((column) => ({
    label: column.label,
    show: column.show,
    fixed: column.fixed,
    width: column.width
  }))
  emits("update:control-list", _controlList.value)
}
const isMouned = ref(false)
onMounted(() => {
  isMouned.value = true
  watch(
    () => props.controlList,
    (val) => {
      if (val) {
        updateControlList(val)
      } else {
        resetControlList()
      }
    },
    { immediate: true }
  )
})
const moveColumn = (from: string, to: string, position: DragPosition) => {
  const list = [..._controlList.value]
  const fromIndex = list.findIndex((item) => item.label === from)
  const toIndex = list.findIndex((item) => item.label === to)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return
  if (position === "before") {
    const item = list[fromIndex]
    list.splice(fromIndex, 1)
    list.splice(toIndex, 0, item)
  } else if (position === "inner") {
    const item = list[fromIndex]
    list[fromIndex] = list[toIndex]
    list[toIndex] = item
  } else {
    const item = list[fromIndex]
    list.splice(fromIndex, 1)
    list.splice(toIndex + 1, 0, item)
  }
  updateControlList(list)
}
const changeShow = (label: string, show: TableColumnControl["show"]) => {
  const list = [..._controlList.value]
  const column = list.find((item) => item.label === label)
  if (!column) return
  column.show = show
  updateControlList(list)
}
const changeFixed = (label: string, fixed: TableColumnControl["fixed"]) => {
  const list = [..._controlList.value]
  const column = list.find((item) => item.label === label)
  if (!column) return
  column.fixed = fixed
  updateFixedDistance()
  console.log("changeFixed")
  updateControlList(list)
}
const changeWidth = (label: string, width?: TableColumn["width"]) => {
  const list = [..._controlList.value]
  const column = list.find((item) => item.label === label)
  if (!column) return
  if (width) {
    column.width = width
  } else {
    const defaultColumn = columns.value.find((item) => item.label === label)
    if (defaultColumn) column.width = defaultColumn.width
  }
  updateControlList(list)
}

const updateSelectedList = (list: GenericItem[]) => {
  emits("update:selected-list", list)
}
const updateSelectedInfo = (info: TableSelectedGenericInfo<GenericItem>) => {
  emits("update:selected-info", info)
}
const isSelectedAll = computed(() => {
  if (!props.selectedInfo) return undefined
  return props.selectedInfo.isSelectAll
})
const selectedKeyList = computed(() => {
  const key = props.selectKey as string | undefined
  if (props.selectedInfo) {
    if (!key) return []
    const info = props.selectedInfo as TableSelectedGenericInfo<GenericItem>
    return info.isSelectAll
      ? info.excludeList.map((item) => item[key])
      : info.includeList.map((item) => item[key])
  } else if (props.selectedList) {
    if (!key) return []
    const list = props.selectedList as GenericItem[]
    return list.map((item) => item[key])
  } else {
    return undefined
  }
})
const isSelected = (key: string) => {
  if (!selectedKeyList.value) return false
  if (isSelectedAll.value) {
    return !selectedKeyList.value.includes(key)
  } else {
    return selectedKeyList.value.includes(key)
  }
}
const getSelectedInfo = () => {
  if (!props.selectedInfo) return
  return {
    isSelectAll: props.selectedInfo.isSelectAll,
    includeList: [...props.selectedInfo.includeList],
    excludeList: [...props.selectedInfo.excludeList]
  }
}
const toggleSelect = (val: boolean, row: GenericItem) => {
  const key = props.selectKey
  if (!key) return
  const info = getSelectedInfo()
  const list = props.selectedList ? [...props.selectedList] : undefined
  if (info) {
    if (info.isSelectAll) {
      const index = info.excludeList.findIndex((item) => item[key] === row[key])
      if (val) {
        if (index === -1) return
        info.excludeList.splice(index, 1)
      } else {
        if (index !== -1) return
        info.excludeList.push(row)
      }
    } else {
      const index = info.includeList.findIndex((item) => item[key] === row[key])
      if (val) {
        if (index !== -1) return
        info.includeList.push(row)
      } else {
        if (index === -1) return
        info.includeList.splice(index, 1)
      }
    }
    updateSelectedInfo(info)
  } else if (list) {
    const index = list.findIndex((item) => item[key] === row[key])
    if (val) {
      if (index !== -1) return
      list.push(row)
    } else {
      if (index === -1) return
      list.splice(index, 1)
    }
    updateSelectedList(list)
  }
}
const selectAll = () => {
  if (!props.selectedInfo) return
  updateSelectedInfo({
    isSelectAll: true,
    includeList: [],
    excludeList: []
  })
}
const unselectAll = () => {
  if (props.selectedInfo) {
    updateSelectedInfo({
      isSelectAll: false,
      includeList: [],
      excludeList: []
    })
  } else if (props.selectedList) {
    updateSelectedList([])
  }
}
const selectPage = () => {
  const key = props.selectKey
  if (!key) return
  const info = getSelectedInfo()
  const list = props.selectedList ? [...props.selectedList] : undefined
  if (info && info.isSelectAll) {
    for (const item of props.data) {
      const index = info.excludeList.findIndex((i) => i[key] === item[key])
      if (index !== -1) info.excludeList.splice(index, 1)
    }
    updateSelectedInfo(info)
  } else if (info) {
    for (const item of props.data) {
      const index = info.includeList.findIndex((i) => i[key] === item[key])
      if (index === -1) info.includeList.push(item)
    }
    updateSelectedInfo(info)
  } else if (list) {
    for (const item of props.data) {
      const index = list.findIndex((i) => i[key] === item[key])
      if (index === -1) list.push(item)
    }
    updateSelectedList(list)
  }
}
const unselectPage = () => {
  const key = props.selectKey
  if (!key) return
  const info = getSelectedInfo()
  const list = props.selectedList ? [...props.selectedList] : undefined
  if (info && info.isSelectAll) {
    for (const item of props.data) {
      const index = info.excludeList.findIndex((i) => i[key] === item[key])
      if (index === -1) info.excludeList.push(item)
    }
    updateSelectedInfo(info)
  } else if (info) {
    for (const item of props.data) {
      const index = info.includeList.findIndex((i) => i[key] === item[key])
      if (index !== -1) info.includeList.splice(index, 1)
    }
    updateSelectedInfo(info)
  } else if (list) {
    for (const item of props.data) {
      const index = list.findIndex((i) => i[key] === item[key])
      if (index !== -1) list.splice(index, 1)
    }
    updateSelectedList(list)
  }
}

const draggingRow = ref<TableDragObject<GenericItem>>()
const dragoverRow = ref<TableDragObject<GenericItem>>()
const dragoverPosition = ref<DragPosition>()
const dragstartHandle = (row: TableItem) => {
  if (!props.draggable) return
  const index = props.data.findIndex((item: GenericItem) => item === row)
  draggingRow.value = {
    index,
    row: row as GenericItem
  }
  emits("dragstart", draggingRow.value)
  ellipsisRef.value?.hidePopper()
  hoverRef.value?.hidePopper()
}
const dragoverHandle = (
  event: DragEvent,
  target: TableItem,
  position: DragPosition
) => {
  if (!props.draggable || !draggingRow.value) return
  if (
    dragoverRow.value?.row !== target ||
    dragoverPosition.value !== position
  ) {
    const index = props.data.findIndex((item: GenericItem) => item === target)
    const newTarget = { index, row: target as GenericItem }
    const able = props.droppable(draggingRow.value, newTarget, position)
    if (!able) return
    dragoverRow.value = newTarget
    dragoverPosition.value = position
  }
  event.preventDefault()
  if (dragoverRow.value) emits("dragover", draggingRow.value, dragoverRow.value)
}
const dragendHandle = () => {
  if (draggingRow.value && dragoverRow.value && dragoverPosition.value) {
    emits("drop", draggingRow.value, dragoverRow.value, dragoverPosition.value)
  }
  draggingRow.value = undefined
  dragoverRow.value = undefined
  dragoverPosition.value = undefined
  emits("dragend")
}

provide(TABLE_INJECTION, {
  classes: computed(() => ui.value),
  leftShadowIndex,
  rightShadowIndex,

  total: toRef(props, "total"),

  displayColumns,
  columns,
  setColumn,
  removeColumn,
  controlList: computed(() => props.controlList ?? _controlList.value),
  updateControlList,
  resetControlList,
  moveColumn,
  changeShow,
  changeFixed,
  changeWidth,

  selectKey: toRef(props, "selectKey"),
  isSelectedAll,
  selectedKeyList,
  isSelected: (key: string) => isSelected(key),
  toggleSelect: (val: boolean, row: TableItem) =>
    toggleSelect(val, row as GenericItem),
  selectAll,
  unselectAll,
  selectPage,
  unselectPage,

  sortKey: toRef(props, "sortKey"),
  sortOrder: toRef(props, "sortOrder"),
  updateSortKey: (key: string) => emits("update:sort-key", key),
  updateSortOrder: (order: "asc" | "desc") => emits("update:sort-order", order),

  mouseenterCell: (el: HTMLElement, row: TableItem, column: TableColumn) =>
    ellipsisRef.value?.mouseenter(el, row, column),
  mouseleaveCell: () => {
    ellipsisRef.value?.mouseleave()
  },
  mouseenterRow: (el: HTMLElement, row: TableItem) =>
    hoverRef.value?.mouseenter(el, row),
  mouseleaveRow: () => hoverRef.value?.mouseleave(),
  draggingRow,
  dragoverRow,
  dragoverPosition,

  refresh: () => emits("refresh")
})

defineExpose({ reference: containerRef, scrollTo })
</script>
