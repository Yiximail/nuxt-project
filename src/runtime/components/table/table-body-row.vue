<template>
  <tr
    ref="trRef"
    :data-table-row="index"
    :class="trClass"
    @dragover="dragoverHandle"
    @dragend="dragendHandle"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <template v-for="(column, i) in displayColumns" :key="column.label">
      <td v-if="column.fixed !== undefined" :class="classes.shadowContainer" />
      <v-table-body-cell
        :column="column"
        :row="row"
        :index="i"
        @dragstart="dragstartHandle"
        @dragend="$emit('dragend')"
      />
    </template>
  </tr>
</template>

<script setup lang="ts">
import VTableBodyCell from "./table-body-cell.vue"

import classMerge from "../../utils/class-merge"
import { TABLE_INJECTION } from "../../utils/injection-keys"
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue"

import type { TableItem, DragPosition } from "../../types"

const trRef = ref<HTMLTableRowElement>()

const props = defineProps<{
  /** 行元素 */
  row: TableItem
  /** 行数 */
  index: number
}>()

const emits = defineEmits<{
  observe: [el: HTMLElement]
  unobserve: [el: HTMLElement]
  dragstart: [row: TableItem]
  dragover: [event: DragEvent, row: TableItem, position: DragPosition]
  dragend: []
}>()

const {
  classes,
  displayColumns,
  mouseenterRow,
  mouseleaveRow,
  draggingRow,
  dragoverRow,
  dragoverPosition
} = inject(TABLE_INJECTION)!

const trClass = computed(() => {
  const isDragOver = dragoverRow.value?.row === props.row
  return classMerge(
    classes.value.bodyRow,
    isDragOver && [
      classes.value.dragover.container,
      classes.value.dragover[dragoverPosition.value as DragPosition]
    ]
  )
})

onMounted(() => {
  if (!trRef.value) return
  emits("observe", trRef.value)
})
onBeforeUnmount(() => {
  if (!trRef.value) return
  emits("unobserve", trRef.value)
})

const mouseenter = () => {
  if (!trRef.value) return
  mouseenterRow(trRef.value, props.row)
}
const mouseleave = () => {
  if (!trRef.value) return
  mouseleaveRow(trRef.value)
}

const dragstartHandle = (event: DragEvent) => {
  if (trRef.value) {
    const y = trRef.value.clientHeight / 2
    const x = 12
    event.dataTransfer?.setDragImage(trRef.value, x, y)
  }
  emits("dragstart", props.row)
}
const dragoverHandle = (event: DragEvent) => {
  if (!trRef.value || !draggingRow.value) return
  const { height, top } = trRef.value.getBoundingClientRect()
  const threshold = Math.min(height / 4, 10)
  const offsetY = event.clientY - top
  if (offsetY <= threshold) {
    emits("dragover", event, props.row, "before")
  } else if (offsetY >= height - threshold) {
    emits("dragover", event, props.row, "after")
  } else {
    emits("dragover", event, props.row, "inner")
  }
}
const dragendHandle = () => {
  emits("dragend")
}
</script>
