<template>
  <div
    v-if="!reference"
    ref="containerRef"
    :class="containerClass"
    v-bind="{ ...fieldsetAttrs, ...$attrs }"
  >
    <div ref="contentRef" :class="contentClass">
      <client-only>
        <transition name="v-fade" mode="out-in">
          <div v-if="!selectedList.length" :class="ui.placeholder">
            {{ placeholder }}
          </div>
          <slot v-else name="content" :options="selectedList">
            <div :class="ui.tagList">
              <v-tag
                v-for="(item, index) in selectedList"
                :key="index"
                :closeable="!disabled"
                class="max-w-full text-left"
                @close="unselectHandle(item)"
              >
                {{ item[labelName as string] }}
              </v-tag>
            </div>
          </slot>
        </transition>
      </client-only>
    </div>
    <div class="hidden">
      <slot />
    </div>
    <v-icon-button
      v-show="isShowClearButton"
      :class="ui.clearButton"
      icon="mdi:close"
      @click="clearHandle"
    />
    <v-icon-button
      :class="arrowClass"
      icon="mdi:chevron-down"
      @click.stop="isShowPopper = !isShowPopper"
      @mousedown.stop
    />
  </div>
  <div class="hidden">
    <slot />
  </div>
  <v-popper
    v-model="isShowPopper"
    :reference="reference ?? containerRef"
    :trigger="['click']"
    strategy="fixed"
    placement="bottom-start"
    v-bind="popper"
    :disabled="disabled"
    @show="showHandle"
    @hide="hideHandle"
  >
    <template #content>
      <v-select-popper
        :show-search="showSearch"
        :loading="loading"
        :remote="remote"
        :maxlength="searchMaxlength"
        :placeholder="searchPlaceholder"
        @search="$emit('search', $event)"
      />
    </template>
  </v-popper>
</template>

<script setup lang="ts" generic="GenericOption extends SelectOption">
import VPopper from "../popper/popper.vue"
import VIconButton from "../icon/icon-button.vue"
import VSelectPopper from "./select-popper.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useSelectOption from "../../composables/use-select-option"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { SELECT_SELECT_INJECTION } from "../../utils/injection-keys"
import { ref, computed, toRef, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ReferenceAbleComponent,
  ComponentSlot,
  SelectValue,
  SelectOption,
  ValidateOptions,
  PopperProps,
  Size,
  UI
} from "../../types"
import type { SelectOptionsInjection } from "../../types/injections"
import type { Ref } from "vue"

const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 选项keyName的值 */
    modelValue?: SelectValue[]
    /** 选项对象 */
    object?: GenericOption[]
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["selectMultiple"]>
    /** 大小 */
    size?: Size
    /** 选项 */
    options?: GenericOption[]
    /** 额外的选项，仅用于匹配value值 */
    extraOptions?: GenericOption[]
    /** 判断值 */
    keyName?: keyof GenericOption
    /** 显示名 */
    labelName?: keyof GenericOption
    /** 禁用 */
    disabled?: boolean
    /** 禁用的选项 */
    disabledOption?:(option: GenericOption) => boolean
    /** 占位符 */
    placeholder?: string
    /** 是否可以清除 */
    clearable?: boolean
    /** 加载中 */
    loading?: boolean
    /** 是否为远程搜索 */
    remote?: boolean
    /** 选择后关闭 */
    closeAfterSelect?: boolean
    /** 一直显示图标 */
    alwaysShowIcon?: boolean
    /** 显示搜索框 */
    showSearch?: boolean
    /** 输入框最大长度 */
    searchMaxlength?: number
    /** 输入框占位符 */
    searchPlaceholder?: string
    /** 弹窗的配置 */
    popper?: PopperProps
  }>(),
  {
    modelValue: undefined,
    object: undefined,
    reference: undefined,
    class: undefined,
    ui: undefined,
    size: undefined,
    options: () => [],
    extraOptions: () => [],
    keyName: "value",
    labelName: "label",
    disabled: undefined,
    disabledOption: () => false,
    placeholder: "请选择",
    clearable: true,
    loading: false,
    remote: false,
    closeAfterSelect: false,
    alwaysShowIcon: true,
    showSearch: true,
    searchMaxlength: undefined,
    searchPlaceholder: undefined,
    popper: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [val?: SelectValue[]]
  "update:object": [val?: GenericOption[]]
  change: [val?: GenericOption[]]
  show: []
  hide: []
  search: [keyword: string]
  "scroll-to-top": []
  "scroll-to-bottom": []
  focus: []
  blur: []
}>()

const slots = defineSlots<{
  default:() => ComponentSlot
  content: (props: { options: GenericOption[] }) => ComponentSlot
  option: (props: { option: GenericOption }) => ComponentSlot
  prepend: (props: { option: GenericOption }) => ComponentSlot
  label: (props: { option: GenericOption }) => ComponentSlot
  append: (props: { option: GenericOption }) => ComponentSlot
}>()

const { ui } = useUi("selectMultiple", props)
const { size } = useInheritedSize(props)
const isShowPopper = ref(false)
const showHandle = () => {
  isShowPopper.value = true
  emits("show")
  emits("focus")
  formEmits?.("focus")
}
const hideHandle = () => {
  isShowPopper.value = false
  emits("hide")
  emits("blur")
  formEmits?.("blur")
}

const { disabled } = useInheritedDisabled(props)
const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: computed(
    () => selectedList.value.map((item) => item[props.keyName]) as SelectValue[]
  ),
  disabled,
  focus: isShowPopper
})

const containerClass = computed(() => {
  return classMerge(
    fieldsetContentClass?.value,
    ui.value.container,
    props.class
  )
})
const contentClass = computed(() => {
  return classMerge(ui.value.content, ui.value.size[size.value])
})
const arrowClass = computed(() => {
  return classMerge(
    props.alwaysShowIcon && "always-show",
    ui.value.arrow.base,
    isShowPopper.value && ui.value.arrow.actived
  )
})

const { referenceList } = useSelectOption(
  props as {
    options: SelectOption[]
    extraOptions: SelectOption[]
    keyName: string
    labelName: string
  },
  slots as SelectOptionsInjection["slots"]
)

const selectedList = computed<GenericOption[]>(() => {
  if (props.object) return props.object
  if (props.modelValue) {
    const list = props.modelValue
    const results: GenericOption[] = []
    for (let i = 0; i < list.length; i += 1) {
      const item = referenceList.value.find((item) => {
        const option = item as GenericOption
        return option[props.keyName] === list[i]
      }) as GenericOption | undefined
      if (item) {
        results.push(item)
      } else {
        results.push({
          [props.keyName]: list[i],
          [props.labelName]: list[i]
        } as GenericOption)
      }
    }
    return results
  }
  return []
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!selectedList.value.length) return false
  return true
})

const updateModelValue = (options: SelectOption[]) => {
  const values = options.map((item) => {
    const option = item as GenericOption
    return option[props.keyName]
  }) as SelectValue[]
  emits("update:model-value", values)
  emits("update:object", options as GenericOption[])
}
const activeSelect = () => {
  if (disabled.value) return
  contentRef.value?.click()
}

const selectHandle = (option: SelectOption) => {
  const newList = [...selectedList.value, option]
  updateModelValue(newList)
  emits("change", newList as GenericOption[])
  formEmits?.("change")
  if (props.closeAfterSelect) hideHandle()
}
const unselectHandle = (option: SelectOption) => {
  const index = selectedList.value.findIndex((item) => {
    const genericOption = option as GenericOption
    return item[props.keyName] === genericOption[props.keyName]
  })
  if (index === -1) return
  const newList = [...selectedList.value]
  newList.splice(index, 1)
  updateModelValue(newList)
  emits("change", newList as GenericOption[])
  formEmits?.("change")
}
const clearHandle = () => {
  updateModelValue([])
  emits("change", [])
  formEmits?.("change")
}

provide(SELECT_SELECT_INJECTION, {
  selected: selectedList,
  disabledOption: toRef(props, "disabledOption") as Ref<
  (option: SelectOption) => boolean
  >,
  selectHandle,
  unselectHandle
})

const validate = async (options: ValidateOptions) => {
  if (options.required) {
    if (!selectedList.value?.length) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}`
      return "请选择"
    }
  }
}
const { formEmits } = useFormItem(validate, activeSelect)

defineExpose({
  reference: containerRef,
  showHandle,
  hideHandle,
  selectHandle,
  unselectHandle,
  clearHandle
})
</script>
