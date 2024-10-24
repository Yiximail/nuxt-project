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
          <div v-else :class="ui.tagList">
            <v-tag
              v-for="(option, index) in selectedList.slice(0, 100)"
              :key="index"
              :closeable="!disabled"
              class="max-w-full text-left"
              @close="unselectHandle(option)"
            >
              {{ option.item[labelName as string] }}
            </v-tag>
            <v-tag
              v-if="selectedList.length > 100"
              class="max-w-full text-left"
              color="natural"
            >
              +{{ selectedList.length - 100 }}
            </v-tag>
          </div>
        </transition>
      </client-only>
    </div>
    <v-icon-button
      v-show="isShowClearButton"
      :class="ui.clearButton"
      icon="mdi:close"
      @click="clearHandle"
    />
    <VIconButton
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
import VTag from "../tag/tag.vue"
import VIconButton from "../icon/icon-button.vue"
import VCascaderPopper from "./cascader-popper.vue"

import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useCascaderOption from "../../composables/use-cascader-option"
import useCascaderMultipleSelect from "../../composables/use-cascader-multiple-select"
import useFormItem from "../../composables/use-form-item"

import { ref, computed, toRef, provide } from "vue"
import classMerge from "../../utils/class-merge"
import { CASCADER_SELECT_INJECTION } from "../../utils/injection-keys"

import type { Ref } from "vue"
import type {
  DeepPartial,
  ReferenceAbleComponent,
  ClassNameValue,
  CascaderItem,
  CascaderValue,
  CascaderGenericOption,
  CascaderOption,
  ComponentSlot,
  ValidateOptions,
  PopperProps,
  Size,
  UI
} from "../../types"
import type { CascaderOptionsInjection } from "../../types/injections"

const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 选项keyName的值 */
    modelValue?: CascaderValue[]
    /** 选项对象 */
    object?: GenericItem[]
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["cascaderMultiple"]>
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
    /** 判断是否能选择非最末级 */
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
    /** 勾选策略 */
    checkStrategy?: "all" | "parent" | "child"
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
    checkStrategy: "parent",
    closeAfterSelect: false,
    showSearch: true,
    searchMaxlength: undefined,
    searchPlaceholder: undefined,
    alwaysShowIcon: true,
    popper: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [val?: CascaderValue[]]
  "update:object": [val?: GenericItem[]]
  change: [val?: GenericItem[]]
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

const { ui } = useUi("cascaderMultiple", props)
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
  value: computed(() =>
    selectedList.value.map((option) => {
      const obj = option.item as GenericItem
      return obj[props.keyName] as CascaderValue
    })
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

const { flatOptions } = useCascaderOption(
  true,
  props as {
    options: CascaderItem[]
    keyName: string
    labelName: string
    childrenName: string
    checkStrictly: boolean
    maxlevel: number
  },
  slots as CascaderOptionsInjection["slots"]
)
const flatOptionMap = computed(() => {
  const map = new Map<CascaderValue, CascaderOption>()
  flatOptions.value.forEach((option) => {
    const obj = option.item as GenericItem
    map.set(obj[props.keyName], option)
  })
  return map
})

const selectedList = computed(() => {
  let values = props.object?.map((item: unknown) => {
    const obj = item as GenericItem
    return obj[props.keyName] as CascaderValue
  })
  if (!props.object && props.modelValue) {
    values = props.modelValue
  }
  if (!values) return []
  const results = values
    .map((value) => flatOptionMap.value.get(value))
    .filter(Boolean)
  return results as CascaderOption[]
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!selectedList.value.length) return false
  return true
})

const updateModelValue = (options: CascaderOption[]) => {
  const values = options.map((option) => {
    const obj = option.item as GenericItem
    return obj[props.keyName] as CascaderValue
  })
  emits("update:model-value", values)
  emits(
    "update:object",
    options.map((option) => option.item as GenericItem)
  )
}
const activeSelect = () => {
  if (disabled.value) return
  contentRef.value?.click()
}

const {
  allSelect,
  allUnselect,
  parentSelect,
  parentUnselect,
  childSelect,
  childUnselect,
  isSelected,
  getChildrenSelectedCount
} = useCascaderMultipleSelect(
  props,
  toRef(props, "options"),
  flatOptions,
  selectedList
)

const selectHandle = (option: CascaderOption) => {
  let newList: CascaderOption[] = []
  if (props.checkStrategy === "all") {
    newList = allSelect(selectedList.value, option)
  } else if (props.checkStrategy === "parent") {
    newList = parentSelect(selectedList.value, option)
  } else if (props.checkStrategy === "child") {
    const addList = childSelect(selectedList.value, option)
    newList = [...selectedList.value, ...addList]
  }
  updateModelValue(newList)
  const items = newList.map((option) => option.item as GenericItem)
  emits("change", items)
  formEmits?.("change")
  if (props.closeAfterSelect) hideHandle()
}
const unselectHandle = (option: CascaderOption) => {
  let newList: CascaderOption[] = []
  if (props.checkStrategy === "all") {
    newList = allUnselect(selectedList.value, option)
  } else if (props.checkStrategy === "parent") {
    newList = parentUnselect(selectedList.value, option)
  } else if (props.checkStrategy === "child") {
    newList = childUnselect(selectedList.value, option)
  }
  updateModelValue(newList)
  const items = newList.map((option) => option.item as GenericItem)
  emits("change", items)
  formEmits?.("change")
}
const clearHandle = () => {
  updateModelValue([])
  emits("change", [])
  formEmits?.("change")
}

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

provide(CASCADER_SELECT_INJECTION, {
  // selected: selectedList,
  getLastSelected: () => selectedList.value[selectedList.value.length - 1],
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
