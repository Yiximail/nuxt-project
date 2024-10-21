<template>
  <div
    ref="containerRef"
    :class="containerClass"
    @dragover="dragoverHandle"
    @dragleave="dragleaveHandle"
  >
    <div
      :class="ui.drag"
      draggable="true"
      @dragstart="dragstartHandle"
      @dragend="$emit('dragend')"
    >
      <v-icon icon="mdi:drag" class="h-5 w-5" />
    </div>
    <v-checkbox
      :model-value="column.show"
      @update:model-value="$emit('update-show', $event)"
    />
    <!-- <v-dropdown>
      <template #default="{ isShowPopper, showPopper }">
        <v-button
          type="plain"
          :shadow="false"
          class="px-1"
          size="sm"
          :color="column.show ? 'primary' : 'natural'"
          @click="showPopper"
        >
          <span v-if="column.show"> 显示 </span>
          <span v-else> 隐藏 </span>
          <v-icon
            icon="mdi:chevron-down"
            class="h-4 w-4 transition"
            :class="isShowPopper ? 'rotate-180' : ''"
          />
        </v-button>
      </template>
      <template #content>
        <v-dropdown-item @click="$emit('update-show', true)">
          显示
        </v-dropdown-item>
        <v-dropdown-item @click="$emit('update-show', false)">
          隐藏
        </v-dropdown-item>
      </template>
    </v-dropdown> -->
    <v-dropdown>
      <template #default="{ isShowPopper, showPopper }">
        <v-button
          type="plain"
          :shadow="false"
          class="px-1"
          size="sm"
          :color="column.fixed ? 'primary' : 'natural'"
          @click="showPopper"
        >
          <span v-if="column.fixed === 'left'"> 左固定 </span>
          <span v-else-if="column.fixed === 'right'"> 右固定 </span>
          <span v-else> 不固定 </span>
          <v-icon
            icon="mdi:chevron-down"
            class="h-4 w-4 transition"
            :class="isShowPopper ? 'rotate-180' : ''"
          />
        </v-button>
      </template>
      <template #content>
        <v-dropdown-item @click="$emit('update-fixed', undefined)">
          不固定
        </v-dropdown-item>
        <v-dropdown-item @click="$emit('update-fixed', 'left')">
          左固定
        </v-dropdown-item>
        <v-dropdown-item @click="$emit('update-fixed', 'right')">
          右固定
        </v-dropdown-item>
      </template>
    </v-dropdown>
    <div :class="ui.label">
      {{ column.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import VCheckbox from "../checkbox/checkbox.vue"
import VDropdown from "../dropdown/dropdown.vue"
import VDropdownItem from "../dropdown/dropdown-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  DragPosition,
  TableColumnControl,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = defineProps<{
  /** 列配置 */
  column: TableColumnControl
  /** 拖拽中的label */
  draggingLabel: string | undefined
  /** 拖拽至的label */
  dragoverLabel: string | undefined
  /** 拖拽的位置 */
  dragoverPosition: DragPosition | undefined
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["tableColumnControllerItem"]>
}>()

const emits = defineEmits<{
  dragstart: []
  dragover: [event: DragEvent, label: string, position: DragPosition]
  dragend: []
  "update-show": [val: TableColumnControl["show"]]
  "update-fixed": [val: TableColumnControl["fixed"]]
}>()

const { ui } = useUi("tableColumnControllerItem", props)

const containerClass = computed(() => {
  const isDragOver = props.dragoverLabel === props.column.label
  return classMerge(
    ui.value.container,
    isDragOver &&
      props.dragoverPosition && [
      ui.value.dragover.container,
      ui.value.dragover[props.dragoverPosition]
    ],
    props.class
  )
})

const dragstartHandle = (event: DragEvent) => {
  if (containerRef.value) {
    event.dataTransfer?.setDragImage(containerRef.value, 20, 20)
  }
  emits("dragstart")
}
let dragoverTimer: number | undefined
const dragoverHandle = (event: DragEvent) => {
  if (!containerRef.value || !props.draggingLabel) return
  const { height, top } = containerRef.value.getBoundingClientRect()
  const threshold = Math.min(height / 4, 10)
  const offsetY = event.clientY - top
  if (offsetY <= threshold) {
    emits("dragover", event, props.column.label, "before")
  } else if (offsetY >= height - threshold) {
    emits("dragover", event, props.column.label, "after")
  } else {
    emits("dragover", event, props.column.label, "inner")
  }
}
const dragleaveHandle = () => {
  if (dragoverTimer) clearTimeout(dragoverTimer)
  dragoverTimer = undefined
}
</script>
