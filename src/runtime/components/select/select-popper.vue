<template>
  <div :class="containerClass">
    <template v-if="showSearch">
      <v-select-popper-search
        v-model="keyword"
        :delay="remote ? 300 : 0"
        :maxlength="maxlength"
        :placeholder="placeholder"
        @search="$emit('search', keyword)"
      />
      <v-divider />
    </template>
    <v-scrollbar-native :class="ui.options">
      <v-loading v-if="loading" text="加载中" />
      <v-empty
        v-else-if="keyword && filteredList.length === 0"
        text="没有找到匹配项"
      />
      <v-empty v-else-if="filteredList.length === 0" text="无选项" />
      <template v-else>
        <v-select-popper-item
          v-for="(option, index) in filteredList"
          :key="index"
          ref="itemRef"
          :keyword="keyword"
          :option="option"
        />
      </template>
    </v-scrollbar-native>
  </div>
</template>

<script setup lang="ts">
import VScrollbarNative from "../scrollbar/scrollbar-native.vue"
import VEmpty from "../empty/empty.vue"
import VLoading from "../loading/loading.vue"
import VDivider from "../divider/divider.vue"
import VSelectPopperSearch from "./select-popper-search.vue"
import VSelectPopperItem from "./select-popper-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  SELECT_OPTIONS_INJECTION,
  SELECT_SELECT_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, onMounted, inject } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["selectPopper"]>
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

const { ui } = useUi("selectPopper", props)

const { options, labelName, keyName } = inject(SELECT_OPTIONS_INJECTION)!
const { selected } = inject(SELECT_SELECT_INJECTION)!

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const keyword = ref("")
const filteredList = computed(() => {
  if (props.remote) return options.value ?? []
  if (!keyword.value) return options.value ?? []
  if (!labelName.value) {
    return options.value ?? []
  }
  return options.value.filter((item) => {
    const label = item[labelName.value]
    if (typeof label === "string") {
      return label?.includes(keyword.value)
    } else {
      console.warn("[v-select-popper] labelName 不是字符串")
      return false
    }
  })
})

const itemRef = ref<InstanceType<typeof VSelectPopperItem>[]>()
const scrollToLastSelected = () => {
  if (!keyName.value) return
  const lastSelected = selected.value[selected.value.length - 1]
  if (!lastSelected) return
  const index = filteredList.value.findIndex((item) => {
    return item[keyName.value] === lastSelected[keyName.value]
  })
  if (itemRef.value?.[index]) {
    itemRef.value[index].scrollTo()
  }
}
onMounted(() => {
  requestAnimationFrame(() => {
    scrollToLastSelected()
  })
})
</script>
