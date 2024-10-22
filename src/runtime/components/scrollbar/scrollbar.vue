<template>
  <div ref="containerRef" :class="containerClass">
    <div
      ref="contentRef"
      :class="contentClass"
      @scroll="$emit('scroll', $event)"
    >
      <div ref="viewRef" :class="viewClass">
        <slot />
      </div>
    </div>
    <v-scrollbar-bar
      v-if="property !== 'scrollXOnly'"
      ref="verticalRef"
      :class="verticalClass"
      type="vertical"
      :ui="scrollbarBarUi"
      @scroll-to="scrollTo"
    />
    <v-scrollbar-bar
      v-if="property !== 'scrollYOnly'"
      ref="horizontalRef"
      :class="horizontalClass"
      type="horizontal"
      :ui="scrollbarBarUi"
      @scroll-to="scrollTo"
    />
  </div>
</template>

<script setup lang="ts">
import VScrollbarBar from "./scrollbar-bar.vue"
import useScrollbar from "../../composables/use-scrollbar"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { SCROLLBAR_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide, toRef } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"
import type { ScrollbarBarUi } from "./scrollbar-bar.vue"

const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()
const viewRef = ref<HTMLDivElement>()

const verticalRef = ref<InstanceType<typeof VScrollbarBar>>()
const horizontalRef = ref<InstanceType<typeof VScrollbarBar>>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 垂直滚动条类名 */
    verticalClass?: ClassNameValue
    /** 水平滚动条类名 */
    horizontalClass?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["scrollbar"]> & DeepPartial<ScrollbarBarUi>
    /** 沿 x 轴滚动 */
    scrollX?: boolean
    /** 沿 y 轴滚动 */
    scrollY?: boolean
    /** 是否外置滚动条 */
    outset?: boolean
    /** 判断阈值 */
    threshold?: number
  }>(),
  {
    class: undefined,
    verticalClass: undefined,
    horizontalClass: undefined,
    ui: undefined,
    scrollX: false,
    scrollY: true,
    outset: false,
    threshold: 20
  }
)

const emits = defineEmits<{
  scroll: [ev: Event]
  resize: []
  "scroll-to-top": []
  "scroll-to-bottom": []
}>()

defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("scrollbar", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value[property.value].container,
    props.outset && ui.value[property.value].outset,
    ui.value.container,
    props.class
  )
})
const contentClass = computed(() => {
  return classMerge(ui?.value?.[property.value]?.content, ui?.value?.content)
})
const viewClass = computed(() => {
  return classMerge(ui?.value?.[property.value]?.view, ui?.value?.view)
})

const property = computed(() => {
  if (props.scrollX && props.scrollY) return "scrollBoth"
  if (props.scrollY) return "scrollYOnly"
  if (props.scrollX) return "scrollXOnly"
  return "scrollYOnly"
})
const scrollbarBarUi = computed(() => {
  if (!ui?.value) return undefined
  return {
    horizontal: ui.value.horizontal,
    vertical: ui.value.vertical
  }
})

const { scrollTo } = useScrollbar(
  contentRef,
  viewRef,
  { verticalRef, horizontalRef },
  toRef(props, "threshold"),
  {
    resize: () => emits("resize"),
    scrollToTop: () => emits("scroll-to-top"),
    scrollToBottom: () => emits("scroll-to-bottom")
  }
)

provide(SCROLLBAR_INJECTION, { scrollbar: contentRef })

defineExpose({ reference: containerRef, scrollTo })
</script>
