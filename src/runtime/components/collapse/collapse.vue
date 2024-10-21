<template>
  <transition
    :css="false"
    :appear="appear"
    @enter="enterHandle"
    @after-enter="afterEnterHandle"
    @leave="leaveHandle"
    @after-leave="afterLeaveHandle"
  >
    <div
      v-if="alwaysRender"
      v-show="show || beforeMountedShow"
      ref="containerRef"
      v-bind="$attrs"
    >
      <slot />
    </div>
    <div
      v-else-if="show || beforeMountedShow"
      ref="containerRef"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 是否展开 */
    show?: boolean
    /** 显示时动画 */
    appear?: boolean
    /** 类型 */
    type?: "vertical" | "horizontal"
    /** 总是渲染 */
    alwaysRender?: boolean
    /** 动画时长 */
    duration?: number
  }>(),
  {
    show: false,
    appear: false,
    type: "vertical",
    class: undefined,
    ui: undefined,
    alwaysRender: false,
    duration: 300
  }
)

const emits = defineEmits<{
  enter: []
  "after-enter": []
  leave: []
  "after-leave": []
}>()

let doneCallback: (() => void) | undefined
const animationEnd = () => {
  doneCallback?.()
  doneCallback = undefined
}
const enterHandle = (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return done()
  if (beforeMountedShow.value) return done()
  if (!doneCallback) {
    el.style.overflow = "hidden"
    el.style.opacity = "0"
    if (props.type === "vertical") {
      el.style.height = "0"
      el.style.willChange = "height, opacity"
    } else {
      el.style.width = "0"
      el.style.willChange = "width, opacity"
    }
  }
  requestAnimationFrame(() => {
    if (props.type === "vertical") {
      el.style.transition = `height ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      el.style.height = `${el.scrollHeight}px`
      el.style.opacity = "1"
    } else {
      el.style.transition = `width ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      el.style.width = `${el.scrollWidth}px`
      el.style.opacity = "1"
    }
    doneCallback?.()
    doneCallback = done
    el.removeEventListener("transitionend", animationEnd)
    el.addEventListener("transitionend", animationEnd, { once: true })
    emits("enter")
  })
}

const afterEnterHandle = (el: Element) => {
  if (!(el instanceof HTMLElement)) return
  if (beforeMountedShow.value) {
    beforeMountedShow.value = false
    return
  }
  el.style.overflow = ""
  el.style.height = ""
  el.style.width = ""
  el.style.transition = ""
  el.style.opacity = ""
  el.style.willChange = ""
  emits("after-enter")
}

const leaveHandle = (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return done()
  if (!doneCallback) {
    el.style.overflow = "hidden"
    el.style.opacity = "0"
    if (props.type === "vertical") {
      el.style.height = `${el.scrollHeight}px`
      el.style.opacity = "1"
      el.style.willChange = "height, opacity"
    } else {
      el.style.width = `${el.scrollWidth}px`
      el.style.opacity = "1"
      el.style.willChange = "width, opacity"
    }
  }
  requestAnimationFrame(() => {
    if (props.type === "vertical") {
      el.style.transition = `height ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      el.style.height = "0"
      el.style.opacity = "0"
    } else {
      el.style.transition = `width ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${props.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      el.style.width = "0"
      el.style.opacity = "0"
    }
    doneCallback?.()
    doneCallback = done
    el.removeEventListener("transitionend", animationEnd)
    el.addEventListener("transitionend", animationEnd, { once: true })
    emits("leave")
  })
}
const afterLeaveHandle = (el: Element) => {
  if (!(el instanceof HTMLElement)) return
  el.style.overflow = ""
  el.style.height = ""
  el.style.width = ""
  el.style.transition = ""
  el.style.opacity = ""
  el.style.willChange = ""
  emits("after-leave")
}

const beforeMountedShow = ref(props.appear && !props.show)

defineExpose({ container: containerRef })
</script>
