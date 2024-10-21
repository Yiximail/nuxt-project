<template>
  <button
    v-if="!to"
    ref="buttonRef"
    :class="buttonClass"
    :type="buttonType"
    :disabled="disabled || loading"
    :tabindex="tabindex"
    v-bind="$attrs"
    @click="clickHandle"
    @mousedown="mousedownHandle"
  >
    <div :class="ui.content">
      <v-icon v-if="loading" :icon="ui.loading" />
      <v-icon v-else-if="icon" :icon="icon" />
      <slot v-else />
    </div>
  </button>
  <nuxt-link
    v-else
    ref="linkRef"
    :class="buttonClass"
    :tabindex="tabindex"
    :to="to"
    v-bind="$attrs"
    @click="clickLinkHandle"
  >
    <div :class="ui.content">
      <v-icon v-if="loading" :icon="ui.loading" />
      <v-icon v-else-if="icon" :icon="icon" />
      <slot v-else />
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useClickRipple from "../../composables/use-click-ripple"

import classMerge from "../../utils/class-merge"
import { ref, toRef, computed } from "vue"

import type {
  DeepPartial,
  Color,
  ClassNameValue,
  ComponentSlot,
  Size,
  UI,
  IconComponent
} from "../../types"
import type { NuxtLinkProps } from "nuxt/app"
import type { RouterLink } from "vue-router"

const buttonRef = ref<HTMLButtonElement>()
const linkRef = ref<InstanceType<typeof RouterLink>>()

interface ButtonProps extends NuxtLinkProps {
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["button"]>
  /** 原生类型 */
  buttonType?: "button" | "submit" | "reset"
  /** 原生tabindex */
  tabindex?: string | number
  /** 点击获得焦点 */
  clickFocus?: boolean
  /** 类型 */
  type?: keyof UI["button"]["type"]
  /** 大小 */
  size?: Size
  /** 颜色 */
  color?: Color
  /** 阴影 */
  shadow?: boolean
  /** 边框 */
  border?: boolean
  /** 圆形 */
  rounded?: boolean
  /** 图标按钮 */
  icon?: IconComponent
  /** 禁用 */
  disabled?: boolean
  /** 加载中 */
  loading?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
  class: undefined,
  ui: undefined,
  buttonType: "button",
  tabindex: 0,
  clickFocus: false,
  type: "base",
  size: undefined,
  color: "primary",
  shadow: true,
  border: false,
  rounded: false,
  icon: undefined,
  disabled: undefined,
  loading: false
})

const emits = defineEmits<{
  click: [event: MouseEvent]
  mousedown: [event: MouseEvent]
}>()

defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("button", props, { color: toRef(props, "color") })
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const elementRef = computed(() => {
  const linkEl = (linkRef.value as Record<string, unknown>)?.$el
  if (linkEl instanceof HTMLElement) return linkEl
  if (buttonRef.value) return buttonRef.value
  return undefined
})
useClickRipple(elementRef, {
  disabled: computed(() => disabled.value || props.loading)
})

const buttonClass = computed(() => {
  const isEnable = !disabled.value && !props.loading
  return classMerge(
    ui.value.base,
    ui.value.size[size.value],
    ui.value.type[props.type],
    props.shadow && ui.value.shadow,
    props.border && ui.value.border,
    props.rounded && ui.value.rounded,
    !!props.icon && ui.value.icon[size.value],
    isEnable ? ui.value.enabled[props.type] : ui.value.disabled,
    props.class
  )
})

const clickHandle = (event: MouseEvent) => {
  if (!props.clickFocus) event.preventDefault()
  emits("click", event)
}
const mousedownHandle = (event: MouseEvent) => {
  if (!props.clickFocus) event.preventDefault()
  emits("mousedown", event)
}

const clickLinkHandle = (event: MouseEvent) => {
  if (disabled.value) event.preventDefault()
}

defineExpose({ reference: elementRef })
</script>
