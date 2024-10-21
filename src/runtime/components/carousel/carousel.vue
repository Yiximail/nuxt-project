<template>
  <div
    ref="containerRef"
    :class="containerClass"
    :style="containerStyle"
    @mousedown="mousedownHandle"
    @mouseenter="mouseenterHandle"
    @mouseleave="mouseleaveHandle"
    @click.capture="clickHandle"
  >
    <component
      :is="item"
      v-for="(item, index) in renderList"
      v-show="
        current === index || current + 1 === index || current + 2 === index
      "
      :key="index"
      :style="itemStyle"
    />
    <slot
      name="control"
      :current="current"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :prev="prevHandle"
      :next="nextHandle"
      :jump="jumpHandle"
    >
      <div v-if="showDot" :class="dotClass">
        <div
          v-for="index in vnodes.length"
          :key="index"
          :class="
            classMerge(
              dotItemClass,
              index - 1 === current ? dotItemActivedClass : undefined
            )
          "
          data-index="index"
          @click="jumpHandle(index - 1)"
        />
      </div>
      <div v-if="showButton" :class="buttonListClass">
        <div :class="buttonClass" @click="prevHandle">
          <slot name="prev-icon">
            <v-icon
              icon="mdi:chevron-right"
              class="h-full w-full"
              :class="direction === 'horizontal' ? 'rotate-180' : '-rotate-90'"
            />
          </slot>
        </div>
        <div :class="buttonClass" @click="nextHandle">
          <slot name="next-icon">
            <v-icon
              icon="mdi:chevron-right"
              class="h-full w-full"
              :class="direction === 'horizontal' ? 'rotate-0' : 'rotate-90'"
            />
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import VProgress from "../progress/progress.vue"
import VIcon from "../icon/icon.vue"
import useUi from "../../composables/use-ui"
import useResizeObserver from "../../composables/use-resize-observer"

import classMerge from "../../utils/class-merge"
import { getNodes } from "../../utils/vnode"
import { ref, computed, watch, onMounted, h } from "vue"

import type {
  ComponentSlot,
  ClassNameValue,
  DeepPartial,
  UI
} from "../../types"
import type { CSSProperties } from "vue"

const containerRef = ref<HTMLDivElement>()
const progressRef = ref<InstanceType<typeof VProgress>[]>()

const props = withDefaults(
  defineProps<{
    /** 当前项 */
    modelValue?: number
    /** 自动轮播时长 */
    duration?: number
    /** 方向 */
    direction?: "horizontal" | "vertical"
    /** 边距 */
    margin?: number
    /** 是否显示点 */
    showDot?: boolean
    /** 是否显示按钮 */
    showButton?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["carousel"]>
  }>(),
  {
    modelValue: undefined,
    duration: undefined,
    direction: "horizontal",
    margin: 3,
    showDot: true,
    showButton: true,
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [value: number]
}>()

const slots = defineSlots<{
  default:() => ComponentSlot
  control: (props: {
    current: number
    offsetX: number
    offsetY: number
    prev: () => void
    next: () => void
    jump: (index: number) => void
  }) => ComponentSlot
  "prev-icon": () => ComponentSlot
  "next-icon": () => ComponentSlot
}>()

const { ui } = useUi("carousel", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value[props.direction].container,
    props.class
  )
})
const itemClass = computed(() => {
  return classMerge(ui.value.item, ui.value[props.direction].item)
})
const dotClass = computed(() => {
  return classMerge(ui.value.dot, ui.value[props.direction].dot)
})
const dotItemClass = computed(() => {
  return classMerge(ui.value.dotItem, ui.value[props.direction].dotItem)
})
const dotItemActivedClass = computed(() => {
  return classMerge(
    ui.value.dotItemActived,
    ui.value[props.direction].dotItemActived
  )
})
const buttonListClass = computed(() => {
  return classMerge(ui.value.buttonList, ui.value[props.direction].buttonList)
})
const buttonClass = computed(() => {
  return classMerge(ui.value.button, ui.value[props.direction].button)
})

const containerWidth = ref(0)
const itemWidth = computed(() => containerWidth.value + props.margin * 2)
const itemHeight = computed(() => containerHeight.value + props.margin * 2)
const containerHeight = ref(0)
const containerStyle = computed(() => {
  const style = {} as CSSProperties
  style["--carousel-width"] = `${containerWidth.value}px`
  style["--carousel-height"] = `${containerHeight.value}px`
  return style
})
const resizeCallback = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0]
  if (!entry) return
  containerWidth.value = entry.borderBoxSize[0].inlineSize
  containerHeight.value = entry.borderBoxSize[0].blockSize
}
useResizeObserver(containerRef, resizeCallback)

const vnodes = computed(() => {
  if (!slots.default) return []
  const vnodes = slots.default()
  return vnodes ? getNodes(vnodes) : []
})
const renderList = computed(() => {
  const className = ["v-carousel__item-class", itemClass.value]
  const list = vnodes.value
  if (list.length === 0) return []
  if (list.length === 1) {
    return [list[0], list[0], list[0]].map((vnode) =>
      h("div", { class: className }, vnode)
    )
  }
  return [list[list.length - 1], ...list, list[0]].map((vnode) =>
    h("div", { class: className }, vnode)
  )
})
const itemStyle = computed(() => {
  const style = {} as CSSProperties
  if (animating.value) {
    style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  }
  if (props.direction === "horizontal") {
    style.margin = `0 ${props.margin}px`
    const m = `${props.margin * 3}px`
    const d = `${offsetX.value}px`
    style.transform = `translateX(calc(-100% - ${m} + ${d}))`
  } else {
    style.margin = `${props.margin}px 0`
    const m = `${props.margin * 3}px`
    const d = `${offsetY.value}px`
    style.transform = `translateY(calc(-100% - ${m} + ${d}))`
  }
  return style
})

const current = ref(props.modelValue ?? 0)
const updateCurrent = (value: number) => {
  const length = vnodes.value.length
  current.value = (value + length) % length
  emits("update:model-value", value)
}
onMounted(() => {
  watch(
    () => props.modelValue,
    (value) => {
      if (value === undefined) return
      if (value === current.value) return
      jumpHandle(value)
    }
  )
})

let startX = 0
let startY = 0
const animating = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)
let stopClick = false
let indexchanged = false
const movePrev = () => {
  if (props.direction === "horizontal") {
    updateCurrent(current.value - 1)
    startX += itemWidth.value
    offsetX.value -= itemWidth.value
  } else {
    updateCurrent(current.value - 1)
    startY += itemHeight.value
    offsetY.value -= itemHeight.value
  }
}
const moveNext = () => {
  if (props.direction === "horizontal") {
    updateCurrent(current.value + 1)
    startX -= itemWidth.value
    offsetX.value += itemWidth.value
  } else {
    updateCurrent(current.value + 1)
    startY -= itemHeight.value
    offsetY.value += itemHeight.value
  }
}
const mousedownHandle = (event: MouseEvent) => {
  startX = event.clientX
  startY = event.clientY
  stopClick = false
  indexchanged = false
  animating.value = false
  pauseTimer()
  document.removeEventListener("mousemove", mousemoveHandle)
  document.removeEventListener("mouseup", mouseupHandle)
  document.addEventListener("mousemove", mousemoveHandle, { passive: false })
  document.addEventListener("mouseup", mouseupHandle, { passive: false })
}
const mousemoveHandle = (event: MouseEvent) => {
  if (props.direction === "horizontal") {
    offsetX.value = event.clientX - startX
    if (Math.abs(offsetX.value) > 5) stopClick = true
    if (offsetX.value > itemWidth.value * 0.5) {
      movePrev()
      indexchanged = true
    } else if (offsetX.value < itemWidth.value * -0.5) {
      moveNext()
      indexchanged = true
    }
  } else {
    offsetY.value = event.clientY - startY
    if (Math.abs(offsetY.value) > 5) stopClick = true
    if (offsetY.value > itemHeight.value * 0.5) {
      movePrev()
      indexchanged = true
    } else if (offsetY.value < itemHeight.value * -0.5) {
      moveNext()
      indexchanged = true
    }
  }
}
const mouseupHandle = async () => {
  document.removeEventListener("mousemove", mousemoveHandle)
  document.removeEventListener("mouseup", mouseupHandle)
  if (!indexchanged) {
    // 这里在当前页的时候，阈值改为20% 而不是 50%
    if (props.direction === "horizontal") {
      if (offsetX.value > itemWidth.value * 0.2) {
        movePrev()
      } else if (offsetX.value < itemWidth.value * -0.2) {
        moveNext()
      }
    } else {
      if (offsetY.value > itemHeight.value * 0.2) {
        movePrev()
      } else if (offsetY.value < itemHeight.value * -0.2) {
        moveNext()
      }
    }
    await new Promise((resolve) => window.requestAnimationFrame(resolve))
  }
  animating.value = true
  if (!isHovering.value) startTimer()
  startX = 0
  startY = 0
  offsetX.value = 0
  offsetY.value = 0
}
const clickHandle = (event: MouseEvent) => {
  if (!stopClick) return
  event.stopPropagation()
  event.preventDefault()
  stopClick = false
}

let pending = false
const prevItemJumppingIndex = ref<number>()
const nextItemJumppingIndex = ref<number>()
const prevHandle = async () => {
  const length = vnodes.value.length
  const index = (current.value - 1 + length) % length
  jumpHandle(index, "prev")
}
const nextHandle = async () => {
  const length = vnodes.value.length
  const index = (current.value + 1) % length
  jumpHandle(index, "next")
}
const jumpHandle = async (index: number, animateType?: "prev" | "next") => {
  if (index === current.value && !animateType) return
  if (pending) return
  pending = true
  animating.value = false
  const type = animateType ?? (index < current.value ? "prev" : "next")
  if (type === "prev") {
    prevItemJumppingIndex.value = undefined
    nextItemJumppingIndex.value = current.value
    current.value = index
  } else {
    prevItemJumppingIndex.value = current.value
    nextItemJumppingIndex.value = undefined
    current.value = index
  }
  if (props.direction === "horizontal") {
    const width = containerWidth.value + props.margin * 2
    offsetX.value = width * (type === "prev" ? -1 : 1)
  } else {
    const height = containerHeight.value + props.margin * 2
    offsetY.value = height * (type === "prev" ? -1 : 1)
  }
  await new Promise((resolve) => window.requestAnimationFrame(resolve))
  animating.value = true
  await new Promise((resolve) => window.requestAnimationFrame(resolve))
  offsetX.value = 0
  offsetY.value = 0
  initTimer()
  if (containerRef.value) {
    containerRef.value.addEventListener(
      "transitionend",
      () => (pending = false),
      { once: true }
    )
  } else {
    pending = false
  }
}

const isHovering = ref(false)
const mouseenterHandle = () => {
  isHovering.value = true
  pauseTimer()
}
const mouseleaveHandle = () => {
  isHovering.value = false
  if (animating.value) startTimer()
}
let timer: number | undefined
let startTime = 0
let restTime = 0
const initTimer = () => {
  if (current.value > vnodes.value.length - 1) {
    current.value = 0
  }
  startTime = 0
  restTime = 0
  if (props.duration) {
    if (!isHovering.value) {
      progressRef.value?.[0]?.restart()
      startTimer()
    }
  } else {
    window.clearTimeout(timer)
  }
}
const startTimer = () => {
  if (!restTime) restTime = props.duration ?? 0
  startTime = Date.now()
  window.clearTimeout(timer)
  timer = window.setTimeout(progressEnd, restTime)
}
const pauseTimer = () => {
  window.clearTimeout(timer)
  restTime = restTime - (Date.now() - startTime)
  startTime = 0
  if (restTime < 0) restTime = 0
}
const progressEnd = () => {
  restTime = props.duration ?? 0
  if (vnodes.value.length <= 1) progressRef.value?.[0]?.restart()
  nextHandle()
}
const mounted = ref(false)
onMounted(() => {
  watch(vnodes, () => {
    initTimer()
  })
  watch(
    () => props.duration,
    () => {
      initTimer()
    },
    { immediate: true }
  )
  mounted.value = true
})
</script>
