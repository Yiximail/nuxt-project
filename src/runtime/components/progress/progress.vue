<template>
  <div ref="containerRef" :class="progressClass">
    <div :class="_barClass" :style="barStyle" />
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"
import type { CSSProperties } from "vue"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 运行状态 */
    modelValue?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 进度条类名 */
    barClass?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["progress"]>
    /** 固定开始端还是结束端 */
    fixed?: "start" | "end"
    /** 方向 */
    direction?: "horizontal" | "vertical"
    /** 初始值 0~100 静态的话这个写0 */
    from?: number
    /** 目标值 0~100 静态的话这个写百分比数量 */
    to?: number
    /** 从0到100 的总时长 */
    duration?: number
    /** 自动开始 */
    autorun?: boolean
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    barClass: undefined,
    ui: undefined,
    fixed: "start",
    direction: "horizontal",
    from: 0,
    to: 100,
    duration: 3000,
    autorun: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: boolean]
  end: []
}>()

const { ui } = useUi("progress", props)

const progressClass = computed(() => {
  return classMerge(
    ui.value.progress,
    ui.value[props.direction].progress,
    props.class
  )
})
const _barClass = computed(() => {
  return classMerge(ui.value.bar, ui.value[props.direction].bar, props.barClass)
})
const barStyle = computed(() => {
  const style = {} as CSSProperties
  let val = 100 - currentValue.value
  if (props.fixed === "start") val = -val
  if (props.direction === "horizontal") {
    style.transform = `translateX(${val}%)`
  } else {
    style.transform = `translateY(${val}%)`
  }
  return style
})

const currentValue = ref<number>(props.from)
let lastTime = 0
let running = false
const interval = () => {
  if (!running) return
  const deltaTime = Date.now() - lastTime
  lastTime = Date.now()
  if (!props.duration) {
    currentValue.value = props.to
    endHandle()
    return
  }
  const deltaPercent = (deltaTime / props.duration) * 100
  if (currentValue.value < props.to) {
    if (currentValue.value + deltaPercent > props.to) {
      currentValue.value = props.to
    } else {
      currentValue.value += deltaPercent
    }
  } else if (currentValue.value > props.to) {
    if (currentValue.value - deltaPercent < props.to) {
      currentValue.value = props.to
    } else {
      currentValue.value -= deltaPercent
    }
  }
  if (currentValue.value === props.to) {
    endHandle()
    return
  }
  requestAnimationFrame(interval)
}
const startHandle = () => {
  if (running) return
  // 重新开始
  if (currentValue.value === props.to) {
    currentValue.value = props.from
  }
  running = true
  emits("update:model-value", true)
  lastTime = Date.now()
  requestAnimationFrame(interval)
}
const pauseHandle = () => {
  running = false
  emits("update:model-value", false)
}
const endHandle = () => {
  running = false
  emits("update:model-value", false)
  emits("end")
}
const restartHandle = () => {
  currentValue.value = props.from
  lastTime = Date.now()
  startHandle()
}

onMounted(() => {
  lastTime = Date.now()
  watch(
    () => [props.from, props.to],
    () => {
      if (props.modelValue !== undefined) return
      if (props.autorun) startHandle()
    },
    { immediate: true }
  )
  watch(
    () => props.modelValue,
    (val) => {
      if (val === undefined) return
      if (val) {
        startHandle()
      } else {
        pauseHandle()
      }
    },
    { immediate: true }
  )
})
onBeforeUnmount(() => {
  running = false
})

defineExpose({
  reference: containerRef,
  restart: restartHandle,
  start: startHandle,
  pause: pauseHandle
})
</script>
