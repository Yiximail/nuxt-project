<template>
  <transition name="v-fade" @after-leave="destoryPopper">
    <div
      v-show="isShowPopper"
      :class="['v-native-scrollbar', ui.popper]"
      :style="popperStyle"
      @mouseleave="leavePopper"
      @wheel.stop.prevent
    >
      <template v-if="displayRow && displayColumn?.prop">
        {{ displayRow[displayColumn.prop] }}
      </template>
    </div>
  </transition>
</template>

<script setup lang="ts">
import useZIndex from "../../composables/use-z-index"

import useUi from "../../composables/use-ui"
import { computed, ref, onBeforeUnmount } from "vue"

import type { DeepPartial, TableItem, UI } from "../../types"
import type { TableColumn } from "../../types/injections"
import type { CSSProperties } from "vue"

const props = withDefaults(
  defineProps<{
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tableEllipsis"]>
    /** padding + border的偏移量 */
    offset?: {
      top: number
      left: number
      right: number
      bottom: number
    }
  }>(),
  {
    ui: undefined,
    offset: () => ({
      top: 8,
      left: 7,
      right: 7,
      bottom: 8
    })
  }
)

const { ui } = useUi("tableEllipsis", props)

const popperStyle = computed(() => {
  const style: CSSProperties = { ...fontStyle.value }
  style.top = `${position.value.top}px`
  style.left = `${position.value.left}px`
  style.right = `${position.value.right}px`
  style.minHeight = `${position.value.minHeight}px`
  style.zIndex = zIndex.value
  return style
})

const isShowPopper = ref(false)
const position = ref<{
  top: number
  left: number
  right: number
  minHeight: number
}>({ top: 0, left: 0, right: 0, minHeight: 0 })
const fontStyle = ref<CSSProperties>({})

const { zIndex, updateZIndex, releaseZIndex } = useZIndex()

let mouseenterTimer: number | undefined
let referenceEl = undefined as HTMLElement | undefined
let pendingEl = undefined as HTMLElement | undefined
const displayRow = ref<TableItem>()
const displayColumn = ref<TableColumn>()
let showFrameId: number | undefined
const mouseenter = (el: HTMLElement, row: TableItem, column: TableColumn) => {
  if (mouseenterTimer) clearTimeout(mouseenterTimer)
  if (pendingEl) hidePopper()
  pendingEl = el
  mouseenterTimer = window.setTimeout(() => {
    if (!pendingEl || pendingEl !== el) return
    displayRow.value = row
    displayColumn.value = column
    if (showFrameId) cancelAnimationFrame(showFrameId)
    showFrameId = requestAnimationFrame(showPopper)
  }, 200)
}
const mouseleave = () => {
  if (mouseenterTimer) clearTimeout(mouseenterTimer)
  mouseenterTimer = undefined
}
const leavePopper = () => {
  hidePopper()
}

const showPopper = () => {
  referenceEl = pendingEl
  pendingEl = undefined
  showFrameId = undefined
  if (!referenceEl) return
  const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
    referenceEl
  const deltaHeight = scrollHeight - clientHeight
  const deltaWidth = scrollWidth - clientWidth
  const isShow = deltaHeight > 0.05 || deltaWidth > 0.05
  if (!isShow) return
  const rect = referenceEl.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(referenceEl)
  const top = parseFloat(computedStyle.paddingTop.replace("px", ""))
  const left = parseFloat(computedStyle.paddingLeft.replace("px", ""))
  const right = parseFloat(computedStyle.paddingRight.replace("px", ""))
  position.value = {
    top: rect.top - props.offset.top + top,
    left: rect.left - props.offset.left + left,
    right: window.innerWidth - rect.right + props.offset.right - right,
    minHeight: rect.height + props.offset.top + props.offset.bottom
  }
  if (position.value.top < 0) {
    const delta = Math.abs(position.value.top)
    position.value.top = 0
    position.value.minHeight -= delta
  }
  if (position.value.right < 0) {
    const delta = Math.abs(position.value.right)
    position.value.right = 0
    position.value.minHeight -= delta
  }
  fontStyle.value = {
    fontSize: computedStyle.fontSize,
    fontFamily: computedStyle.fontFamily,
    fontWeight: computedStyle.fontWeight,
    lineHeight: computedStyle.lineHeight
  }
  updateZIndex()
  isShowPopper.value = true
}
const hidePopper = () => {
  isShowPopper.value = false
}
const destoryPopper = () => {
  releaseZIndex()
}
onBeforeUnmount(() => {
  releaseZIndex()
})

defineExpose({ mouseenter, mouseleave, hidePopper })
</script>
