<template>
  <div ref="containerRef" :class="containerClass">
    <slot name="label">
      <div
        v-if="label !== undefined"
        :class="labelClass"
        @click="clickLabelHandle"
      >
        {{ label }}
      </div>
    </slot>
    <slot
      name="prepend"
      :status="status"
      :message="message"
      :validate="validate"
      :clear-validate="clearValidate"
    />
    <v-form-info v-if="$slots.info">
      <slot name="info" />
    </v-form-info>
    <slot
      name="content"
      :status="status"
      :message="message"
      :validate="validate"
      :clear-validate="clearValidate"
    >
      <v-fieldset
        v-if="fieldset"
        :type="typeof fieldset === 'string' ? fieldset : 'outline'"
        :status="status"
        :ui="fieldsetUi"
      >
        <slot
          :status="status"
          :message="message"
          :validate="validate"
          :clear-validate="clearValidate"
        />
      </v-fieldset>
      <slot
        v-else
        :status="status"
        :message="message"
        :validate="validate"
        :clear-validate="clearValidate"
      />
    </slot>
    <v-form-validate :status="status" :message="message" />
    <slot
      name="append"
      :status="status"
      :message="message"
      :validate="validate"
      :clear-validate="clearValidate"
    />
  </div>
</template>

<script setup lang="ts">
import VFieldset from "../fieldset/fieldset.vue"
import VFormInfo from "./form-info.vue"
import VFormValidate from "./form-validate.vue"
import useInheritedDisabled from "../../composables/use-inherited-disabled"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import { FORM_INJECTION, FORM_ITEM_INJECTION } from "../../utils/injection-keys"
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  inject,
  provide
} from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  FormTrigger,
  FormValidateResult,
  FormValidateStatus,
  FormValidateMessage,
  ValidateOptions,
  ComponentSlot,
  UI
} from "../../types"
import type { FormItemInjectionItem } from "../../types/injections"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["formItem"]>
    /** 标签 */
    label?: string
    /** 标签类型 */
    labelType?: "horizontal" | "vertical" | "fieldset"
    /** 是否带fieldset */
    fieldset?: boolean | "underline" | "outline"
    /** 禁用 */
    disabled?: boolean
    /** 校验触发器 */
    trigger?: FormTrigger | FormTrigger[]
    /** 必填 */
    required?: boolean
    /** 必填错误提示 */
    requiredError?: string
    /** 正则匹配 */
    regexp?: RegExp
    /** 正则匹配错误提示 */
    regexpError?: string
    /** 自定义校验 */
    rule?:() => FormValidateResult | Promise<FormValidateResult>
    /** fieldset的ui */
    fieldsetUi?: DeepPartial<UI["fieldset"]>
  }>(),
  {
    class: undefined,
    ui: undefined,
    label: undefined,
    labelType: "horizontal",
    fieldset: false,
    disabled: undefined,
    trigger: () => ["blur", "safe-blur", "change", "safe-change", "input"],
    required: false,
    requiredError: undefined,
    regexp: undefined,
    regexpError: undefined,
    rule: undefined,
    fieldsetUi: () => ({
      underline: { container: "mt-0" },
      none: { container: "mt-0" },
      outline: { container: "mt-0" }
    })
  }
)

defineSlots<{
  label:() => ComponentSlot
  info: () => ComponentSlot
  prepend: (props: {
    status: FormValidateStatus
    message: FormValidateMessage
    validate: () => Promise<boolean>
    clearValidate: () => void
  }) => ComponentSlot
  content: (props: {
    status: FormValidateStatus
    message: FormValidateMessage
    validate: () => Promise<boolean>
    clearValidate: () => void
  }) => ComponentSlot
  default: (props: {
    status: FormValidateStatus
    message: FormValidateMessage
    validate: () => Promise<boolean>
    clearValidate: () => void
  }) => ComponentSlot
  append: (props: {
    status: FormValidateStatus
    message: FormValidateMessage
    validate: () => Promise<boolean>
    clearValidate: () => void
  }) => ComponentSlot
}>()

const { ui } = useUi("formItem", props)

const { disabled } = useInheritedDisabled(props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})
const labelClass = computed(() => {
  return classMerge(ui.value.label, props.required && ui.value.required)
})

const itemList = ref<FormItemInjectionItem[]>([])
const setItem = (item: FormItemInjectionItem) => {
  const index = itemList.value.findIndex((i) => i.id === item.id)
  if (index === -1) {
    itemList.value.push(item)
  } else {
    itemList.value[index] = item
  }
}
const removeItem = (id: string) => {
  const index = itemList.value.findIndex((i) => i.id === id)
  if (index !== -1) {
    itemList.value.splice(index, 1)
  }
}
const emits = (event: FormTrigger) => {
  const list = Array.isArray(props.trigger) ? props.trigger : [props.trigger]
  if (list.includes(event) && event.startsWith("safe")) {
    validate("safe-emits")
  } else if (list.includes(event)) {
    validate("emits")
  }
}
provide(FORM_ITEM_INJECTION, { setItem, removeItem, emits })

const clickLabelHandle = () => {
  // 如果有选中文字的话则不触发
  if (window.getSelection()?.toString()) return
  for (let i = 0; i < itemList.value.length; i++) {
    const item = itemList.value[i]
    if (!item.active) continue
    item.active()
    return
  }
}

const status = ref<FormValidateStatus>()
const message = ref<FormValidateMessage>()

const anlysisResult = (
  result: FormValidateResult
): { status: FormValidateStatus; message?: FormValidateMessage } => {
  if (result === undefined || result === "") {
    return { status: undefined }
  } else if (typeof result === "string") {
    return { status: "error", message: result }
  }
  return { status: result.status, message: result.message }
}
const validate = async (type?: "emits" | "safe-emits" | "validate") => {
  if (disabled.value) {
    status.value = undefined
    message.value = undefined
    return true
  }
  await new Promise((resolve) => setTimeout(resolve))
  let newStatus: FormValidateStatus
  let newMessage: FormValidateMessage
  if (props.rule) {
    const result = await props.rule()
    const { status, message } = anlysisResult(result)
    newStatus = status
    newMessage = message
  } else {
    const options: ValidateOptions = {
      label: props.label,
      type: type === "validate" ? "validate" : "emits",
      required: props.required,
      requiredError: props.requiredError,
      regexp: props.regexp,
      regexpError: props.regexpError
    }
    const results = await Promise.all(
      itemList.value.map((item) => item.validate(options))
    )
    for (let i = 0; i < results.length; i += 1) {
      const result = results[i]
      if (!result) continue
      const { status, message } = anlysisResult(result)
      if (status === "error") {
        newStatus = status
        newMessage = message
        break
      } else if (status === "warning") {
        if (newStatus === "warning") continue
        newStatus = status
        newMessage = message
      } else if (status === "success") {
        if (newStatus === "warning") continue
        if (newStatus === "success") continue
        newStatus = status
        newMessage = message
      } else {
        if (newStatus === "warning") continue
        if (newStatus === "success") continue
        if (message !== undefined) continue
        newStatus = status
        newMessage = message
      }
    }
  }
  if (newStatus !== "error") {
    status.value = newStatus
    message.value = newMessage
  } else if (type !== "safe-emits" || status.value === "error") {
    status.value = newStatus
    message.value = newMessage
  }
  return newStatus !== "error"
}

const scrollIntoView = () => {
  if (!containerRef.value) return
  containerRef.value.scrollIntoView({ block: "center", behavior: "smooth" })
}

const clearValidate = () => {
  status.value = undefined
  message.value = undefined
}

const id = guid()
const { addFormItem, updateLabel, removeFormItem } = inject(FORM_INJECTION)!
onMounted(() => {
  addFormItem({
    id,
    label: props.label,
    validate,
    clearValidate,
    scrollIntoView
  })
  watch(
    () => props.label,
    (val) => {
      updateLabel(id, val)
    }
  )
})
onBeforeUnmount(() => {
  removeFormItem(id)
})

defineExpose({ validate, clearValidate, scrollIntoView })
</script>
