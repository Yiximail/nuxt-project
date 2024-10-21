<template>
  <div :class="['group/timeline-item', containerClass]">
    <div :class="headerClass">
      <div :class="iconClass" />
    </div>
    <div :class="wrapperClass">
      <div v-if="title || $slots.title" :class="titleClass">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div :class="contentClass">
        <slot />
      </div>
      <div v-if="time || $slots.time" :class="timeClass">
        <slot name="time">
          {{ time }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TIMELINE_INJECTION } from "../../utils/injection-keys"
import { computed, toRef, inject } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  Color,
  UI
} from "../../types"

export type TimelineItemUi = DeepPartial<UI["timelineItem"]>

const props = withDefaults(
  defineProps<{
    /** 颜色 */
    color?: Color
    /** 标题 */
    title?: string
    /** 时间 */
    time?: string
    /** 线类型 */
    line?: "dashed" | "solid"
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: TimelineItemUi
  }>(),
  {
    color: "natural",
    title: undefined,
    time: undefined,
    line: undefined,
    class: undefined,
    ui: undefined
  }
)
export type TimelineItemProps = typeof props

defineSlots<{
  icon:() => ComponentSlot
  title: () => ComponentSlot
  default: () => ComponentSlot
  time: () => ComponentSlot
}>()

const { ui } = useUi("timelineItem", props, { color: toRef(props, "color") })

const { type, line: injectionLine } = inject(TIMELINE_INJECTION)!

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value[type.value].container,
    props.class
  )
})
const headerClass = computed(() => {
  return classMerge(
    ui.value.header,
    ui.value[type.value].header,
    (props.line ?? injectionLine.value) === "dashed" && ui.value.dashed
  )
})
const iconClass = computed(() => {
  return classMerge(ui.value.icon, ui.value[type.value].icon)
})
const wrapperClass = computed(() => {
  return classMerge(ui.value.wrapper, ui.value[type.value].wrapper)
})
const titleClass = computed(() => {
  return classMerge(ui.value.title, ui.value[type.value].title)
})
const contentClass = computed(() => {
  return classMerge(ui.value.content, ui.value[type.value].content)
})
const timeClass = computed(() => {
  return classMerge(ui.value.time, ui.value[type.value].time)
})
</script>
