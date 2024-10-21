<template>
  <div
    ref="containerRef"
    :class="containerClass"
    v-bind="{ ...fieldsetAttrs, ...$attrs }"
    @click="clickHandle"
  >
    <input
      ref="startInputRef"
      :class="startInputClass"
      :disabled="disabled"
      :placeholder="startPlaceholder"
      :value="startInputValue"
      type="text"
      :maxlength="24"
      autocomplete="off"
      v-bind="$attrs"
      @input="inputHandle"
      @focus="focusHandle"
      @blur="blurHandle"
    >
    <div :class="ui.separator">
      {{ separator }}
    </div>
    <input
      ref="endInputRef"
      :class="endInputClass"
      :disabled="disabled"
      :placeholder="endPlaceholder"
      :value="endInputValue"
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
      icon="mdi:close"
      @click="clearHandle"
    />
    <div v-if="showIcon" :class="iconClass">
      <v-icon v-if="type === 'time'" icon="mdi:clock-outline" />
      <v-icon v-else icon="mdi:calendar" />
    </div>
  </div>
  <v-popper
    v-model="isShowPopper"
    :reference="containerRef"
    :trigger="['click']"
    strategy="fixed"
    placement="bottom-start"
    v-bind="popper"
    :disabled="disabled"
    @show="showHandle"
    @hide="hideHandle"
  >
    <template #content>
      <div class="flex">
        <div class="w-fit">
          <div :class="ui.headerTitle">
            <span v-if="headerStartTitle">
              {{ headerStartTitle }}
            </span>
            <span v-else-if="type === 'date'"> 开始日期 </span>
            <span v-else> 开始时间 </span>
          </div>
          <div class="flex">
            <v-input-date-picker
              v-if="type !== 'time'"
              :value="startCurrentValue.date"
              :start="startCurrentValue.date"
              :end="endCurrentValue.date"
              @change="
                ($event: string) => calendarChangeHandle('start', $event)
              "
            />
            <v-divider
              v-if="type === 'datetime'"
              type="vertical"
              class="my-3"
            />
            <v-input-time-picker
              v-if="type !== 'date'"
              :value="startCurrentValue.time"
              @change="($event: string) => timeChangeHandle('start', $event)"
            />
          </div>
        </div>
        <div class="w-1 bg-natural-300 dark:bg-natural-600" />
        <div class="w-fit">
          <div :class="ui.headerTitle">
            <span v-if="headerEndTitle">
              {{ headerEndTitle }}
            </span>
            <span v-else-if="type === 'date'"> 结束日期 </span>
            <span v-else> 结束时间 </span>
          </div>
          <div class="flex">
            <v-input-date-picker
              v-if="type !== 'time'"
              :value="endCurrentValue.date"
              :start="startCurrentValue.date"
              :end="endCurrentValue.date"
              @change="($event: string) => calendarChangeHandle('end', $event)"
            />
            <v-divider
              v-if="type === 'datetime'"
              type="vertical"
              class="my-3"
            />
            <v-input-time-picker
              v-if="type !== 'date'"
              :value="endCurrentValue.time"
              @change="($event: string) => timeChangeHandle('end', $event)"
            />
          </div>
        </div>
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
            :disabled="!!startInputValue && !endInputValue"
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
import { ref, computed, watch, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  PopperProps,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const startInputRef = ref<HTMLInputElement>()
const endInputRef = ref<HTMLInputElement>()

const props = withDefaults(
  defineProps<{
    start?: string
    end?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["inputDatetimeRange"]>
    /** 禁用 */
    disabled?: boolean
    /** 开始占位符 */
    startPlaceholder?: string
    /** 结束占位符 */
    endPlaceholder?: string
    /** 分隔符 */
    separator?: string
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
    /** 是否开始时间与结束时间进行大小交换  */
    isSwap?: boolean
    /** 弹窗的配置 */
    popper?: PopperProps
    /** 弹窗开始标题 */
    headerStartTitle?: string
    /** 弹窗结束标题 */
    headerEndTitle?: string
    /** 自动获得焦点 */
    autoFocus?: boolean
    /** 获得焦点时是否忽略外部变化 */
    focusIgnoreChange?: boolean
  }>(),
  {
    start: undefined,
    end: undefined,
    class: undefined,
    ui: undefined,
    disabled: undefined,
    startPlaceholder: undefined,
    endPlaceholder: undefined,
    separator: "-",
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
    isSwap: true,
    popper: undefined,
    headerStartTitle: undefined,
    headerEndTitle: undefined,
    autoFocus: false,
    focusIgnoreChange: true
  }
)

const emits = defineEmits<{
  "update:start": [val: string | undefined]
  "update:end": [val: string | undefined]
  input: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  error: [text: string]
}>()

const { ui } = useUi("inputDatetimeRange", props)

const isShowPopper = ref(false)
const isFocusing = ref(false)

const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: computed(() => [props.start, props.end]),
  disabled,
  focus: isFocusing
})

const containerClass = computed(() => {
  return classMerge(
    fieldsetContentClass?.value,
    ui.value.container,
    ui.value.size[size.value],
    props.class
  )
})
const startInputClass = computed(() => {
  return classMerge(
    ui.value.input,
    !startCurrentValue.value?.result && ui.value.invalid
  )
})
const endInputClass = computed(() => {
  return classMerge(
    ui.value.input,
    !endCurrentValue.value?.result && ui.value.invalid
  )
})
const iconClass = computed(() => {
  return classMerge(props.alwaysShowIcon && "always-show", ui.value.icon)
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!props.start && !props.end) return false
  return true
})

const activeInput = () => {
  if (disabled.value) return
  startInputRef.value?.focus()
}
const clickHandle = (event: MouseEvent) => {
  if (disabled.value) return
  if (!startInputRef.value || !endInputRef.value || !containerRef.value) return
  const path = event.composedPath()
  for (const el of path) {
    if (el === startInputRef.value) return
    if (el === endInputRef.value) return
    if (el instanceof HTMLButtonElement) return
    if (el === containerRef.value) {
      activeInput()
      return
    }
  }
}

const startInputValue = ref("")
const endInputValue = ref("")
const getInputValue = () => {
  const s = props.formatter.get(startInputValue.value)
  const e = props.formatter.get(endInputValue.value)
  return [s, e]
}
const setInputValue = (start: string | undefined, end: string | undefined) => {
  startInputValue.value = props.formatter.set(start ?? "")
  endInputValue.value = props.formatter.set(end ?? "")
}
const updateModelValue = (
  start: string | undefined,
  end: string | undefined
) => {
  const startValue = start === "" ? undefined : start
  const endValue = end === "" ? undefined : end

  emits("update:start", startValue)
  emits("update:end", endValue)
}

onMounted(() => {
  watch(
    () => [props.start, props.end],
    (val) => {
      if (props.focusIgnoreChange && isFocusing.value) return
      const [s, e] = getInputValue()
      lastInputValue = [s, e]
      const formatedStart = props.formatter.get(val[0] ?? "")
      const formatedEnd = props.formatter.get(val[1] ?? "")
      if (s === formatedStart && e === formatedEnd) return
      setInputValue(formatedStart, formatedEnd)
      const formated = formateDatetime(formatedStart, formatedEnd)
      setInputValue(formated[0], formated[1])
      updateModelValue(formated[0], formated[1])
    },
    { immediate: true }
  )
  watch(
    () => props.type,
    () => {
      const formated = formateDatetime(props.start, props.end)
      setInputValue(formated[0], formated[1])
      updateModelValue(formated[0], formated[1])
    },
    { immediate: true }
  )
  // 这里等watch执行完
  nextTick(() => {
    if (props.autoFocus) activeInput()
  })
})

const formateDatetime = (
  start: string | undefined,
  end: string | undefined
) => {
  let startResult: string | undefined
  let endResult: string | undefined
  if (!start) {
    startResult = props.formatter.get(start)
  } else {
    if (props.type === "datetime") {
      startResult = formateDatetimeInput(start)
    } else if (props.type === "date") {
      startResult = formateDateInput(start)
    } else if (props.type === "time") {
      startResult = formateTimeInput(start)
    }
    if (startResult === undefined) {
      emits("error", start)
      startResult = lastInputValue[0]
    }
  }
  if (!end) {
    endResult = props.formatter.get(end)
  } else {
    if (props.type === "datetime") {
      endResult = formateDatetimeInput(end)
    } else if (props.type === "date") {
      endResult = formateDateInput(end)
    } else if (props.type === "time") {
      endResult = formateTimeInput(end)
    }
    if (endResult === undefined) {
      emits("error", end)
      endResult = lastInputValue[0]
    }
  }
  return [startResult, endResult]
}

const inputHandle = (event: Event) => {
  if (!startInputRef.value || !endInputRef.value) return
  const newStartValue = props.formatter.get(startInputRef.value.value)
  const newEndValue = props.formatter.get(endInputRef.value.value)
  startInputValue.value = startInputRef.value.value
  endInputValue.value = endInputRef.value.value
  setInputValue(newStartValue, newEndValue)
  if (props.updateAtInput) {
    updateModelValue(newStartValue, newEndValue)
    formEmits?.("input")
  }
  emits("input", event)
}

let blurEventTimer: number | undefined
let lastInputValue = ["", ""]
const focusHandle = (event: FocusEvent) => {
  if (blurEventTimer) {
    clearTimeout(blurEventTimer)
    blurEventTimer = undefined
    return
  }
  isFocusing.value = true
  lastInputValue = [startInputValue.value, endInputValue.value]
  emits("focus", event)
  formEmits?.("focus")
}
const blurHandle = (event: FocusEvent) => {
  clearTimeout(blurEventTimer)
  // 这里直接格式化输入，但是不更新model
  let formated = formateDatetime(startInputValue.value, endInputValue.value)
  setInputValue(formated[0], formated[1])
  blurEventTimer = window.setTimeout(() => {
    isFocusing.value = false
    blurEventTimer = undefined
    // 完全失焦后才更新model
    formated = formateDatetime(startInputValue.value, endInputValue.value)
    setInputValue(formated[0], formated[1])
    if (!props.showConfirm) {
      if (!isShowPopper.value && props.isSwap && formated[0] && formated[1]) {
        if (formated[0] > formated[1]) formated = [formated[1], formated[0]]
      }
      updateModelValue(formated[0], formated[1])
      formEmits?.("safe-blur")
    }
    emits("blur", event)
  }, 50)
}

const clearHandle = () => {
  setInputValue("", "")
  updateModelValue(undefined, undefined)
  startInputRef.value?.focus()
}

const startCurrentValue = computed(() => {
  const text = props.formatter.get(startInputValue.value)
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
const endCurrentValue = computed(() => {
  const text = props.formatter.get(endInputValue.value)
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

const calendarChangeHandle = (inputType: "start" | "end", value: string) => {
  let startDate = startCurrentValue.value.date
  let endDate = endCurrentValue.value.date
  if (inputType === "start") {
    startDate = value
  } else if (inputType === "end") {
    endDate = value
  }
  const startTime = startCurrentValue.value.time ?? "00:00:00.000"
  const endTime = endCurrentValue.value.time ?? "00:00:00.000"
  const startStr = startDate ? `${startDate} ${startTime}` : undefined
  const endStr = endDate ? `${endDate} ${endTime}` : undefined

  const formated = formateDatetime(startStr, endStr)
  setInputValue(formated[0], formated[1])
  updateModelValue(formated[0], formated[1])
  formEmits?.("safe-change")
}
const timeChangeHandle = (inputType: "start" | "end", value: string) => {
  let startTime = startCurrentValue.value.time
  let endTime = endCurrentValue.value.time
  if (inputType === "start") {
    startTime = value
  } else if (inputType === "end") {
    endTime = value
  }
  if (props.type === "datetime") {
    let startDate = startCurrentValue.value.date
    let endDate = endCurrentValue.value.date
    if (!startDate || !endDate) {
      const now = new Date()
      const nowYear = now.getFullYear().toString().padStart(4, "0")
      const nowMonth = (now.getMonth() + 1).toString().padStart(2, "0")
      const nowDate = now.getDate().toString().padStart(2, "0")
      const nowStr = `${nowYear}-${nowMonth}-${nowDate}`
      if (!startDate) startDate = nowStr
      if (!endDate) endDate = nowStr
    }
    const startStr = startTime ? `${startDate} ${startTime}` : undefined
    const endStr = endTime ? `${endDate} ${endTime}` : undefined

    const formated = formateDatetime(startStr, endStr)
    setInputValue(formated[0], formated[1])
    updateModelValue(formated[0], formated[1])
    formEmits?.("safe-change")
  } else {
    const formated = formateDatetime(startTime, endTime)
    setInputValue(formated[0], formated[1])
    updateModelValue(formated[0], formated[1])
    formEmits?.("safe-change")
  }
}

let resetValue: (string | undefined)[] = [undefined, undefined]
let confirmed = false
const showHandle = () => {
  resetValue = [props.start, props.end]
  confirmed = false
}
const hideHandle = () => {
  if (props.showConfirm) {
    if (!confirmed) {
      const formated = formateDatetime(resetValue[0], resetValue[1])
      setInputValue(formated[0], formated[1])
      updateModelValue(formated[0], formated[1])
      formEmits?.("change")
    }
  } else {
    let formated = formateDatetime(startInputValue.value, endInputValue.value)
    if (props.isSwap && formated[0] && formated[1]) {
      if (formated[0] > formated[1]) {
        formated = [formated[1], formated[0]]
        updateModelValue(formated[0], formated[1])
      }
    }
    formEmits?.("blur")
  }
}
const cancleHandle = () => {
  isShowPopper.value = false
}
const confirmHandle = () => {
  confirmed = true
  let formated = formateDatetime(startInputValue.value, endInputValue.value)
  if (props.isSwap && formated[0] && formated[1]) {
    if (formated[0] > formated[1]) formated = [formated[1], formated[0]]
  }
  setInputValue(formated[0], formated[1])
  updateModelValue(formated[0], formated[1])
  isShowPopper.value = false
}

const validate = async (options: ValidateOptions) => {
  const startValue = props.start
  const endValue = props.end
  const desc = props.type === "time" ? "时间" : "日期"
  if (options.required) {
    if (!startValue) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}开始${desc}`
      return `请选择${desc}开始${desc}`
    } else if (!endValue) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}结束${desc}`
      return `请选择${desc}结束${desc}`
    }
  }
}
const { formEmits } = useFormItem(validate, activeInput)

defineExpose({ reference: containerRef })
</script>
