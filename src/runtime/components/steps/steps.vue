<template>
  <div :class="containerClass">
    <component :is="renderList" />
  </div>
</template>

<script setup lang="ts">
import VStepsItem from "./steps-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { STEPS_INJECTION } from "../../utils/injection-keys"
import { getNodes } from "../../utils/vnode"
import { computed, provide, toRef } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  StepsStatus,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 当前项 */
    current?: number
    /** 状态 */
    status?: StepsStatus
    /** 类型 */
    type?: "horizontal" | "vertical"
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["steps"]>
  }>(),
  {
    current: 0,
    status: "process",
    type: "horizontal",
    class: undefined,
    ui: undefined
  }
)

const slots = defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("steps", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value[props.type].container,
    props.class
  )
})

const renderList = () => {
  if (!slots.default) return undefined
  return getNodes(slots.default())
    .filter((node) => node.type === VStepsItem)
    .map((item, index) => ({
      ...item,
      props: { ...item.props, index }
    }))
}

provide(STEPS_INJECTION, {
  current: toRef(props, "current"),
  currentStatus: toRef(props, "status"),
  type: toRef(props, "type")
})
</script>
