<template>
  <div ref="containerRef" :class="containerClass" v-bind="fieldsetAttrs">
    <label
      v-if="$slots.default"
      :class="labelClass"
      @click="clickHandle"
      @mousedown="mousedownHandle"
    >
      <slot />
    </label>
    <div ref="contentRef" :class="radioClass" @click="clickHandle">
      <input
        type="radio"
        :checked="inputValue"
        :disabled="disabled"
        :value="value"
        :class="inputClass"
      >
      <div :class="radioIconClass" />
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="GenericValue extends boolean | number | string"
>
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
const contentRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: GenericValue
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["radio"]>
    /** 大小 */
    size?: Size
    /** 禁用 */
    disabled?: boolean
    /** 判断的值 */
    value?: GenericValue
    /** 涟漪效果 */
    ripple?: boolean
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    size: undefined,
    disabled: undefined,
    value: undefined,
    ripple: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: GenericValue]
  change: []
}>()

const { ui } = useUi("radio", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetAttrs } = useFieldset({ value: ref(true), disabled })
const { mousedownHandle } = useClickRipple(contentRef, {
  type: "center",
  size: "1.6em",
  disabled: computed(() => disabled.value || !props.ripple)
})

const inputValue = computed(() => props.modelValue === props.value)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.ripple && ui.value.ripple.container,
    ui.value.size[size.value],
    inputValue.value
      ? ui.value.actived.container
      : ui.value.inactived.container,
    !disabled.value ? ui.value.enabled.container : ui.value.disabled.container,
    props.class
  )
})
const radioClass = computed(() => {
  return classMerge(
    ui.value.radio,
    props.ripple && ui.value.ripple.radio,
    inputValue.value ? ui.value.actived.radio : ui.value.inactived.radio,
    !disabled.value ? ui.value.enabled.radio : ui.value.disabled.radio
  )
})
const inputClass = computed(() => {
  return classMerge(
    ui.value.input,
    inputValue.value ? ui.value.actived.input : ui.value.inactived.input,
    !disabled.value ? ui.value.enabled.input : ui.value.disabled.input
  )
})
const radioIconClass = computed(() => {
  return classMerge(
    ui.value.radioIcon,
    inputValue.value
      ? ui.value.actived.radioIcon
      : ui.value.inactived.radioIcon,
    !disabled.value ? ui.value.enabled.radioIcon : ui.value.disabled.radioIcon
  )
})
const labelClass = computed(() => {
  return classMerge(
    ui.value.label,
    inputValue.value ? ui.value.actived.label : ui.value.inactived.label,
    !disabled.value ? ui.value.enabled.label : ui.value.disabled.label
  )
})

const clickHandle = () => {
  if (disabled.value) return
  const value = props.value as GenericValue
  emits("update:model-value", value)
  emits("change")
  formEmits?.("change")
}

const validate = async (options: ValidateOptions) => {
  const value = props.value as GenericValue
  if (options.required) {
    if (value === undefined) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}`
      return "请选择"
    }
  }
  return undefined
}
const { formEmits } = useFormItem(validate)

defineExpose({ reference: containerRef })
</script>
