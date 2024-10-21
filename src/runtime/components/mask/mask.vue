<template>
  <transition
    name="v-fade-slow"
    :appear="appear"
    @enter="enterHandle"
    @after-enter="afterEnterHandle"
    @leave="$emit('hide')"
    @after-leave="afterLeaveHandle"
  >
    <div
      v-if="(modelValue ?? isShowMask) || beforeMountedShow"
      :class="containerClass"
      @mousedown="mousedownHandle"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
import useFixedPopper from "../../composables/use-fixed-popper"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, onMounted } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 是否显示 */
    modelValue: boolean
    /** 立即执行动画 */
    appear?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["mask"]>
    /** 出现之前 */
    beforeShow?:() => void | boolean | Promise<void> | Promise<boolean>
    /** 消失之前 */
    beforeHide?: () => void | boolean | Promise<void> | Promise<boolean>
    /** 点击遮罩层关闭 */
    closeOnClick?: boolean
    /** 点击esc关闭 */
    closeOnEsc?: boolean
  }>(),
  {
    modelValue: undefined,
    appear: false,
    class: undefined,
    ui: undefined,
    beforeShow: undefined,
    beforeHide: undefined,
    closeOnClick: true,
    closeOnEsc: true
  }
)

const emits = defineEmits<{
  "update:model-value": [value: boolean]
  "click-mask": []
  "click-esc": []
  "before-show": []
  show: []
  showed: []
  "before-hide": []
  hide: []
  hid: []
}>()

const { ui } = useUi("mask", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const mousedownHandle = (event: MouseEvent) => {
  if (event.button !== 0) return
  if (event.target !== event.currentTarget) return
  emits("click-mask")
  if (props.closeOnClick) hideHandle()
}

const escCloseHandle = (e: KeyboardEvent) => {
  if (e.key !== "Escape") return
  emits("click-esc")
  if (props.closeOnEsc) hideHandle()
}

const fixedPopper = useFixedPopper()
const isShowMask = ref(props.modelValue ?? false)
const changing = ref(false)

let fixedHtml = false
let beforePaddingRight = 0
let beforePaddingBottom = 0
let leftScrollbarWidth = 0
let bottomScrollbarHeight = 0
const showHandle = async () => {
  emits("before-show")

  const showResult = await props.beforeShow?.()
  if (showResult === false) return

  const html = document.documentElement
  if (html.style.overflow !== "hidden") {
    leftScrollbarWidth = window.innerWidth - html.clientWidth
    bottomScrollbarHeight = window.innerHeight - html.clientHeight
    const styles = window.getComputedStyle(html)
    beforePaddingRight = parseFloat(styles.paddingRight)
    beforePaddingBottom = parseFloat(styles.paddingBottom)
    html.style.paddingRight = `${leftScrollbarWidth}px`
    html.style.paddingBottom = `${bottomScrollbarHeight}px`
    html.style.setProperty("--scrollbar-right-width", `${leftScrollbarWidth}px`)
    html.style.setProperty(
      "--scrollbar-bottom-height",
      `${bottomScrollbarHeight}px`
    )
    html.style.overflow = "hidden"
    fixedHtml = true
  } else {
    fixedHtml = false
  }

  isShowMask.value = true
  changing.value = true
  emits("update:model-value", true)
  fixedPopper.register()

  document.removeEventListener("keydown", escCloseHandle)
  document.addEventListener("keydown", escCloseHandle)
}
const enterHandle = () => {
  if (beforeMountedShow.value) return
  emits("show")
}
const afterEnterHandle = () => {
  if (beforeMountedShow.value) {
    beforeMountedShow.value = false
    return
  }
  changing.value = false
  checkUpdate()
  emits("showed")
}
const hideHandle = async () => {
  emits("before-hide")

  const hideResult = await props.beforeHide?.()
  if (hideResult === false) return

  isShowMask.value = false
  changing.value = true
  emits("update:model-value", false)
  fixedPopper.unregister()

  document.removeEventListener("keydown", escCloseHandle)
}
const afterLeaveHandle = () => {
  const html = document.documentElement
  if (fixedHtml) {
    html.style.paddingRight = `${beforePaddingRight}px`
    html.style.paddingBottom = `${beforePaddingBottom}px`
    html.style.removeProperty("--scrollbar-right-width")
    html.style.removeProperty("--scrollbar-bottom-height")
    html.style.overflow = ""
    fixedHtml = false
  }

  changing.value = false
  checkUpdate()
  emits("hid")
}
const checkUpdate = () => {
  if (changing.value) return
  if (props.modelValue && !isShowMask.value) {
    showHandle()
  } else if (!props.modelValue && isShowMask.value) {
    hideHandle()
  }
}

const beforeMountedShow = ref(props.appear && !isShowMask.value)
onMounted(() => {
  if (props.modelValue) showHandle()
  watch(() => props.modelValue, checkUpdate)
})
</script>
