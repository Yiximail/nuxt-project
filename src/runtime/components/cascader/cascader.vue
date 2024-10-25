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
          <div v-else class="truncate">
            {{ selectedItem.item[labelName as string] }}
          </div>
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
      :disabled="disabled"
      icon="mdi:chevron-down"
      @click.stop="isShowPopper = !isShowPopper"
      @mousedown.stop
    />
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
      <v-cascader-popper
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

<script setup lang="ts" generic="GenericItem extends CascaderItem">
import VPopper from "../popper/popper.vue"
import VIconButton from "../icon/icon-button.vue"
import VCascaderPopper from "./cascader-popper.vue"

import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useCascaderOption from "../../composables/use-cascader-option"
import useFormItem from "../../composables/use-form-item"

import classMerge from "../../utils/class-merge"
import { CASCADER_SELECT_INJECTION } from "../../utils/injection-keys"
import { ref, computed, toRef, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ReferenceAbleComponent,
  ComponentSlot,
  CascaderItem,
  CascaderValue,
  CascaderOption,
  CascaderGenericOption,
  FormValue,
  ValidateOptions,
  PopperProps,
  Size,
  UI
} from "../../types"
import type { CascaderOptionsInjection } from "../../types/injections"
import type { Ref } from "vue"

const containerRef = ref<HTMLDivElement>()
const buttonRef = ref<HTMLButtonElement>()

const props = withDefaults(
  defineProps<{
    /** 选项keyName的值 */
    modelValue?: CascaderValue
    /** 选项对象 */
    object?: GenericItem
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["cascader"]>
    /** 大小 */
    size?: Size
    /** 选项 */
    options?: GenericItem[]
    /** 判断值的key name */
    keyName?: keyof GenericItem
    /** 显示名的key name */
    labelName?: keyof GenericItem
    /** 子选项的key name */
    childrenName?: keyof GenericItem
    /** 是否能选择非最末级 */
    checkStrictly?: boolean
    /** 最高级数 */
    maxlevel?: number
    /** 禁用 */
    disabled?: boolean
    /** 禁用的选项 */
    disabledOption?:(option: CascaderGenericOption<GenericItem>) => boolean
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
    /** 筛选时显示最多数量 */
    maxFilterCount?: number
    /** 弹窗的配置 */
    popper?: PopperProps
  }>(),
  {
    modelValue: undefined,
    object: undefined,
    reference: undefined,
    options: () => [],
    class: undefined,
    ui: undefined,
    size: undefined,
    keyName: "value",
    labelName: "label",
    childrenName: "children",
    checkStrictly: false,
    maxlevel: 0,
    disabled: undefined,
    disabledOption: () => false,
    placeholder: "请选择",
    clearable: true,
    loading: false,
    remote: false,
    clickToUnselect: true,
    closeAfterSelect: true,
    showSearch: true,
    searchMaxlength: undefined,
    searchPlaceholder: undefined,
    alwaysShowIcon: true,
    maxFilterCount: 200,
    popper: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [val?: CascaderValue]
  "update:object": [val?: GenericItem]
  change: [val?: GenericItem]
  show: []
  hide: []
  search: [keyword: string]
  "scroll-to-top": []
  "scroll-to-bottom": []
  focus: []
  blur: []
}>()

const slots = defineSlots<{
  option:(props: { option: CascaderOption }) => ComponentSlot
  prepend: (props: { option: CascaderOption }) => ComponentSlot
  label: (props: { option: CascaderOption }) => ComponentSlot
  append: (props: { option: CascaderOption }) => ComponentSlot
}>()

const { ui } = useUi("cascader", props)
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
  value: computed(() => {
    const item = selectedItem.value?.item as GenericItem | undefined
    if (!item) return undefined
    return item[props.keyName] as FormValue
  }),
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

const { flatOptionsMap } = useCascaderOption(
  false,
  props as {
    options: CascaderItem[]
    keyName: string
    labelName: string
    childrenName: string
    checkStrictly: boolean
    maxlevel: number
    maxFilterCount: number
  },
  slots as CascaderOptionsInjection["slots"]
)

const selectedItem = computed(() => {
  let objectValue = props.object?.[props.keyName] as CascaderValue
  if (!props.object && props.modelValue) {
    objectValue = props.modelValue
  }
  return flatOptionsMap.value.get(objectValue)
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!selectedItem.value) return false
  return true
})

const isSelected = (option: CascaderOption) => {
  const item = selectedItem.value?.item as GenericItem | undefined
  if (!item) return false
  const optionItem = option.item as GenericItem
  return item[props.keyName] === optionItem[props.keyName]
}
const getChildrenSelectedCount = (option: CascaderOption) => {
  const selected = selectedItem.value
  if (!selected) return 0
  const path = selected.path
  return path.some((pathItem) => {
    const item = pathItem as GenericItem
    const optionItem = option.item as GenericItem
    return item[props.keyName] === optionItem[props.keyName]
  })
    ? 1
    : 0
}

const updateModelValue = (option: CascaderOption | undefined) => {
  const item = option?.item as GenericItem | undefined
  const value = item?.[props.keyName]
  emits("update:model-value", value as CascaderValue)
  emits("update:object", option?.item as GenericItem | undefined)
}
const activeSelect = () => {
  if (disabled.value) return
  buttonRef.value?.click()
}

const selectHandle = (option: CascaderOption) => {
  updateModelValue(option)
  emits("change", option.item as GenericItem)
  formEmits?.("change")
  if (props.closeAfterSelect) hideHandle()
}
const unselectHandle = (option: CascaderOption) => {
  // 这里父级有可能使子集视为已选，所以需要判断是否真的是已选
  const selected = selectedItem.value
  if (!selected) return
  const item = selected.item as GenericItem
  const optionItem = option.item as GenericItem
  if (item[props.keyName] === optionItem[props.keyName]) {
    if (!props.clickToUnselect) return
    updateModelValue(undefined)
    emits("change", undefined)
    formEmits?.("change")
  } else {
    selectHandle(option)
  }
}
const clearHandle = () => {
  updateModelValue(undefined)
  emits("change", undefined)
  formEmits?.("change")
}

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

provide(CASCADER_SELECT_INJECTION, {
  // selected: computed(() => (selectedItem.value ? [selectedItem.value] : [])),
  getLastSelected: () => selectedItem.value,
  isSelected,
  getChildrenSelectedCount,
  disabledOption: toRef(props, "disabledOption") as Ref<
  (option: CascaderOption) => boolean
  >,
  selectHandle,
  unselectHandle
})

defineExpose({
  reference: containerRef,
  showHandle,
  hideHandle,
  selectHandle,
  unselectHandle,
  clearHandle
})
</script>
