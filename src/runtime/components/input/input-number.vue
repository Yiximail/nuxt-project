<template>
  <div
    ref="containerRef"
    :class="containerClass"
    v-bind="fieldsetAttrs"
    @click="clickHandle"
  >
    <input
      ref="inputRef"
      :class="inputClass"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="inputValue"
      type="text"
      :maxlength="maxlength"
      autocomplete="off"
      v-bind="$attrs"
      @input="inputHandle"
      @focus="focusHandle"
      @blur="blurHandle"
      @keydown.capture="keydownHandle"
    >
    <v-icon-button
      v-show="isShowClearButton"
      :class="ui.clearButton"
      icon="mdi:close"
      @click="clearHandle"
    />
  </div>
</template>

<script setup lang="ts">
import VIconButton from "../icon/icon-button.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, toRef, computed, watch, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: number
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["inputNumber"]>
    /** 禁用 */
    disabled?: boolean
    /** 占位符 */
    placeholder?: string
    /** 数字的精度 */
    precision?: number
    /** 最大值 */
    max?: number
    /** 最小值 */
    min?: number
    /** 大小 */
    size?: Size
    /** 格式化 */
    formatter?: {
      /** 从input中获取时转换 */
      get:(val: string | undefined) => string
      /** 设置到input中时转换 */
      set: (val: string | undefined) => string
    }
    /** 是否可以清除 */
    clearable?: boolean
    /** 输入时更新 */
    updateAtInput?: boolean
    /** 自动获得焦点 */
    autoFocus?: boolean
    /** 获得焦点时是否忽略外部变化 */
    focusIgnoreChange?: boolean
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    disabled: undefined,
    placeholder: undefined,
    precision: 2,
    max: Number.MAX_SAFE_INTEGER,
    min: Number.MIN_SAFE_INTEGER,
    size: undefined,
    formatter: () => ({
      get: (val) => val ?? "",
      set: (val) => val ?? ""
    }),
    clearable: true,
    updateAtInput: true,
    autoFocus: false,
    focusIgnoreChange: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: number | undefined]
  input: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const { ui } = useUi("inputNumber", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: toRef(props, "modelValue"),
  disabled
})

const containerClass = computed(() => {
  return classMerge(
    fieldsetContentClass?.value,
    ui.value.container,
    ui.value.size[size.value],
    props.class
  )
})
const inputClass = computed(() => {
  return classMerge(ui.value.input, isinvalid.value && ui.value.input)
})

const maxlength = computed(() => {
  let count = 0
  if (props.precision > 0) count += props.precision + 1
  const maxStr = props.max.toString()
  const int = maxStr.split(".")[0]
  count += int.length
  return count
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!props.modelValue) return false
  return true
})

const activeInput = () => {
  if (disabled.value) return
  inputRef.value?.focus()
}
const clickHandle = (event: MouseEvent) => {
  if (disabled.value) return
  if (!inputRef.value || !containerRef.value) return
  const path = event.composedPath()
  for (const el of path) {
    if (el === inputRef.value) return
    if (el instanceof HTMLButtonElement) return
    if (el === containerRef.value) {
      activeInput()
      return
    }
  }
}

const inputValue = ref("")
// const getInputValue = () => {
//   return props.formatter.get(inputValue.value)
// }
const setInputValue = (val: string | undefined) => {
  inputValue.value = props.formatter.set(val)
}
const updateModelValue = (val: number | undefined) => {
  emits("update:model-value", val)
}

const numberValue = ref<number>()
onMounted(() => {
  setInputValue(props.modelValue?.toString())
  watch(
    () => props.modelValue,
    (val) => {
      if (props.focusIgnoreChange && isFocusing) return
      if (val === numberValue.value) return
      numberValue.value = val
      setInputValue(val?.toString())
      numberBlur()
    },
    { immediate: true }
  )
  // 这里等watch执行完
  nextTick(() => {
    if (props.autoFocus) activeInput()
  })
})
const getNumberValue = (val: string) => {
  let text = ""
  if (props.precision === 0) {
    text = val.replace(/[^\d-]|(?<!^)-/g, "")
  } else {
    text = val.replace(/[^\d.-]|(?<!^)-|(?<=\..*)\./g, "")
    const list = text.split(".")
    if (list.length >= 2) {
      if (props.precision === undefined) {
        text = `${list[0]}.${list[1]}`
      } else {
        text = `${list[0]}.${list[1].slice(0, props.precision)}`
      }
    } else {
      text = list[0]
    }
  }
  if (!text) return { number: undefined, text }
  if (props.precision === 0) {
    const number = parseInt(text)
    return { number: isNaN(number) ? undefined : number, text }
  } else {
    const number = parseFloat(text)
    return { number: isNaN(number) ? undefined : number, text }
  }
}

const isinvalid = computed(() => {
  if (!inputRef.value) return false
  if (numberValue.value === undefined) {
    return false
  } else if (isNaN(numberValue.value)) {
    return true
  } else if (numberValue.value > props.max) {
    return true
  } else if (numberValue.value < props.min) {
    return true
  } else if (props.precision !== undefined) {
    const num = Math.pow(10, props.precision)
    const value = numberValue.value * num
    const limitedValue = Math.floor(value) / num
    return limitedValue !== numberValue.value
  }
  return false
})
const numberBlur = () => {
  if (!inputRef.value) return
  if (numberValue.value === undefined) {
    numberValue.value = undefined
  } else if (isNaN(numberValue.value)) {
    numberValue.value = undefined
  } else if (numberValue.value > props.max) {
    numberValue.value = props.max
  } else if (numberValue.value < props.min) {
    numberValue.value = props.min
  } else if (props.precision !== undefined) {
    const num = Math.pow(10, props.precision)
    const value = numberValue.value * num
    numberValue.value = Math.floor(value) / num
  }
  updateModelValue(numberValue.value)
  if (numberValue.value === undefined) {
    setInputValue(undefined)
  } else {
    setInputValue(numberValue.value.toString())
  }
}

const keydownHandle = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    numberBlur()
    await nextTick()
  }
  emits("keydown", event)
}

const inputHandle = (event: Event) => {
  if (!inputRef.value) return
  const newValue = props.formatter.get(inputRef.value.value)
  inputValue.value = newValue
  const { number, text } = getNumberValue(newValue)
  numberValue.value = number
  setInputValue(text)
  if (props.updateAtInput) updateModelValue(number)
  emits("input", event)
  formEmits?.("input")
}

let isFocusing = false
const focusHandle = (event: FocusEvent) => {
  isFocusing = true
  emits("focus", event)
  formEmits?.("focus")
}
const blurHandle = (event: FocusEvent) => {
  isFocusing = false
  numberBlur()
  emits("blur", event)
  formEmits?.("blur")
}

const clearHandle = () => {
  setInputValue("")
  numberValue.value = undefined
  updateModelValue(undefined)
  inputRef.value?.focus()
}

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (!value) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请输入${options.label}`
      return "请输入"
    }
  }
}
const { formEmits } = useFormItem(validate, activeInput)

defineExpose({ reference: containerRef })
</script>
