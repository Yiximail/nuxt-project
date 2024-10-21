<template>
  <span ref="containerRef" :class="containerClass">
    <slot
      :running="running"
      :day="dayValue"
      :hour="hourValue"
      :minute="minuteValue"
      :second="secondValue"
      :millisecond="millisecondValue"
    >
      {{ defaultTimeString }}
    </slot>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const containerRef = ref<HTMLSpanElement>()

const props = withDefaults(
  defineProps<{
    /** 运行状态 */
    modelValue?: boolean
    /** 结束时间戳 */
    end: number
    /** 当前时间 */
    now?: number
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["countdown"]>
    /** 毫秒级 */
    useMillisecond?: boolean
    /** 自动开始 */
    autorun?: boolean
  }>(),
  {
    modelValue: undefined,
    now: undefined,
    class: undefined,
    ui: undefined,
    useMillisecond: false,
    autorun: true
  }
)

const emits = defineEmits<{
  end: []
}>()

const { ui } = useUi("countdown", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const defaultTimeString = computed(() => {
  if (!mounted.value) return "-"

  const day = dayValue.value.toString()
  let hour = hourValue.value.toString().padStart(2, "0")
  const minute = minuteValue.value.toString().padStart(2, "0")
  const second = secondValue.value.toString().padStart(2, "0")
  const millisecond = millisecondValue.value.toString().padStart(3, "0")

  if (dayValue.value) return `${day}天 ${hour}:${minute}:${second}`
  hour = hourValue.value.toString()
  if (hourValue.value) return `${hour}:${minute}:${second}`
  return props.useMillisecond
    ? `${minute}:${second}.${millisecond}`
    : `${minute}:${second}`
})

const dayValue = ref<number>(0)
const hourValue = ref<number>(0)
const minuteValue = ref<number>(0)
const secondValue = ref<number>(0)
const millisecondValue = ref<number>(0)

const countTime = (value: number) => {
  const val = Math.max(0, value)
  dayValue.value = Math.floor(val / 36e5 / 24)
  hourValue.value = Math.floor(val / 36e5) % 24
  minuteValue.value = Math.floor(val / 6e4) % 60
  secondValue.value = Math.floor(val / 1e3) % 60
  millisecondValue.value = Math.floor(val % 1e3)
}

let delta = props.now ? props.now - Date.now() : 0
const value = props.end - (Date.now() + delta)
countTime(value)

const running = ref(false)
const timer = ref<number>()
const interval = () => {
  if (!running.value) return
  const value = props.end - (Date.now() + delta)
  countTime(value)
  if (props.end <= value) {
    emits("end")
    return stopHandle()
  }
  requestAnimationFrame(interval)
}
const startHandle = () => {
  delta = props.now ? props.now - Date.now() : 0
  if (running.value) return
  if (props.end <= value) {
    emits("end")
    return stopHandle()
  }
  running.value = true
  if (props.useMillisecond) {
    interval()
  } else {
    clearInterval(timer.value)
    timer.value = window.setInterval(() => {
      const value = props.end - (Date.now() + delta)
      countTime(value)
      if (props.end <= value) {
        emits("end")
        return stopHandle()
      }
    }, 1000 / 30)
  }
}
const stopHandle = () => {
  running.value = false
  clearInterval(timer.value)
}

const mounted = ref(false)
onMounted(() => {
  watch(
    () => [props.now, props.end],
    () => {
      if (props.modelValue !== undefined) return
      delta = props.now ? props.now - Date.now() : 0
      if (props.autorun) {
        startHandle()
      }
    },
    { immediate: props.autorun }
  )
  watch(
    () => props.modelValue,
    (val) => {
      if (val === undefined) return
      if (val) {
        startHandle()
      } else {
        stopHandle()
      }
    },
    { immediate: true }
  )
  mounted.value = true
})
onBeforeUnmount(() => {
  running.value = false
  clearInterval(timer.value)
})

defineExpose({ reference: containerRef, start: startHandle, stop: stopHandle })
</script>
