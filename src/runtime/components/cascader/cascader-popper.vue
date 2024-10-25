<template>
  <div :class="containerClass">
    <template v-if="showSearch">
      <v-cascader-popper-search
        v-model="keyword"
        :delay="remote ? 300 : 0"
        :maxlength="maxlength"
        :placeholder="placeholder"
        @search="$emit('search', keyword)"
      />
      <v-divider />
    </template>
    <v-loading v-if="loading" text="加载中" />
    <template v-else-if="keyword && !remote">
      <v-empty v-if="filteredList.length === 0" text="没有找到匹配项" />
      <v-scrollbar-native :class="ui.filteredList">
        <v-cascader-popper-item
          v-for="item in filteredList"
          :key="item[keyName]"
          :keyword="keyword"
          :item="item"
          is-filtered
        />
      </v-scrollbar-native>
    </template>
    <v-empty v-else-if="!optionsList?.[0]?.list?.length" text="无选项" />
    <div v-else :class="ui.list">
      <template v-for="(options, level) in optionsList" :key="options.key">
        <v-divider v-if="level !== 0" type="vertical" />
        <v-scrollbar-native :class="ui.optionList">
          <v-cascader-popper-item
            v-for="item in options.list"
            :key="item[keyName]"
            ref="itemRef"
            :item="item"
          />
        </v-scrollbar-native>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import VScrollbarNative from "../scrollbar/scrollbar-native.vue"
import VEmpty from "../empty/empty.vue"
import VLoading from "../loading/loading.vue"
import VDivider from "../divider/divider.vue"
import VCascaderPopperSearch from "./cascader-popper-search.vue"
import VCascaderPopperItem from "./cascader-popper-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  CASCADER_OPTIONS_INJECTION,
  CASCADER_SELECT_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, onMounted, inject } from "vue"

import type { DeepPartial, ClassNameValue, CascaderItem, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["cascaderPopper"]>
    /** 加载中 */
    loading?: boolean
    /** 是否为远程搜索 */
    remote?: boolean
    /** 输入框最大长度 */
    maxlength?: number
    /** 输入框placeholder */
    placeholder?: string
    /** 显示搜索框 */
    showSearch?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    loading: false,
    remote: false,
    maxlength: undefined,
    placeholder: "输入关键字",
    showSearch: true
  }
)

defineEmits<{
  search: [keyword: string]
}>()

const { ui } = useUi("cascaderPopper", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const {
  activedList,
  optionsList,
  flatOptions,
  labelName,
  keyName,
  childrenName,
  checkStrictly,
  maxlevel,
  maxFilterCount
} = inject(CASCADER_OPTIONS_INJECTION)!

const { getLastSelected } = inject(CASCADER_SELECT_INJECTION)!

const keyword = ref("")
const filteredList = computed(() => {
  if (props.remote || !keyword.value || !labelName.value) {
    return (
      flatOptions.value
        .slice(0, maxFilterCount.value)
        .map((item) => item.item) ?? []
    )
  }
  const result: CascaderItem[] = []
  for (let i = 0; i < flatOptions.value.length; i += 1) {
    const option = flatOptions.value[i]
    if (!checkStrictly.value) {
      const level = option.path?.length ?? 0
      let hasChildren = option.item[childrenName.value]?.length
      if (maxlevel.value && level >= maxlevel.value) hasChildren = false
      if (hasChildren) continue
    }
    const labels = option.path?.map((item) => item?.[labelName.value]) ?? []
    const label = labels.join("/")
    if (label?.includes(keyword.value)) {
      result.push(option.item)
    }
    if (result.length >= maxFilterCount.value) break
  }
  return result
})

const itemRef = ref<InstanceType<typeof VCascaderPopperItem>[]>()
let pathList: CascaderItem[] = []
const showLastSelected = () => {
  const lastSelected = getLastSelected()
  if (lastSelected) {
    pathList = lastSelected.path
    activedList.value = pathList.slice(0, pathList.length - 1)
  } else {
    activedList.value = []
  }
}
showLastSelected()
const scrollToSelected = () => {
  if (!itemRef.value) return
  let base = 0
  for (let i = 0; i < optionsList.value.length; i += 1) {
    const key = optionsList.value[i + 1]?.key
    const list = optionsList.value[i]?.list
    if (!key || !list.length) break
    const index = list.findIndex((item) => item[keyName.value] === key)
    if (index === -1) break
    const item = itemRef.value[base + index]
    if (!item) break
    item.scrollTo()
    base += list.length
  }
}
onMounted(() => {
  requestAnimationFrame(() => {
    scrollToSelected()
  })
})
</script>
