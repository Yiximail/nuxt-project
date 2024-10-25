<template>
  <div
    ref="itemRef"
    :class="containerClass"
    :style="{ '--indent': level - 1 }"
    @dragover="dragoverHandle"
    @dragleave="dragleaveHandle"
  >
    <div :class="classes.block">
      <v-icon-button
        v-if="hasChildren"
        :class="classes.button"
        :icon="{
          name: 'mdi:chevron-right',
          class: arrowClass
        }"
        @click="clickArrow"
      />
    </div>
    <div v-if="draggable" :class="classes.block">
      <div
        :class="classes.drag"
        draggable="true"
        @dragstart="dragstartHandle"
        @dragend="dragendHandle"
      >
        <v-icon icon="mdi:drag" class="h-5 w-5" />
      </div>
    </div>
    <div v-if="selectable" :class="classes.block">
      <v-checkbox
        :model-value="checkboxValue"
        :indeterminate="selectedChildCount > 0"
        :class="classes.checkbox"
        @update:model-value="updateCheckbox"
      />
    </div>
    <slot name="prepend" :object="object" />
    <slot :object="object">
      <div :class="classes.label">
        {{ object.item[labelName] }}
      </div>
    </slot>
    <slot name="append" :object="object" />
  </div>
</template>

<script setup lang="ts">
import VIconButton from "../icon/icon-button.vue"
import VCheckbox from "../checkbox/checkbox.vue"

import classMerge from "../../utils/class-merge"
import { TREE_INJECTION } from "../../utils/injection-keys"
import { ref, computed, inject } from "vue"

import type {
  ClassNameValue,
  ComponentSlot,
  TreeItem,
  TreeObject,
  DragPosition
} from "../../types"

const itemRef = ref<HTMLElement>()

const props = withDefaults(
  defineProps<{
    /** 对象 */
    item: TreeItem
    /** 动画中 */
    animating?: boolean
    /** 容器类名 */
    class?: ClassNameValue
  }>(),
  {
    animating: false,
    class: undefined
  }
)

const emits = defineEmits<{
  dragstart: [object: TreeObject]
  dragover: [event: DragEvent, object: TreeObject, position: DragPosition]
  dragend: []
}>()

defineSlots<{
  prepend:(props: { object: TreeObject }) => ComponentSlot
  default: (props: { object: TreeObject }) => ComponentSlot
  append: (props: { object: TreeObject }) => ComponentSlot
}>()

const containerClass = computed(() => {
  const isDragOver = dragoverObject.value?.item[keyName.value] === itemKey.value
  return classMerge(
    classes.value.item,
    isDragOver && [
      classes.value.dragover.item,
      classes.value.dragover[dragoverPosition.value as DragPosition]
    ],
    props.class
  )
})
const arrowClass = computed(() => {
  return classMerge(
    classes.value.arrow,
    expanded.value && [classes.value.arrowActive]
  )
})

const {
  classes,
  keyName,
  labelName,
  childrenName,
  maxlevel,
  expandedKeys,
  expandingKey,
  collapsingKey,
  toggleExpand,
  flatObjectMap,
  selectable,
  isSelected,
  getChildrenSelectedCount,
  selectHandle,
  unselectHandle,
  draggable,
  draggingObject,
  dragoverObject,
  dragoverPosition
} = inject(TREE_INJECTION)!

const itemKey = computed(() => props.item[keyName.value])
const object = computed(() => {
  const option = flatObjectMap.value.get(itemKey.value)
  if (option) return option
  return { item: props.item, path: [] } as TreeObject
})
const level = computed(() => object.value?.path?.length ?? 0)

const checkboxValue = computed(() => isSelected(object.value))
const selectedChildCount = computed(() => {
  if (!hasChildren.value) return 0
  if (checkboxValue.value) return 0
  return getChildrenSelectedCount(object.value)
})
const updateCheckbox = (val: boolean) => {
  if (val) selectHandle(object.value)
  else unselectHandle(object.value)
}

const hasChildren = computed(() => {
  if (!!maxlevel.value && level.value >= maxlevel.value) return false
  const children = props.item?.[childrenName.value]
  if (!Array.isArray(children)) return false
  return children.length > 0
})
const expanded = computed(() => {
  const key = props.item[keyName.value]
  if (expandingKey.value === key) return true
  if (collapsingKey.value === key) return false
  return expandedKeys.value.includes(key)
})

const clickArrow = () => {
  if (!hasChildren.value) return
  if (props.animating) return
  toggleExpand(props.item[keyName.value])
}

const dragstartHandle = (event: DragEvent) => {
  if (itemRef.value) {
    const y = itemRef.value.clientHeight / 2
    const x = 20 + 10
    event.dataTransfer?.setDragImage(itemRef.value, x, y)
  }
  emits("dragstart", object.value)
}
let dragoverTimer: number | undefined
const dragoverHandle = (event: DragEvent) => {
  if (!itemRef.value || !draggingObject.value) return
  const { height, top } = itemRef.value.getBoundingClientRect()
  const threshold = Math.min(height / 4, 10)
  const offsetY = event.clientY - top
  if (offsetY <= threshold) {
    if (dragoverTimer) {
      window.clearTimeout(dragoverTimer)
      dragoverTimer = undefined
    }
    emits("dragover", event, object.value, "before")
  } else if (offsetY >= height - threshold) {
    if (dragoverTimer) {
      window.clearTimeout(dragoverTimer)
      dragoverTimer = undefined
    }
    emits("dragover", event, object.value, "after")
  } else {
    if (!dragoverTimer && hasChildren.value && !expanded.value) {
      dragoverTimer = window.setTimeout(() => {
        toggleExpand(props.item[keyName.value])
        dragoverTimer = undefined
      }, 750)
    }
    emits("dragover", event, object.value, "inner")
  }
}
const dragleaveHandle = () => {
  if (dragoverTimer) {
    window.clearTimeout(dragoverTimer)
    dragoverTimer = undefined
  }
}
const dragendHandle = () => {
  emits("dragend")
}

const clearDragoverTimer = () => {
  window.clearTimeout(dragoverTimer)
  dragoverTimer = undefined
}

defineExpose({ clearDragoverTimer })
</script>
