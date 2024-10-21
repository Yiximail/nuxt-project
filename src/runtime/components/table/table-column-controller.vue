<template>
  <v-icon-button
    ref="buttonRef"
    icon="mdi:settings"
    :class="[ui.button, isShowPopper ? 'show' : '']"
  />
  <v-popper
    ref="popperRef"
    v-model="isShowPopper"
    :reference="buttonRef"
    strategy="fixed"
    placement="right-start"
    trigger="click"
  >
    <template #content>
      <div :class="ui.header">
        <div>表格列配置</div>
        <v-button
          size="sm"
          block
          type="text"
          :shadow="false"
          @click="resetControlList"
        >
          重置
        </v-button>
      </div>
      <v-divider />
      <v-scrollbar-native :class="popperClass">
        <v-table-column-controller-item
          v-for="column in controlList"
          :key="column.label"
          :column="column"
          :dragging-label="draggingLabel"
          :dragover-label="dragoverLabel"
          :dragover-position="dragoverPosition"
          @dragstart="dragstartHandle(column.label)"
          @dragover="dragoverHandle"
          @dragend="dragendHandle"
          @update-show="changeShow(column.label, $event)"
          @update-fixed="changeFixed(column.label, $event)"
        />
      </v-scrollbar-native>
    </template>
  </v-popper>
</template>

<script setup lang="ts">
import VIconButton from "../icon/icon-button.vue"
import VPopper from "../popper/popper.vue"
import VDivider from "../divider/divider.vue"
import VScrollbarNative from "../scrollbar/scrollbar-native.vue"
import VTableColumnControllerItem from "./table-column-controller-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TABLE_INJECTION } from "../../utils/injection-keys"
import { ref, computed, inject } from "vue"

import type { DeepPartial, ClassNameValue, DragPosition, UI } from "../../types"

const buttonRef = ref<InstanceType<typeof VIconButton>>()
const popperRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tableColumnController"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

const { ui } = useUi("tableColumnController", props)

const popperClass = computed(() => {
  return classMerge(ui.value.popper, props.class)
})

const { controlList, resetControlList, moveColumn, changeShow, changeFixed } =
  inject(TABLE_INJECTION)!

const isShowPopper = ref(false)

const draggingLabel = ref<string>()
const dragoverLabel = ref<string>()
const dragoverPosition = ref<DragPosition>()
const dragstartHandle = (label: string) => {
  draggingLabel.value = label
}
const dragendHandle = () => {
  if (draggingLabel.value && dragoverLabel.value && dragoverPosition.value) {
    moveColumn(draggingLabel.value, dragoverLabel.value, dragoverPosition.value)
  }
  draggingLabel.value = undefined
  dragoverLabel.value = undefined
  dragoverPosition.value = undefined
}
const dragoverHandle = (
  event: DragEvent,
  label: string,
  position: DragPosition
) => {
  if (!draggingLabel.value) return
  if (dragoverLabel.value !== label || dragoverPosition.value !== position) {
    dragoverLabel.value = label
    dragoverPosition.value = position
  }
  event.preventDefault()
}
</script>
