<template>
  <component :is="renderReference" />
  <transition name="v-fade">
    <div
      v-if="isShowPopper"
      :class="popperClass"
      :style="popperStyle"
      @mouseleave="leavePopper"
    >
      {{ text ?? textContent }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useZIndex from "../../composables/use-z-index"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { getNodes } from "../../utils/vnode"
import {
  ref,
  computed,
  watch,
  withDirectives,
  onMounted,
  onBeforeUnmount,
  h,
  Text
} from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"
import type { CSSProperties } from "vue"

const props = withDefaults(
  defineProps<{
    /** 文本 */
    text?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["ellipsis"]>
    /** 禁用 */
    disabled?: boolean
    /** padding + border的偏移量 */
    offset?: {
      top: number
      left: number
      right: number
      bottom: number
    }
  }>(),
  {
    text: undefined,
    class: undefined,
    ui: undefined,
    disabled: false,
    offset: () => ({
      top: 9,
      left: 9,
      right: 9,
      bottom: 9
    })
  }
)

const emits = defineEmits<{
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}>()

const slots = defineSlots<{
  default:() => ComponentSlot
}>()

const { disabled } = useInheritedDisabled(props)
const { ui } = useUi("ellipsis", props)

const popperClass = computed(() => {
  return classMerge(ui.value.popper, props.class)
})

const popperStyle = computed(() => {
  const style: CSSProperties = { ...fontStyle.value }
  style.top = `${position.value.top}px`
  style.left = `${position.value.left}px`
  style.right = `${position.value.right}px`
  style.minHeight = `${position.value.minHeight}px`
  style.zIndex = zIndex.value
  return style
})

const textContent = ref<string | null>()
const referenceRef = ref<HTMLElement>()
const setReferenceRef = (el: HTMLElement) => {
  referenceRef.value = el
  textContent.value = el.textContent
}
const setReferenceDirective = {
  mounted: setReferenceRef,
  updated: setReferenceRef
}
const renderReference = () => {
  if (!slots.default) return
  let vnodes = slots.default?.()
  vnodes = vnodes ? getNodes(vnodes) : []
  if (!vnodes?.length) {
    console.warn("[v-ellipsis]: default插槽没有可触发元素")
    return
  } else if (vnodes.length > 1) {
    console.warn("[v-ellipsis]: default插槽只能有一个元素")
    return
  }
  const vnode = vnodes[0].type === Text ? h("span", [vnodes[0]]) : vnodes[0]
  return withDirectives(vnode, [[setReferenceDirective]])
}

const isShowPopper = ref(false)
const position = ref<{
  top: number
  left: number
  right: number
  minHeight: number
}>({ top: 0, left: 0, right: 0, minHeight: 0 })
const fontStyle = ref<CSSProperties>({})

const { zIndex, updateZIndex, releaseZIndex } = useZIndex()

onMounted(() => {
  watch(
    referenceRef,
    (newVal, oldVal) => {
      if (oldVal instanceof HTMLElement) {
        oldVal.removeEventListener("mouseenter", mouseenterHandle)
        oldVal.removeEventListener("mouseleave", mouseleaveHandle)
      }
      if (newVal instanceof HTMLElement) {
        newVal.removeEventListener("mouseenter", mouseenterHandle)
        newVal.removeEventListener("mouseleave", mouseleaveHandle)
        newVal.addEventListener("mouseenter", mouseenterHandle)
        newVal.addEventListener("mouseleave", mouseleaveHandle)
      }
    },
    { immediate: true }
  )
})

let mouseenterTimer: number | undefined
const mouseenterHandle = (event: MouseEvent) => {
  if (mouseenterTimer) clearTimeout(mouseenterTimer)
  mouseenterTimer = window.setTimeout(() => {
    if (!referenceRef.value) return
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
      referenceRef.value
    const deltaHeight = scrollHeight - clientHeight
    const deltaWidth = scrollWidth - clientWidth
    const isShow = deltaHeight > 0.05 || deltaWidth > 0.05
    if (isShow) showPopper()
  }, 200)
  emits("mouseenter", event)
}
const mouseleaveHandle = (event: MouseEvent) => {
  if (mouseenterTimer) clearTimeout(mouseenterTimer)
  mouseenterTimer = undefined
  emits("mouseleave", event)
}
const leavePopper = () => {
  hidePopper()
}

const blurHandle = () => {
  hidePopper()
}
onMounted(() => {
  document.addEventListener("blur", blurHandle, { passive: true })
})
onBeforeUnmount(() => {
  document.removeEventListener("blur", blurHandle)
})

const showPopper = async () => {
  if (disabled.value || !referenceRef.value) return
  const rect = referenceRef.value.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(referenceRef.value)
  const top = parseFloat(computedStyle.paddingTop.replace("px", ""))
  const left = parseFloat(computedStyle.paddingLeft.replace("px", ""))
  const right = parseFloat(computedStyle.paddingRight.replace("px", ""))
  position.value = {
    top: rect.top - props.offset.top + top,
    left: rect.left - props.offset.left + left,
    right: window.innerWidth - rect.right - props.offset.right + right,
    minHeight: rect.height + props.offset.top + props.offset.bottom
  }
  if (position.value.top < 0) {
    const delta = Math.abs(position.value.top)
    position.value.top = 0
    position.value.minHeight -= delta
  } else if (position.value.right < 0) {
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
  releaseZIndex()
  isShowPopper.value = false
}
onBeforeUnmount(() => {
  releaseZIndex()
})
</script>
