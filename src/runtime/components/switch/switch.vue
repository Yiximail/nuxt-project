<template>
  <div ref="containerRef" :class="containerClass" v-bind="fieldsetAttrs">
    <label
      v-if="$slots.default"
      :class="labelClass"
      @click="toggleHandle"
      @mousedown="mousedownHandle"
    >
      <slot />
    </label>
    <button
      role="switch"
      type="button"
      :class="switchClass"
      @click="toggleHandle"
    >
      <div :class="lineClass" />
      <div ref="outerRef" :class="outerClass">
        <div :class="innerClass" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useClickRipple from "../../composables/use-click-ripple"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const outerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["switch"]>
    /** 大小 */
    size?: Size
    /** 禁用 */
    disabled?: boolean
    /** 原生tabindex */
    tabindex?: string | number
    /** 涟漪效果 */
    ripple?: boolean
  }>(),
  {
    modelValue: false,
    class: undefined,
    ui: undefined,
    size: undefined,
    disabled: undefined,
    tabindex: 0,
    ripple: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: boolean]
  change: []
}>()

const { ui } = useUi("switch", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetAttrs } = useFieldset({ value: ref(true), disabled })
const { mousedownHandle } = useClickRipple(outerRef, {
  type: "center",
  size: "1.6em",
  disabled: computed(() => disabled.value || !props.ripple)
})

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value.size[size.value],
    props.ripple && ui.value.ripple.container,
    props.modelValue
      ? ui.value.actived.container
      : ui.value.inactived.container,
    !disabled.value ? ui.value.enabled.container : ui.value.disabled.container,
    props.class
  )
})
const lineClass = computed(() => {
  return classMerge(
    ui.value.line,
    props.modelValue ? ui.value.actived.line : ui.value.inactived.line,
    !disabled.value ? ui.value.enabled.line : ui.value.disabled.line
  )
})
const switchClass = computed(() => {
  return classMerge(
    ui.value.switch,
    props.ripple && ui.value.ripple.switch,
    props.modelValue ? ui.value.actived.switch : ui.value.inactived.switch,
    !disabled.value ? ui.value.enabled.switch : ui.value.disabled.switch
  )
})
const outerClass = computed(() => {
  return classMerge(
    ui.value.outer,
    props.ripple && ui.value.ripple.outer,
    props.modelValue ? ui.value.actived.outer : ui.value.inactived.outer,
    !disabled.value ? ui.value.enabled.outer : ui.value.disabled.outer
  )
})
const innerClass = computed(() => {
  return classMerge(
    ui.value.inner,
    props.modelValue ? ui.value.actived.inner : ui.value.inactived.inner,
    !disabled.value ? ui.value.enabled.inner : ui.value.disabled.inner
  )
})
const labelClass = computed(() => {
  return classMerge(
    ui.value.label,
    props.modelValue ? ui.value.actived.label : ui.value.inactived.label,
    !disabled.value ? ui.value.enabled.label : ui.value.disabled.label
  )
})

const toggleHandle = () => {
  if (disabled.value) return
  const newValue = !props.modelValue
  emits("update:model-value", newValue)
  emits("change")
  formEmits?.("change")
}

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (value === undefined) {
      emits("update:model-value", false)
      await new Promise((resolve) => setTimeout(resolve))
    }
    if (props.modelValue === undefined) {
      console.warn("[v-switch] 必填校验失效, value值为空")
    }
  }
  return undefined
}
const { formEmits } = useFormItem(validate)

defineExpose({ reference: containerRef })
</script>
