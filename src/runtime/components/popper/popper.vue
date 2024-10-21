<template>
  <component :is="renderReference" v-if="!reference" />
  <teleport v-if="toBody" to="body">
    <transition
      :css="false"
      @enter="enterHandle"
      @leave="leaveHandle"
      @enter-cancelled="enterCancelled"
      @leave-cancelled="leaveCancelled"
    >
      <div
        v-if="popperList.length > 0 || (modelValue ?? isShow)"
        ref="popperRef"
        :class="ui.popper"
        :style="{ zIndex: zIndex, ...popperStyles }"
        v-bind="$attrs"
      >
        <div :class="contentClass">
          <slot
            name="content"
            :update="updatePosition"
            :show="showPopper"
            :hide="hidePopper"
          />
        </div>
        <div v-if="arrow" ref="arrowRef" :style="arrowStyles" />
      </div>
    </transition>
  </teleport>
  <transition
    v-else
    :css="false"
    @enter="enterHandle"
    @leave="leaveHandle"
    @enter-cancelled="enterCancelled"
    @leave-cancelled="leaveCancelled"
  >
    <div
      v-if="popperList.length > 0 || (modelValue ?? isShow)"
      ref="popperRef"
      :class="ui.popper"
      :style="{ zIndex: zIndex, ...popperStyles }"
      v-bind="$attrs"
    >
      <div :class="contentClass">
        <slot
          name="content"
          :update="updatePosition"
          :show="showPopper"
          :hide="hidePopper"
        />
        <div
          v-if="arrow"
          ref="arrowRef"
          :class="ui.arrow"
          :style="arrowStyles"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  withDirectives,
  h,
  Text,
  inject,
  provide,
  onMounted,
  onBeforeUnmount
} from "vue"

import {
  POPPER_INJECTION,
  FIELDSET_INJECTION,
  FORM_ITEM_INJECTION,
  INHERITED_SIZE,
  INHERITED_DISABLED
} from "../../utils/injection-keys"
import guid from "../../utils/guid"
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { getNodes } from "../../utils/vnode"

import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useZIndex from "../../composables/use-z-index"
import usePopper from "../../composables/use-popper"

import type {
  ComponentSlot,
  ReferenceAbleComponent,
  PopperProps
} from "../../types"

defineOptions({
  inheritAttrs: false
})

const popperRef = ref<HTMLDivElement>()
const arrowRef = ref<HTMLDivElement>()

const props = withDefaults(defineProps<PopperProps>(), {
  modelValue: undefined,
  class: undefined,
  ui: undefined,
  disabled: undefined,
  beforeShow: undefined,
  beforeHide: undefined,
  clickOutsideClose: true,
  trigger: () => ["click", "hover", "focus"],
  inheritWidth: false,
  strategy: "absolute",
  toBody: false,
  reference: undefined,
  openDelay: 200,
  closeDelay: 300,
  placement: undefined,
  placementStrategy: "flip",
  padding: 0,
  offset: 0,
  arrow: true,
  arrowPadding: 12,
  duration: 300,
  interceptProps: true,
  interceptForm: true
})

const emits = defineEmits<{
  "update:model-value": [val: boolean]
  "before-show": []
  show: []
  showed: []
  "before-hide": []
  hide: []
  hid: []
  "click-outside": []
}>()

const slots = defineSlots<{
  default:(props: {
    update: () => void
    show: () => void
    hide: () => void
  }) => ComponentSlot
  content: (props: {
    update: () => void
    show: () => void
    hide: () => void
  }) => ComponentSlot
}>()

const { ui } = useUi("popper", props)

const { disabled } = useInheritedDisabled(props)

const contentClass = computed(() => {
  return classMerge(ui.value.content, props.class)
})

const { zIndex, updateZIndex, releaseZIndex } = useZIndex()

const referenceRef = ref<HTMLElement>()
const setReferenceRef = (el: HTMLElement) => {
  referenceRef.value = el
}
const setReferenceDirective = {
  mounted: setReferenceRef,
  updated: setReferenceRef
}
const renderReference = () => {
  if (props.reference) return
  if (!slots.default) return
  let vnodes = slots.default?.({
    update: updatePosition,
    show: showPopper,
    hide: hidePopper
  })
  vnodes = vnodes ? getNodes(vnodes) : []
  if (!vnodes?.length) {
    console.warn("[v-popper]: default插槽没有可触发元素")
    return
  } else if (vnodes.length > 1) {
    console.warn("[v-popper]: default插槽只能有一个元素")
    return
  }
  const vnode = vnodes[0].type === Text ? h("span", [vnodes[0]]) : vnodes[0]
  return withDirectives(vnode, [[setReferenceDirective]])
}

const referenceElement = computed(() => {
  if (
    props.reference instanceof HTMLElement ||
    props.reference instanceof SVGElement
  ) {
    return props.reference as HTMLElement | SVGElement
  }
  const component = props.reference as ReferenceAbleComponent
  const componentRef = component?.reference
  return componentRef ?? referenceRef.value
})

const popperInjection = inject(POPPER_INJECTION, undefined)
const popperList = ref<string[]>([])
const popperId = guid()
const setPopper = (id: string) => {
  const index = popperList.value.indexOf(id)
  if (index === -1) popperList.value.push(id)
  popperInjection?.setPopper(id)
}
const removePopper = (id: string) => {
  const index = popperList.value.indexOf(id)
  if (index !== -1) popperList.value.splice(index, 1)
  popperInjection?.removePopper(id)
}
provide(POPPER_INJECTION, { setPopper, removePopper })
onBeforeUnmount(() => {
  removePopper(popperId)
})

const { initPopper, updatePosition, popperStyles, arrowStyles } =
  usePopper(referenceElement, popperRef, arrowRef, props)

let doneCallback: (() => void) | undefined
const show = (el: HTMLElement) => {
  el.style.opacity = "0"
  const content = el.firstElementChild as HTMLElement
  content.style.transform = "scale(0.8)"
  content.style.transformOrigin = "var(--popper-transform-origin)"
  emits("show")
  window.requestAnimationFrame(() => {
    el.style.transition = "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)"
    el.style.opacity = "1"
    content.style.transition = "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"
    content.style.transform = "scale(1)"
    el.removeEventListener("transitionend", showed)
    el.addEventListener("transitionend", showed, { once: true })
  })
}
const showed = (ev: TransitionEvent) => {
  if (ev.currentTarget instanceof HTMLElement) {
    const content = ev.currentTarget.firstElementChild as HTMLElement
    ev.currentTarget.style.transition = ""
    ev.currentTarget.style.opacity = ""
    content.style.transition = ""
    // content.style.transformOrigin = ""
    // content.style.transform = ""
  }
  doneCallback?.()
  doneCallback = undefined
  emits("showed")
}
const hide = (el: HTMLElement) => {
  el.style.opacity = "1"
  emits("hide")
  const content = el.firstElementChild as HTMLElement
  content.style.transform = "scale(1)"
  content.style.transformOrigin = "var(--popper-transform-origin)"
  window.requestAnimationFrame(() => {
    el.style.transition = "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)"
    el.style.opacity = "0"
    content.style.transition = "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"
    content.style.transform = "scale(0.8)"
    el.removeEventListener("transitionend", hid)
    el.addEventListener("transitionend", hid, { once: true })
  })
}
const hid = () => {
  doneCallback?.()
  doneCallback = undefined
  releaseZIndex()
  emits("hid")
}

const enterHandle = (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return
  if (!referenceElement.value) return
  initPopper(() => {
    updateZIndex()
    show(el)
  })
  popperInjection?.setPopper(popperId)
  doneCallback?.()
  doneCallback = done
}
const leaveHandle = (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return
  hide(el)
  popperInjection?.removePopper(popperId)
  doneCallback?.()
  doneCallback = done
}
const enterCancelled = (el: Element) => {
  if (!(el instanceof HTMLElement)) return
  el.removeEventListener("transitionend", showed)
}
const leaveCancelled = (el: Element) => {
  if (!(el instanceof HTMLElement)) return
  el.removeEventListener("transitionend", hid)
}

const isShow = ref(false)
let intersctionObserverInstance: IntersectionObserver | undefined
const intersectionCallback: IntersectionObserverCallback = (entries) => {
  const item = entries?.[0]
  if (!item) return
  if (!item.isIntersecting) hidePopper()
}
onMounted(() => {
  watch(
    () => props.modelValue,
    (val) => {
      if (val && !isShow.value) {
        showPopper()
      } else if (!val && isShow.value) {
        hidePopper()
      }
    },
    { immediate: true }
  )
})
const showPopper = async () => {
  if (disabled.value) return
  if (isShow.value) return

  emits("before-show")

  const showResult = await props.beforeShow?.()
  if (showResult === false) return

  if (!intersctionObserverInstance) {
    intersctionObserverInstance = new IntersectionObserver(intersectionCallback)
  }
  if (referenceElement.value && referenceElement.value instanceof HTMLElement) {
    intersctionObserverInstance.observe(referenceElement.value)
  }

  isShow.value = true
  emits("update:model-value", true)

  await new Promise((resolve) => window.setTimeout(resolve))
  document.removeEventListener("keydown", escCloseHandle)
  document.addEventListener("keydown", escCloseHandle)
  document.removeEventListener("mousedown", documentClickHandle)
  document.addEventListener("mousedown", documentClickHandle)
}
const hidePopper = async () => {
  if (disabled.value) return
  if (!isShow.value) return

  emits("before-hide")

  const hideResult = await props.beforeHide?.()
  if (hideResult === false) return

  if (intersctionObserverInstance) {
    intersctionObserverInstance.disconnect()
  }

  isClicked = false
  isFocusing = false
  clearTimeout(focusTimer)
  isHovering = false
  clearTimeout(hoverTimer)

  isShow.value = false
  emits("update:model-value", false)

  await new Promise((resolve) => window.setTimeout(resolve))
  document.removeEventListener("keydown", escCloseHandle)
  document.removeEventListener("mousedown", documentClickHandle)
}

const triggerList = computed(() => {
  if (typeof props.trigger === "string") {
    return [props.trigger]
  } else {
    return props.trigger
  }
})
const escCloseHandle = (e: KeyboardEvent) => {
  if (e.key !== "Escape") return
  hidePopper()
}

const unListen = (el: HTMLElement | SVGElement) => {
  el.removeEventListener("mousedown", clickHandle)
  el.removeEventListener("contextmenu", contextmenuHandle)
  el.removeEventListener("mouseenter", mouseenterHandle)
  el.removeEventListener("mouseleave", mouseleaveHandle)
  el.removeEventListener("focusin", focusinHandle)
  el.removeEventListener("focusout", focusoutHandle)
}
const listen = (el: HTMLElement | SVGElement) => {
  el.addEventListener("mousedown", clickHandle)
  el.addEventListener("contextmenu", contextmenuHandle)
  el.addEventListener("mouseenter", mouseenterHandle)
  el.addEventListener("mouseleave", mouseleaveHandle)
  el.addEventListener("focusin", focusinHandle)
  el.addEventListener("focusout", focusoutHandle)
}
onMounted(() => {
  watch(
    referenceElement,
    (newVal, oldVal) => {
      if (oldVal instanceof HTMLElement || oldVal instanceof SVGElement) {
        unListen(oldVal)
      }
      if (newVal instanceof HTMLElement || newVal instanceof SVGElement) {
        listen(newVal)
      }
    },
    { immediate: true }
  )
  watch(
    popperRef,
    (newVal, oldVal) => {
      if (oldVal instanceof HTMLElement) unListen(oldVal)
      if (newVal instanceof HTMLElement) listen(newVal)
    },
    { immediate: true }
  )
})

// click trigger
let isClicked = false
const clickHandle = (eve: Event) => {
  const event = eve as MouseEvent
  if (disabled.value) return
  if (event.button !== 0) return
  if (triggerList.value.includes("click")) {
    showPopper()
    isClicked = true
  }
}
const contextmenuHandle = (eve: Event) => {
  const event = eve as MouseEvent
  if (disabled.value) return
  if (event.ctrlKey || event.altKey) return
  if (triggerList.value.includes("contextmenu")) {
    showPopper()
    isClicked = true
    event.preventDefault()
  }
}
const documentClickHandle = (e: MouseEvent) => {
  const path = e.composedPath()
  for (let i = 0; i < path.length; i += 1) {
    const item = path[i]
    if (item === referenceElement.value) return
    if (item === popperRef.value) return
  }

  emits("click-outside")
  isClicked = false
  if (props.clickOutsideClose) {
    if (triggerList.value.includes("hover") && isHovering) return
    // if (triggerList.value.includes("click") && isClicked) return
    if (triggerList.value.includes("focus") && isFocusing) return
    hidePopper()
  }
}

// hover trigger
let hoverTimer: number
let isHovering = false
const mouseenterHandle = () => {
  if (disabled.value) return
  if (!triggerList.value.includes("hover")) return
  isHovering = true
  clearTimeout(hoverTimer)
  hoverTimer = window.setTimeout(showPopper, props.openDelay)
}
const mouseleaveHandle = () => {
  if (disabled.value) return
  if (!triggerList.value.includes("hover")) return
  isHovering = false
  clearTimeout(hoverTimer)

  hoverTimer = window.setTimeout(() => {
    // if (triggerList.value.includes("hover") && isHovering) return
    if (triggerList.value.includes("click") && isClicked) return
    if (triggerList.value.includes("focus") && isFocusing) return
    hidePopper()
  }, props.closeDelay)
}

// focus trigger
let focusTimer: number
let isFocusing = false
const focusinHandle = () => {
  if (disabled.value) return
  if (!triggerList.value.includes("focus")) return
  isFocusing = true
  clearTimeout(focusTimer)
  focusTimer = window.setTimeout(showPopper, props.openDelay)
}
const focusoutHandle = () => {
  if (disabled.value) return
  if (!triggerList.value.includes("focus")) return
  isFocusing = false
  clearTimeout(focusTimer)
  focusTimer = window.setTimeout(() => {
    if (triggerList.value.includes("hover") && isHovering) return
    if (triggerList.value.includes("click") && isClicked) return
    // if (triggerList.value.includes("focus") && isFocusing) return
    hidePopper()
  }, props.closeDelay)
}

defineExpose({
  referenceRef: referenceElement,
  popperRef,
  update: updatePosition,
  show: showPopper,
  hide: hidePopper
})

if (props.interceptProps) {
  provide(INHERITED_SIZE, "md")
  provide(INHERITED_DISABLED, false)
}
if (props.interceptForm) {
  provide(FORM_ITEM_INJECTION, {
    setItem: () => undefined,
    removeItem: () => undefined,
    emits: () => undefined
  })
}
provide(FIELDSET_INJECTION, {
  contentClass: ref(""),
  container: ref()
})
</script>
