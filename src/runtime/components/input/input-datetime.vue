<template>
  <div
    ref="containerRef"
    :class="containerClass"
    v-bind="{ ...fieldsetAttrs, ...$attrs }"
    @click="clickHandle"
  >
    <input
      ref="inputRef"
      :class="inputClass"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="inputValue"
      type="text"
      :maxlength="24"
      autocomplete="off"
      v-bind="$attrs"
      @input="inputHandle"
      @focus="focusHandle"
      @blur="blurHandle"
    >
    <v-icon-button
      v-show="isShowClearButton"
      :class="ui.clearButton"
      :size="size"
      icon="mdi:close"
      @click="clearHandle"
    />
    <div :class="iconClass">
      <v-icon v-if="type === 'time'" icon="mdi:clock-outline" />
      <v-icon v-else icon="mdi:calendar" />
    </div>
  </div>
  <v-popper
    v-model="isShowPopper"
    :reference="containerRef"
    :trigger="['click']"
    strategy="fixed"
    :placement="['bottom-start', 'top-start']"
    v-bind="popper"
    :disabled="disabled"
    @show="showHandle"
    @hide="hideHandle"
  >
    <template #content>
      <div class="flex">
        <v-input-date-picker
          v-if="type !== 'time'"
          :value="currentValue.date"
          @change="datePickerChangeHandle"
        />
        <v-divider v-if="type === 'datetime'" type="vertical" class="my-3" />
        <v-input-time-picker
          v-if="type !== 'date'"
          :value="currentValue.time"
          @change="timePickerChangeHandle"
        />
      </div>
      <template v-if="showConfirm">
        <v-divider class="mx-2" />
        <div :class="ui.footer">
          <v-button
            type="text"
            :class="ui.footerButton"
            :shadow="false"
            @click="cancleHandle"
          >
            取消
          </v-button>
          <v-button
            type="text"
            :class="ui.footerButton"
            :shadow="false"
            @click="confirmHandle"
          >
            确定
          </v-button>
        </div>
      </template>
    </template>
  </v-popper>
</template>

<script setup lang="ts">
import VPopper from "../popper/popper.vue"
import VIcon from "../icon/icon.vue"
import VButton from "../button/button.vue"
import VIconButton from "../icon/icon-button.vue"
import VDivider from "../divider/divider.vue"
import VInputDatePicker from "./input-date-picker.vue"
import VInputTimePicker from "./input-time-picker.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  formateDateInput,
  formateTimeInput,
  formateDatetimeInput
} from "../../utils/formater"
import { ref, toRef, computed, watch, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  PopperProps,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["inputDatetime"]>
    /** 禁用 */
    disabled?: boolean
    /** 占位符 */
    placeholder?: string
    /** 类型 */
    type?: "datetime" | "date" | "time"
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
    /** 显示图标 */
    showIcon?: boolean
    /** 一直显示图标 */
    alwaysShowIcon?: boolean
    /** 显示确认按钮 */
    showConfirm?: boolean
    /** 弹窗的配置 */
    popper?: PopperProps
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
    type: "datetime",
    size: undefined,
    formatter: () => ({
      get: (val) =>
        val !== undefined &&
        /^(\d{4}-\d{2}-\d{2} )?\d{2}:\d{2}:\d{2}$/.test(val)
          ? `${val}.000`
          : (val ?? ""),
      set: (val) =>
        val !== undefined &&
        /^(\d{4}-\d{2}-\d{2} )?\d{2}:\d{2}:\d{2}\.\d*$/.test(val)
          ? val.replace(/\.\d*$/, "")
          : (val ?? "")
    }),
    clearable: true,
    updateAtInput: false,
    showIcon: true,
    alwaysShowIcon: true,
    showConfirm: false,
    popper: undefined,
    autoFocus: false,
    focusIgnoreChange: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: string | undefined]
  input: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  error: [text: string]
}>()

const isShowPopper = ref(false)
const { ui } = useUi("inputDatetime", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: toRef(props, "modelValue"),
  disabled,
  focus: isShowPopper
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
  return classMerge(
    ui.value.input,
    !currentValue.value?.result && ui.value.invalid
  )
})
const iconClass = computed(() => {
  return classMerge(props.alwaysShowIcon && "always-show", ui.value.icon)
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
const getInputValue = () => {
  return props.formatter.get(inputValue.value)
}
const setInputValue = (val: string | undefined) => {
  inputValue.value = props.formatter.set(val)
}
const updateModelValue = (val: string | undefined) => {
  const value = props.formatter.set(val)
  emits("update:model-value", value)
}

onMounted(() => {
  watch(
    () => props.modelValue,
    (val) => {
      if (props.focusIgnoreChange && isFocusing) return
      const value = getInputValue()
      lastInputValue = value
      const formatedVal = props.formatter.get(val)
      if (value === formatedVal) return
      const formated = formateDatetime(val)
      setInputValue(formated)
      updateModelValue(formated)
    },
    { immediate: true }
  )
  watch(
    () => props.type,
    () => {
      const formated = formateDatetime(props.modelValue)
      setInputValue(formated)
      updateModelValue(formated)
    },
    { immediate: true }
  )
  // 这里等watch执行完
  nextTick(() => {
    if (props.autoFocus) activeInput()
  })
})

const formateDatetime = (text: string | undefined) => {
  if (!text) return props.formatter.get("")
  let datetimeStr: string | undefined
  if (props.type === "datetime") {
    datetimeStr = formateDatetimeInput(text)
  } else if (props.type === "date") {
    datetimeStr = formateDateInput(text)
  } else if (props.type === "time") {
    datetimeStr = formateTimeInput(text)
  }
  if (datetimeStr === undefined) {
    emits("error", text)
    datetimeStr = lastInputValue
  }
  return datetimeStr
}

const inputHandle = (event: Event) => {
  if (!inputRef.value) return
  const newValue = props.formatter.get(inputRef.value.value)
  inputValue.value = inputRef.value.value
  setInputValue(newValue)
  if (props.updateAtInput) {
    updateModelValue(newValue)
    formEmits?.("input")
  }
  emits("input", event)
}

let isFocusing = false
let lastInputValue = ""
const focusHandle = (event: FocusEvent) => {
  isFocusing = true
  lastInputValue = inputValue.value
  emits("focus", event)
  formEmits?.("focus")
}
const blurHandle = (event: FocusEvent) => {
  isFocusing = false
  const formated = formateDatetime(inputValue.value)
  setInputValue(formated)
  if (!props.showConfirm) {
    updateModelValue(formated)
    formEmits?.("safe-blur")
  }
  emits("blur", event)
}

const clearHandle = () => {
  setInputValue("")
  updateModelValue(undefined)
  inputRef.value?.focus()
}

const currentValue = computed(() => {
  const text = props.formatter.get(inputValue.value)
  if (!text) return { result: true }
  if (props.type === "datetime") {
    const datetimeStr = formateDatetimeInput(text, true)
    if (!datetimeStr) return { result: false }
    const list = datetimeStr.split(" ")
    return { result: true, date: list?.[0], time: list?.[1] }
  } else if (props.type === "date") {
    const dateStr = formateDateInput(text, true)
    if (!dateStr) return { result: false }
    return { result: true, date: dateStr }
  } else if (props.type === "time") {
    const timeStr = formateTimeInput(text, true)
    return { result: true, time: timeStr }
  }
  return { result: false }
})
const datePickerChangeHandle = (value: string) => {
  let val = value
  if (props.type === "datetime") {
    const time = currentValue.value.time ?? "00:00:00.000"
    val = `${value} ${time}`
  }
  const formated = formateDatetime(val)
  setInputValue(formated)
  updateModelValue(formated)
  formEmits?.("safe-change")
}
const timePickerChangeHandle = (value: string) => {
  let val = value
  if (props.type === "datetime") {
    let date = currentValue.value.date
    if (!date) {
      const now = new Date()
      const yearStr = now.getFullYear().toString()
      const monthStr = (now.getMonth() + 1).toString().padStart(2, "0")
      const dateStr = now.getDate().toString().padStart(2, "0")
      date = `${yearStr}-${monthStr}-${dateStr}`
    }
    val = `${date} ${value}`
  }
  const formated = formateDatetime(val)
  setInputValue(formated)
  updateModelValue(formated)
  formEmits?.("safe-change")
}

let resetValue: string | undefined
let confirmed = false
const showHandle = () => {
  resetValue = props.modelValue
  confirmed = false
}
const hideHandle = () => {
  if (props.showConfirm) {
    if (!confirmed) {
      const formated = formateDatetime(resetValue)
      setInputValue(formated)
      updateModelValue(formated)
      formEmits?.("change")
    }
  } else {
    formEmits?.("blur")
  }
}
const cancleHandle = () => {
  isShowPopper.value = false
}
const confirmHandle = () => {
  confirmed = true
  const formated = formateDatetime(inputValue.value)
  setInputValue(formated)
  updateModelValue(formated)
  isShowPopper.value = false
}

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (!value) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}`
      return "请选择"
    }
  }
}
const { formEmits } = useFormItem(validate, activeInput)

defineExpose({ reference: containerRef })
</script>
