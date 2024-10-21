<template>
  <div ref="trackRef" :class="trackClass" :style="trackStyle">
    <div
      v-if="contentValue && containerValue && containerValue < contentValue"
      ref="thumbRef"
      :class="['v-scrollbar-thumb', thumbClass]"
      :style="thumbStyle"
      @mousedown="mousedown"
    />
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"
import type { CSSProperties } from "vue"

export type ScrollbarBarUi = UI["scrollbarBar"]

const props = defineProps<{
  /** 是否是水平滚动条 */
  type: "horizontal" | "vertical"
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<ScrollbarBarUi>
}>()

const emits = defineEmits<{
  "scroll-to": [value: { top?: number; left?: number }]
}>()

const { ui } = useUi("scrollbarBar", props)

const trackClass = computed(() => {
  return classMerge(
    ui.value[props.type].track,
    isActive.value && ui.value[props.type].active,
    props.class
  )
})
const thumbClass = computed(() => {
  return classMerge(
    ui.value[props.type].thumb,
    isActive.value && ui.value[props.type].thumbActive
  )
})

const trackRef = ref<HTMLDivElement>()
const thumbRef = ref<HTMLDivElement>()
// 滚动条本身长度
const scrollbarValue = ref(0)
const scrollbarRatio = computed(() => scrollbarValue.value / contentValue.value)

// 拖拽中
const isActive = ref(false)
const trackStyle = computed(() => {
  const style: CSSProperties = {}
  if (isActive.value) style.opacity = 1
  return style
})

// 内容长度
const contentValue = ref(0)
// 容器长度
const containerValue = ref(0)
// 滚动偏移量
const scrollOffset = ref(0)
// 滚动滑块样式
const thumbStyle = computed(() => {
  const style: CSSProperties = {}
  const length = (containerValue.value / contentValue.value) * 100
  const transform = (scrollOffset.value / containerValue.value) * 100
  if (props.type === "horizontal") {
    style.width = `${length}%`
    style.transform = `translateX(${transform}%)`
  } else {
    style.height = `${length}%`
    style.transform = `translateY(${transform}%)`
  }
  if (isActive.value) style.opacity = 1
  return style
})
// 更新滚动位置
const updateScroll = (scrollValue: number) => {
  scrollOffset.value = scrollValue
}
// 更新容器
const updateContainer = (clientValue: number, scrollValue: number) => {
  if (trackRef.value) {
    if (props.type === "horizontal") {
      scrollbarValue.value = trackRef.value.clientWidth
    } else {
      scrollbarValue.value = trackRef.value.clientHeight
    }
  } else {
    scrollbarValue.value = 0
  }
  contentValue.value = scrollValue
  containerValue.value = clientValue
}

// 初始位置
let startValue: number | undefined
// 初始偏移量
let startOffset: number | undefined
// document层的鼠标移动监视
const mousemove = (event: MouseEvent) => {
  if (startValue === undefined || startOffset === undefined) return
  if (props.type === "horizontal") {
    const offset = event.clientX - startValue
    const left = startOffset + offset / scrollbarRatio.value
    emits("scroll-to", { left })
  } else {
    const offset = event.clientY - startValue
    const top = startOffset + offset / scrollbarRatio.value
    emits("scroll-to", { top })
  }
}
// 松开鼠标
const mouseup = () => {
  document.removeEventListener("mousemove", mousemove)
  document.removeEventListener("mouseup", mouseup)
  startValue = undefined
  startOffset = undefined
  isActive.value = false
}
// 点击滚动条的事件
const mousedown = (event: MouseEvent) => {
  if (event.button !== 0) return
  if (props.type === "horizontal") {
    startValue = event.clientX
    startOffset = scrollOffset.value
  } else {
    startValue = event.clientY
    startOffset = scrollOffset.value
  }
  document.addEventListener("mousemove", mousemove, { passive: true })
  document.addEventListener("mouseup", mouseup, { passive: true })
  isActive.value = true
}

defineExpose({ _ui: ui.value, updateScroll, updateContainer })
</script>

<style scoped>
.v-scrollbar-thumb {
  transition-property: width, height, opacity, background-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
}
</style>
