<template>
  <div ref="containerRef" :class="containerClass" v-bind="$attrs">
    <div ref="tabsRef" :class="ui.tabs" v-bind="$attrs">
      <div
        v-if="isShowButton"
        ref="leftButtonRef"
        :class="ui.button"
        @click="scrollLeft"
      >
        <v-icon
          icon="mdi:chevron-right"
          class="rotate-180"
          :class="ui.buttonIcon"
        />
      </div>
      <div ref="contentRef" :class="ui.content">
        <div ref="wrapperRef" :class="ui.wrapper">
          <slot />
        </div>
        <div
          ref="lineRef"
          :class="ui.floatingLine"
          style="transform: translateX(0px) scaleX(0)"
        />
      </div>
      <div
        v-if="isShowButton"
        ref="rightButtonRef"
        :class="ui.button"
        @click="scrollRight"
      >
        <v-icon icon="mdi:chevron-right" :class="ui.buttonIcon" />
      </div>
    </div>
    <transition :name="transitionName">
      <component
        :is="renderingVnode"
        v-if="renderingVnode"
        :key="renderingKey"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TABS_INJECTION } from "../../utils/injection-keys"
import { ref, computed, watch, onMounted, onBeforeUnmount, provide } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"
import type { VNode } from "vue"

const containerRef = ref<HTMLDivElement>()
const tabsRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLElement>()
const wrapperRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()
const leftButtonRef = ref<HTMLElement>()
const rightButtonRef = ref<HTMLElement>()

const props = withDefaults(
  defineProps<{
    /** 当前激活项 */
    modelValue?: number | string | undefined
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tabs"]>
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [val: number | string | undefined]
}>()

const { ui } = useUi("tabs", props)
useClickRipple(leftButtonRef, {})
useClickRipple(rightButtonRef, {})

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const transitionName = ref<string>("")
const renderVnode = ref<VNode>()
const renderingVnode = ref<VNode>()
const renderingKey = ref<number | string>()

let elementWidth = 0
let elementLeft = 0
const updateElement = (element: HTMLElement | undefined) => {
  if (!lineRef.value) return
  if (element) {
    const rect = element.getBoundingClientRect()
    if (!elementWidth) {
      lineRef.value.style.transition = "none"
      lineRef.value.style.transform = `translateX(${element.offsetLeft}px) scaleX(${0}%)`
      // 强制刷新dom
      // eslint-disable-next-line no-unused-expressions
      lineRef.value.offsetHeight
    }
    lineRef.value.style.transition = ""
    lineRef.value.style.transform = `translateX(${element.offsetLeft}px) scaleX(${rect.width}%)`
    if (!elementWidth) {
      // 没有激活状态
      transitionName.value = "v-tabs-panel-fade"
    } else if (elementLeft > element.offsetLeft) {
      transitionName.value = "v-tabs-panel-left"
    } else {
      transitionName.value = "v-tabs-panel-right"
    }
    renderingVnode.value = renderVnode.value
    renderingKey.value = actived.value
    elementWidth = rect.width
    elementLeft = element.offsetLeft
  } else {
    transitionName.value = ""
    elementWidth = 0
    lineRef.value.style.transition = "v-tabs-panel-fade"
    lineRef.value.style.transform = `translateX(${elementLeft}px) scaleX(${elementWidth}%)`
    renderingVnode.value = renderVnode.value
    renderingKey.value = actived.value
  }
}
const actived = ref<string | number | undefined>()
const setActived = (index: string | number | undefined, vnode?: VNode) => {
  actived.value = index
  renderVnode.value = vnode
  emits("update:model-value", index)
}

provide(TABS_INJECTION, {
  actived,
  setActived,
  updateElement
})

watch(
  () => props.modelValue,
  (value) => {
    if (actived.value === value) return
    setActived(value)
  },
  { immediate: true }
)

const isShowButton = ref(false)
let contentWidth = 0
let wrapperWidth = 0
const resizeCallback = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    const val = entry.borderBoxSize[0]
    if (entry.target === contentRef.value) {
      contentWidth = val.inlineSize
    } else if (entry.target === wrapperRef.value) {
      wrapperWidth = val.inlineSize
    }
  }
  isShowButton.value = contentWidth < wrapperWidth
}

let observerInstance: ResizeObserver | undefined
onMounted(() => {
  observerInstance = new ResizeObserver(resizeCallback)
  if (!contentRef.value || !wrapperRef.value) return
  observerInstance.observe(contentRef.value)
  observerInstance.observe(wrapperRef.value)
  requestAnimationFrame(() => {
    if (!contentRef.value || !wrapperRef.value) return
    const contentRect = contentRef.value.getBoundingClientRect()
    const wrapperRect = wrapperRef.value.getBoundingClientRect()
    contentWidth = contentRect.width
    wrapperWidth = wrapperRect.width
    isShowButton.value = contentWidth < wrapperWidth
  })
})
onBeforeUnmount(() => {
  observerInstance?.disconnect()
})

const scrollLeft = () => {
  if (!contentRef.value) return
  const scrollLeft = contentRef.value.scrollLeft
  contentRef.value.scrollTo({
    left: Math.max(scrollLeft - 200, 0),
    behavior: "smooth"
  })
}
const scrollRight = () => {
  if (!contentRef.value) return
  const scrollLeft = contentRef.value.scrollLeft
  const max = contentRef.value.scrollWidth - contentRef.value.clientWidth
  contentRef.value.scrollTo({
    left: Math.min(scrollLeft + 200, max),
    behavior: "smooth"
  })
}

defineExpose({ reference: containerRef })
</script>

<style scoped>
.v-tabs-panel-left-enter-active,
.v-tabs-panel-left-leave-active,
.v-tabs-panel-right-enter-active,
.v-tabs-panel-right-leave-active {
  transition:
    opacity 0.3s linear,
    transform 0.3s linear;
}

.v-tabs-panel-left-enter-from,
.v-tabs-panel-right-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
.v-tabs-panel-left-leave-to,
.v-tabs-panel-right-enter-from {
  opacity: 0;
  transform: translateX(15px);
}

.v-tabs-panel-left-leave-active,
.v-tabs-panel-right-leave-active {
  position: absolute;
}

.v-tabs-panel-fade-enter-active,
.v-tabs-panel-fade-leave-active {
  transition: opacity 0.3s linear;
}

.v-tabs-panel-fade-enter-from,
.v-tabs-panel-fade-leave-to {
  opacity: 0;
}
</style>
