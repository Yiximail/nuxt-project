<template>
  <div
    ref="itemRef"
    :class="containerClass"
    v-bind="$attrs"
    @click="clickHandle"
  >
    <span :class="ui.label">
      {{ date.getDate() }}
    </span>
    <div :class="todayClass" />
  </div>
</template>

<script setup lang="ts">
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const itemRef = ref<HTMLDivElement>()

const props = defineProps<{
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["inputDatePickerItem"]>
  /** 日期 */
  date: Date
  /** 当前显示月 */
  month: number
  /** 禁用函数 */
  disabled?:(date: Date) => boolean
  /** 选择的日期 */
  selectedTime?: number
  /** 开始日期时间 */
  startTime?: number
  /** 结束日期 */
  endTime?: number
}>()

const emits = defineEmits<{
  click: []
}>()

const { ui } = useUi("inputDatePickerItem", props)

const isDisabled = computed(() => {
  return props.disabled?.(props.date) || false
})

const containerClass = computed(() => {
  const dateTime = props.date.getTime()
  const isDifferentMonth = props.date.getMonth() !== props.month
  let isStartDate = false
  let isEndDate = false
  let isInRange = false
  const isSelected = props.selectedTime === dateTime
  if (props.startTime && dateTime === props.startTime) {
    isStartDate = true
  }
  if (props.endTime && dateTime === props.endTime) {
    isEndDate = true
  }
  if (props.startTime && props.endTime) {
    isInRange = dateTime > props.startTime && dateTime < props.endTime
  }
  return classMerge(
    ui.value.container,
    isDifferentMonth && ui.value.differentMonth,
    isSelected && ui.value.selectedDate,
    isStartDate && ui.value.startDate,
    isEndDate && ui.value.endDate,
    isInRange && ui.value.inRange,
    isDisabled.value ? ui.value.clickable : ui.value.clickable,
    props.class
  )
})
const todayClass = computed(() => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const dateTime = props.date.getTime()
  const isToday = dateTime === now.getTime()
  if (!isToday) return
  return ui.value.today
})

useClickRipple(itemRef, {
  type: "center",
  size: "28px",
  disabled: isDisabled
})

const clickHandle = () => {
  if (isDisabled.value) return
  emits("click")
}
</script>
