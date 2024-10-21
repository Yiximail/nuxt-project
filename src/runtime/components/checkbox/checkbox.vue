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
    <div ref="contentRef" :class="checkboxClass" @click="toggleHandle">
      <input
        :class="inputClass"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :indeterminate="indeterminate"
        :tabindex="tabindex"
      >
      <transition name="v-fade">
        <v-icon v-if="modelValue" :icon="ui.checkIcon" />
        <v-icon v-else-if="indeterminate" :icon="ui.indeterminateIcon" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useClickRipple from "../../composables/use-click-ripple"
import useFormItem from "../../composables/use-form-item"

import { ref, computed } from "vue"
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["checkbox"]>
    /** 大小 */
    size?: Size
    /** 半选 */
    indeterminate?: boolean
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
    indeterminate: false,
    disabled: undefined,
    tabindex: 0,
    ripple: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: boolean]
  change: []
}>()

const { ui } = useUi("checkbox", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetAttrs } = useFieldset({ value: ref(true), disabled })
const { mousedownHandle } = useClickRipple(contentRef, {
  type: "center",
  size: "1.6em",
  disabled: computed(() => disabled.value || !props.ripple)
})

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.ripple && ui.value.ripple.container,
    ui.value.size[size.value],
    props.modelValue
      ? ui.value.actived.container
      : ui.value.inactived.container,
    !disabled.value ? ui.value.enabled.container : ui.value.disabled.container,
    props.class
  )
})
const checkboxClass = computed(() => {
  return classMerge(
    ui.value.checkbox,
    props.ripple && ui.value.ripple.checkbox,
    props.modelValue ? ui.value.actived.checkbox : ui.value.inactived.checkbox,
    !disabled.value ? ui.value.enabled.checkbox : ui.value.disabled.checkbox
  )
})
const inputClass = computed(() => {
  return classMerge(
    ui.value.input,
    props.modelValue || props.indeterminate
      ? ui.value.actived.input
      : ui.value.inactived.input,
    props.modelValue ? ui.value.actived.input : ui.value.inactived.input,
    !disabled.value ? ui.value.enabled.input : ui.value.disabled.input
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
      console.warn("[v-checkbox] 必填校验失效, value值为空")
    }
  }
  return undefined
}
const { formEmits } = useFormItem(validate)

defineExpose({ reference: containerRef })
</script>
