<template>
  <th
    ref="thRef"
    :data-column-label="column.label"
    :class="cellClass"
    :style="cellStyle"
  >
    <div v-if="column.slots.head" :class="contentClass">
      <component :is="column.slots.head" :column="column" />
      <v-table-sort v-if="column.sortKey" :sort-key="column.sortKey" />
    </div>
    <template v-else-if="column.type === 'select'">
      <div :class="contentClass">
        <v-dropdown
          :popper="{
            toBody: true,
            placement: 'right-start',
            arrowPadding: 3
          }"
          :click-close="false"
        >
          <template #default>
            <v-checkbox
              class="h-6 flex justify-center"
              :model-value="selectedStatus === 'all'"
              :indeterminate="selectedStatus === 'indeterminate'"
            />
          </template>
          <template #content>
            <div :class="ui.selectedInfo">
              {{ selectedText }}
            </div>
            <v-divider type="horizontal" />
            <v-dropdown-item @click="selectPage">
              选择当前页数据
            </v-dropdown-item>
            <v-dropdown-item @click="unselectPage">
              取消选择当前页数据
            </v-dropdown-item>
            <template v-if="isSelectedAll !== undefined">
              <v-divider type="horizontal" />
              <v-dropdown-item @click="selectAll">
                选择所有数据
              </v-dropdown-item>
            </template>
            <v-dropdown-item @click="unselectAll">
              取消选择所有数据
            </v-dropdown-item>
          </template>
        </v-dropdown>
      </div>
    </template>
    <template v-else-if="column.type === 'default'">
      <div :class="contentClass">
        <span :class="ui.label">
          {{ column.label }}
        </span>
        <v-table-sort v-if="column.sortKey" :sort-key="column.sortKey" />
      </div>
    </template>
    <div
      v-if="column.type === 'default'"
      :class="ui.resize"
      @mousedown="mousedown"
    />
  </th>
</template>

<script setup lang="ts">
import VTableSort from "./table-sort.vue"
import VCheckbox from "../checkbox/checkbox.vue"
import VDropdown from "../dropdown/dropdown.vue"
import VDropdownItem from "../dropdown/dropdown-item.vue"
import VDivider from "../divider/divider.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  TABLE_INJECTION,
  TABLE_HEAD_INJECTION
} from "../../utils/injection-keys"
import {
  ref,
  computed,
  toRef,
  inject,
  provide,
  onMounted,
  onBeforeUnmount
} from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"
import type { TableColumn } from "../../types/injections"
import type { CSSProperties } from "vue"

const thRef = ref<HTMLTableCellElement>()

const props = defineProps<{
  /** 列元素 */
  column: TableColumn
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["tableHeadCell"]>
}>()

const emits = defineEmits<{
  observe: [el: HTMLElement]
  unobserve: [el: HTMLElement]
}>()

const { ui } = useUi("tableHeadCell", props)

const {
  classes,
  isSelectedAll,
  selectedKeyList,
  selectAll,
  unselectAll,
  selectPage,
  unselectPage,
  total,
  changeWidth
} = inject(TABLE_INJECTION)!

const cellClass = computed(() => {
  return classMerge(
    ui.value.base,
    classes.value.headCell,
    props.column.headCellClass,
    props.class
  )
})
const contentClass = computed(() => {
  return classMerge(
    ui.value.content,
    classes.value.headContent,
    props.column.headContentClass
  )
})

onMounted(() => {
  if (!thRef.value) return
  emits("observe", thRef.value)
})
onBeforeUnmount(() => {
  if (!thRef.value) return
  emits("unobserve", thRef.value)
})

const cellStyle = computed(() => {
  const style: CSSProperties = {}

  if (props.column.width) {
    style.maxWidth = props.column.width
    style.minWidth = props.column.width
  }

  if (props.column.fixed === "left") {
    style.position = "sticky"
    style.left = `${props.column.fixedDistance}px`
    style.zIndex = props.column.fixedZindex
  } else if (props.column.fixed === "right") {
    style.position = "sticky"
    style.right = `${props.column.fixedDistance}px`
    style.zIndex = props.column.fixedZindex
  } else {
    style.position = "relative"
    style.zIndex = 0
  }

  return style
})

const selectedCount = computed(() => {
  if (selectedKeyList.value === undefined) return 0
  if (isSelectedAll.value === true) {
    return Math.max(0, total.value - selectedKeyList.value.length)
  }
  return selectedKeyList.value.length
})
const selectedStatus = computed<"none" | "all" | "indeterminate">(() => {
  if (selectedCount.value === 0) return "none"
  if (selectedCount.value >= total.value) return "all"
  return "indeterminate"
})
const selectedText = computed(() => {
  const selected = Math.min(selectedCount.value, total.value)
  return `已选: ${selected}/${total.value}`
})

let startX = 0
let startWidth = 0
let doubleClickTimer: number | undefined
const mousedown = (event: MouseEvent) => {
  if (event.button !== 0) return
  if (doubleClickTimer) {
    window.clearTimeout(doubleClickTimer)
    doubleClickTimer = undefined
    changeWidth(props.column.label, undefined)
    return
  }
  doubleClickTimer = window.setTimeout(() => {
    doubleClickTimer = undefined
  }, 300)
  startX = event.clientX
  startWidth = thRef.value?.getBoundingClientRect().width || 0
  document.removeEventListener("mousemove", mousemove)
  document.removeEventListener("mouseup", mouseup)
  document.addEventListener("mousemove", mousemove)
  document.addEventListener("mouseup", mouseup)
}
let lastWidth = 20
let frameId: number | undefined
const mousemove = (event: MouseEvent) => {
  const width = Math.round(startWidth + event.clientX - startX)
  if (width < 20) return
  lastWidth = width
  if (frameId) window.cancelAnimationFrame(frameId)
  frameId = window.requestAnimationFrame(() => {
    changeWidth(props.column.label, `${lastWidth}px`)
    frameId = undefined
  })
}
const mouseup = () => {
  document.removeEventListener("mousemove", mousemove)
  document.removeEventListener("mouseup", mouseup)
}

provide(TABLE_HEAD_INJECTION, { column: toRef(props, "column") })
</script>
