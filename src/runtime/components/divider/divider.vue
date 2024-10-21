<template>
  <component :is="as" :class="containerClass">
    <slot name="start" />
    <div :class="startLineClass" />
    <template v-if="$slots.default">
      <slot name="default" />
      <div :class="endLineClass" />
    </template>
    <slot name="end" />
  </component>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器标签名 */
    as?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["divider"]>
    /** 类型 */
    type?: "horizontal" | "vertical"
  }>(),
  {
    as: "div",
    class: undefined,
    ui: undefined,
    type: "horizontal"
  }
)

defineSlots<{
  start:() => ComponentSlot
  default: () => ComponentSlot
  end: () => ComponentSlot
}>()

const { ui } = useUi("divider", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value[props.type].container,
    ui.value.container,
    props.class
  )
})
const startLineClass = computed(() => {
  return classMerge(
    ui.value[props.type].line,
    ui.value.line,
    ui.value.startLine
  )
})
const endLineClass = computed(() => {
  return classMerge(ui.value[props.type].line, ui.value.line, ui.value.endLine)
})
</script>
