<template>
  <div
    v-if="!reference"
    ref="containerRef"
    :class="containerClass"
    v-bind="{ ...fieldsetAttrs, ...$attrs }"
  >
    <button
      ref="buttonRef"
      type="button"
      :tabindex="0"
      :class="contentClass"
      :disabled="disabled"
    >
      <client-only>
        <transition name="v-fade" mode="out-in">
          <div v-if="!selectedItem" :class="ui.placeholder">
            {{ placeholder }}
          </div>
          <slot v-else name="content" :option="selectedItem">
            <div class="truncate">
              {{ selectedItem?.[labelName as string] }}
            </div>
          </slot>
        </transition>
      </client-only>
    </button>
    <v-icon-button
      v-show="isShowClearButton"
      :class="ui.clearButton"
      icon="mdi:close"
      @click="clearHandle"
    />
    <v-icon-button
      :class="arrowClass"
      icon="mdi:chevron-down"
      :disabled="disabled"
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
const buttonRef = ref<HTMLButtonElement>()

const props = withDefaults(
  defineProps<{
    /** 选项keyName的值 */
    modelValue?: SelectValue
    /** 选项对象 */
    object?: GenericOption
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["select"]>
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
    /** 点击已选取消选择 */
    clickToUnselect?: boolean
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
    clickToUnselect: true,
    closeAfterSelect: true,
    alwaysShowIcon: true,
    showSearch: true,
    searchMaxlength: undefined,
    searchPlaceholder: undefined,
    popper: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [val?: SelectValue]
  "update:object": [val?: GenericOption]
  change: [val?: GenericOption]
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
  content: (props: { option?: GenericOption }) => ComponentSlot
  option: (props: { option: GenericOption }) => ComponentSlot
  prepend: (props: { option: GenericOption }) => ComponentSlot
  label: (props: { option: GenericOption }) => ComponentSlot
  append: (props: { option: GenericOption }) => ComponentSlot
}>()

const { ui } = useUi("select", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)

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

const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: computed(() => selectedItem.value?.[props.keyName] as SelectValue),
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

const selectedItem = computed<GenericOption | undefined>(() => {
  if (props.object) return props.object
  const option = referenceList.value.find((item) => {
    const genericItem = item as GenericOption
    return genericItem[props.keyName] === props.modelValue
  })
  if (option) return option as GenericOption
  if (props.modelValue !== undefined) {
    return {
      [props.keyName]: props.modelValue,
      [props.labelName]: props.modelValue
    } as GenericOption
  } else {
    return undefined
  }
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!selectedItem.value) return false
  if (selectedItem.value[props.keyName] === undefined) return false
  return true
})

const updateModelValue = (option: SelectOption | undefined) => {
  const genericOption = option as GenericOption | undefined
  emits("update:model-value", genericOption?.[props.keyName] as SelectValue)
  emits("update:object", option as GenericOption)
}
const activeSelect = () => {
  if (disabled.value) return
  buttonRef.value?.click()
}

const selectHandle = (option: SelectOption) => {
  updateModelValue(option)
  emits("change", option as GenericOption)
  formEmits?.("change")
  if (props.closeAfterSelect) hideHandle()
}
const unselectHandle = () => {
  if (!props.clickToUnselect) return
  updateModelValue(undefined)
  emits("change", undefined)
  formEmits?.("change")
}
const clearHandle = () => {
  updateModelValue(undefined)
  emits("change", undefined)
  formEmits?.("change")
}

provide(SELECT_SELECT_INJECTION, {
  selected: computed(() => (selectedItem.value ? [selectedItem.value] : [])),
  disabledOption: toRef(props, "disabledOption") as Ref<
  (option: SelectOption) => boolean
  >,
  selectHandle,
  unselectHandle
})

const validate = async (options: ValidateOptions) => {
  if (options.required) {
    if (!selectedItem.value) {
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
