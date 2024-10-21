<template>
  <div :class="['group/steps-item', containerClass]">
    <div :class="headerClass">
      <div :class="iconClass">
        <slot name="icon" :status="itemStatus">
          <transition name="v-fade" mode="out-in">
            <span v-if="itemStatus === 'wait' || itemStatus === 'process'">
              {{ index + 1 }}
            </span>
            <v-icon v-else-if="itemStatus === 'finish'" icon="mdi:check" />
            <v-icon v-else-if="itemStatus === 'error'" icon="mdi:close" />
          </transition>
        </slot>
      </div>
      <div v-if="title || $slots.title" :class="titleClass">
        <slot name="title" :status="itemStatus">
          {{ title }}
        </slot>
      </div>
    </div>
    <div :class="contentClass">
      <slot :status="itemStatus" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { STEPS_INJECTION } from "../../utils/injection-keys"
import { computed, inject } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  StepsStatus,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 序号 */
    index?: number
    /** 状态 */
    status?: StepsStatus
    /** 标题 */
    title?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["stepsItem"]>
  }>(),
  {
    index: 0,
    status: undefined,
    title: undefined,
    class: undefined,
    ui: undefined
  }
)

defineSlots<{
  icon:(props: { status: StepsStatus }) => ComponentSlot
  title: (props: { status: StepsStatus }) => ComponentSlot
  default: (props: { status: StepsStatus }) => ComponentSlot
}>()

const { ui } = useUi("stepsItem", props)

const { current, currentStatus, type } = inject(STEPS_INJECTION)!

const isCurrent = computed(() => current.value === props.index)
const itemStatus = computed(() => {
  if (props.status) return props.status
  if (props.index === undefined) return "wait"
  if (current.value === props.index) return currentStatus.value
  if (current.value > props.index) return "finish"
  return "wait"
})
const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value[type.value].container,
    ui.value.status[itemStatus.value]?.container,
    isCurrent.value && ui.value.current.container,
    props.class
  )
})
const headerClass = computed(() => {
  return classMerge(
    ui.value.header,
    ui.value[type.value].header,
    ui.value.status[itemStatus.value]?.header,
    isCurrent.value && ui.value.current.header
  )
})
const iconClass = computed(() => {
  return classMerge(
    ui.value.icon,
    ui.value[type.value].icon,
    ui.value.status[itemStatus.value]?.icon,
    isCurrent.value && ui.value.current.header
  )
})
const titleClass = computed(() => {
  return classMerge(
    ui.value.title,
    ui.value[type.value].title,
    ui.value.status[itemStatus.value]?.title,
    isCurrent.value && ui.value.current.title
  )
})
const contentClass = computed(() => {
  return classMerge(
    ui.value.content,
    ui.value[type.value].content,
    ui.value.status[itemStatus.value]?.content,
    isCurrent.value && ui.value.current.content
  )
})
</script>
