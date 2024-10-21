<template>
  <div :class="containerClass">
    <component :is="renderList" />
  </div>
</template>

<script setup lang="ts">
import VTimelineItem from "./timeline-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TIMELINE_INJECTION } from "../../utils/injection-keys"
import { getNodes } from "../../utils/vnode"
import { computed, toRef, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 类型 */
    type?: "horizontal" | "vertical"
    /** 线类型 */
    line?: "dashed" | "solid"
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["timeline"]>
  }>(),
  {
    type: "horizontal",
    line: "solid",
    class: undefined,
    ui: undefined
  }
)

const slots = defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("timeline", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value[props.type].container,
    props.class
  )
})

const renderList = () => {
  if (!slots.default) return undefined
  return getNodes(slots.default()).filter((node) => node.type === VTimelineItem)
}

provide(TIMELINE_INJECTION, {
  type: toRef(props, "type"),
  line: toRef(props, "line")
})
</script>
