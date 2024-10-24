<template>
  <td
    ref="tdRef"
    :class="cellClass"
    :style="cellStyle"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <component
      :is="column.slots.default"
      v-if="column.slots.default"
      :row="row"
    />
    <template v-else-if="column.type === 'select'">
      <v-checkbox
        class="h-6 flex justify-center"
        :model-value="isSelectedStatus"
        @update:model-value="toggleHandle"
      />
    </template>
    <template v-else-if="column.type === 'drag'">
      <div
        :class="ui.drag"
        draggable="true"
        @dragstart="$emit('dragstart', $event)"
        @dragend="$emit('dragend')"
      >
        <v-icon icon="mdi:drag" class="h-5 w-5" />
      </div>
    </template>
    <template v-else-if="column.prop">
      {{ row[column.prop] }}
    </template>
  </td>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TABLE_INJECTION } from "../../utils/injection-keys"
import { ref, computed, inject } from "vue"

import type { TableItem } from "../../types"
import type { TableColumn } from "../../types/injections"
import type { CSSProperties } from "vue"

const tdRef = ref<HTMLTableCellElement>()

const props = defineProps<{
  /** 列元素 */
  column: TableColumn
  /** 列数 */
  index: number
  /** 行元素 */
  row: TableItem
}>()

defineEmits<{
  dragstart: [event: DragEvent]
  dragend: []
}>()

const { ui } = useUi("tableBodyCell", {})

const {
  classes,
  selectKey,
  leftShadowIndex,
  rightShadowIndex,
  isSelected,
  toggleSelect,
  mouseenterCell,
  mouseleaveCell
} = inject(TABLE_INJECTION)!

const mouseenter = () => {
  if (!tdRef.value) return
  if (props.column.type !== "default") return
  if (props.column.slots.default) return
  mouseenterCell(tdRef.value, props.row, props.column)
}
const mouseleave = () => {
  if (!tdRef.value) return
  if (props.column.type !== "default") return
  mouseleaveCell(tdRef.value)
}

const cellClass = computed(() => {
  return classMerge(
    ui.value.base,
    classes.value.bodyCell,
    props.column.bodyCellClass
  )
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
    style.zIndex =
      leftShadowIndex.value !== -1 && props.index <= leftShadowIndex.value
        ? props.column.fixedZindex
        : 0
  } else if (props.column.fixed === "right") {
    style.position = "sticky"
    style.right = `${props.column.fixedDistance}px`
    style.zIndex =
      rightShadowIndex.value !== -1 && props.index >= rightShadowIndex.value
        ? 1
        : 0
  } else {
    style.position = "relative"
    style.zIndex = 0
  }

  return style
})

const isSelectedStatus = computed(() => {
  const key = selectKey.value
  if (!key) return false
  return isSelected(props.row[key])
})
const toggleHandle = (val: boolean) => {
  toggleSelect(val, props.row)
}
</script>
