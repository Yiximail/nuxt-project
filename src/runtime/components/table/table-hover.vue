<template>
  <div
    v-show="isShowPopper"
    :class="className"
    :style="popperStyle"
    @mouseenter="mouseenterHandle"
    @mouseleave="mouseleaveHandle"
    @wheel.stop.prevent
  >
    <component :is="hoverSlot" v-if="displayRow" :row="displayRow" />
  </div>
</template>

<script setup lang="ts">
import useZIndex from "../../composables/use-z-index"

import { computed, ref, toRef, onMounted, onBeforeUnmount } from "vue"

import type { ClassNameValue, TableItem, ComponentSlot } from "../../types"
import type { CSSProperties } from "vue"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** scroller */
    scroller: HTMLElement | undefined
    /** hover插槽 */
    hoverSlot:(props: { row: TableItem }) => ComponentSlot
  }>(),
  {
    hoverSlot: undefined,
    class: undefined
  }
)
const className = toRef(props, "class")

const popperStyle = computed(() => {
  const style: CSSProperties = {}
  style["--reference-top"] = `${position.value.top}px`
  style["--reference-left"] = `${position.value.left}px`
  style["--reference-right"] = `${position.value.right}px`
  style["--reference-bottom"] = `${position.value.bottom}px`
  style.zIndex = zIndex.value
  return style
})

const isShowPopper = ref(false)
const position = ref<{
  top: number
  left: number
  right: number
  bottom: number
}>({ top: 0, left: 0, right: 0, bottom: 0 })

const { zIndex, updateZIndex, releaseZIndex } = useZIndex()

let referenceRef: HTMLElement | undefined
let mouseleaveTimer: number | undefined
let showframeId: number | undefined
const displayRow = ref<TableItem>()
const mouseenter = (el: HTMLElement, row: TableItem) => {
  if (!props.hoverSlot) return
  clearTimeout(mouseleaveTimer)
  mouseleaveTimer = undefined
  referenceRef = el
  displayRow.value = row
  if (showframeId) cancelAnimationFrame(showframeId)
  showframeId = requestAnimationFrame(showPopper)
}
const mouseleave = () => {
  clearTimeout(mouseleaveTimer)
  mouseleaveTimer = window.setTimeout(() => {
    hidePopper()
  }, 200)
}

const mouseenterHandle = () => {
  clearTimeout(mouseleaveTimer)
  mouseleaveTimer = undefined
}
const mouseleaveHandle = () => {
  clearTimeout(mouseleaveTimer)
  mouseleaveTimer = window.setTimeout(() => {
    hidePopper()
  }, 200)
}

const showPopper = () => {
  showframeId = undefined
  if (!referenceRef || !props.scroller) return
  const rect = referenceRef.getBoundingClientRect()
  const scrollerRect = props.scroller.getBoundingClientRect()
  const containerLeft = scrollerRect.left
  const containerRight = window.innerWidth - scrollerRect.right
  position.value = {
    top: rect.top,
    bottom: rect.bottom,
    left: Math.max(rect.left, containerLeft),
    right: Math.max(window.innerWidth - rect.right, containerRight)
  }
  updateZIndex()
  isShowPopper.value = true
}
const hidePopper = () => {
  isShowPopper.value = false
  releaseZIndex()
}

onMounted(() => {
  document.addEventListener("blur", hidePopper, { passive: true })
})
onBeforeUnmount(() => {
  document.removeEventListener("blur", hidePopper)
})

let updateFrameId: number | undefined
const scrollHandle = () => {
  if (updateFrameId) cancelAnimationFrame(updateFrameId)
  updateFrameId = requestAnimationFrame(update)
}
const update = () => {
  updateFrameId = undefined
  if (!referenceRef || !props.scroller) return
  const rect = referenceRef.getBoundingClientRect()
  const scrollerRect = props.scroller.getBoundingClientRect()
  const containerLeft = scrollerRect.left
  const containerRight = window.innerWidth - scrollerRect.right
  position.value = {
    top: rect.top,
    bottom: rect.bottom,
    left: Math.max(rect.left, containerLeft),
    right: Math.max(window.innerWidth - rect.right, containerRight)
  }
  const scrollerTop = scrollerRect.top
  const scrollerBottom = scrollerRect.bottom
  if (rect.top < scrollerTop || position.value.bottom > scrollerBottom) {
    hidePopper()
  }
}
onMounted(() => {
  window.addEventListener("scroll", scrollHandle, {
    capture: true,
    passive: true
  })
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollHandle, { capture: true })
})

defineExpose({ mouseenter, mouseleave, hidePopper })
</script>
