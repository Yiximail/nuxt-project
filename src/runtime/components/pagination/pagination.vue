<template>
  <div :class="containerClass">
    <div v-if="showTotal" :class="ui.total">
      {{ `共${total}项` }}
    </div>
    <v-button
      :class="ui.button"
      type="plain"
      :shadow="false"
      color="natural"
      :disabled="current <= 1"
      @click="preHandle"
    >
      <v-icon icon="mdi:chevron-right" class="rotate-180" />
    </v-button>
    <div ref="contentRef" :class="ui.content">
      <v-button
        v-for="index in pageTotal"
        :key="index"
        ref="buttonRef"
        :class="ui.index"
        type="text"
        :shadow="false"
        :color="index === current ? 'primary' : 'natural'"
        @click="clickIndex(index)"
      >
        {{ index }}
      </v-button>
    </div>
    <v-button
      :class="ui.button"
      type="plain"
      :shadow="false"
      color="natural"
      :disabled="current >= pageTotal"
      @click="nextHandle"
    >
      <v-icon icon="mdi:chevron-right" />
    </v-button>
    <v-dropdown v-if="showPageSize" placement="top">
      <template #default="{ isShowPopper, showPopper }">
        <v-button
          ref="pagesizeRef"
          :class="ui.pagesize"
          type="plain"
          :shadow="false"
          color="natural"
          @click="showPopper"
        >
          <span>{{ `${pageSize}项/页` }}</span>
          <v-icon
            icon="mdi:chevron-down"
            class="h-4 w-4 transition"
            :class="isShowPopper ? 'rotate-180' : ''"
          />
        </v-button>
      </template>
      <template #content>
        <v-dropdown-item
          v-for="size in pageSizeList"
          :key="size"
          @click="clickPageSize(size)"
        >
          {{ `${size}项/页` }}
        </v-dropdown-item>
      </template>
    </v-dropdown>
    <v-button
      v-if="!isShowJumper"
      :class="ui.jumper"
      type="plain"
      :shadow="false"
      color="natural"
      @click="showJumper"
    >
      跳转
    </v-button>
    <v-input-number
      v-else
      v-model="inputNumber"
      :min="1"
      :max="pageTotal"
      :step="1"
      :precision="0"
      :clearable="false"
      auto-focus
      :class="ui.jumperInput"
      @blur="hideJumper"
      @keydown.enter="hideJumper"
    />
  </div>
</template>

<script setup lang="ts">
import VButton from "../button/button.vue"
import VIcon from "../icon/icon.vue"
import VDropdown from "../dropdown/dropdown.vue"
import VDropdownItem from "../dropdown/dropdown-item.vue"
import VInputNumber from "../input/input-number.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const contentRef = ref<HTMLDivElement>()
const buttonRef = ref<InstanceType<typeof VButton>[]>()
const pagesizeRef = ref<InstanceType<typeof VButton>>()

const props = withDefaults(
  defineProps<{
    /** 当前页数 */
    pageIndex: number
    /** 每页大小 */
    pageSize: number
    /** 总数 */
    total: number
    /** 是否显示总数 */
    showTotal?: boolean
    /** 是否显示页大小 */
    showPageSize?: boolean
    /** 页大小选项 */
    pageSizeList?: number[]
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["pagination"]>
  }>(),
  {
    showTotal: true,
    showPageSize: true,
    pageSizeList: () => [10, 20, 50, 100],
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  "update:page-index": [index: number]
  "update:page-size": [size: number]
  change: []
}>()

const { ui } = useUi("pagination", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const current = computed(() => {
  if (typeof props.pageIndex !== "number") return 1
  return Math.min(Math.max(1, props.pageIndex), pageTotal.value)
})
const pageTotal = computed(() => {
  return Math.max(Math.ceil(props.total / props.pageSize), 1)
})

let scrollFrame: number | undefined
const scrollToActive = () => {
  if (!buttonRef.value) return
  scrollFrame = undefined
  const index = current.value - 1
  const activeButton = buttonRef.value[index].reference
  if (!contentRef.value || !activeButton) return
  const contentRect = contentRef.value.getBoundingClientRect()
  const buttonRect = activeButton.getBoundingClientRect()
  const offsetLeft = activeButton.offsetLeft
  const left = offsetLeft - contentRect.width / 2 + buttonRect.width / 2
  contentRef.value.scrollTo({ left, behavior: "smooth" })
}

let resizeObserver: ResizeObserver | undefined
let resizeTimer: number | undefined
const resizeCallback = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame)
    scrollFrame = requestAnimationFrame(scrollToActive)
    resizeTimer = undefined
  }, 200)
}
onMounted(() => {
  resizeObserver = new ResizeObserver(resizeCallback)
  if (contentRef.value) {
    resizeObserver.observe(contentRef.value)
  }
  watch(
    () => [current.value, props.pageSize, props.total],
    () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
      scrollFrame = requestAnimationFrame(scrollToActive)
    },
    { immediate: true }
  )
})
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

const isShowJumper = ref(false)
const inputNumber = ref(0)
const showJumper = () => {
  inputNumber.value = current.value
  isShowJumper.value = true
}
const hideJumper = () => {
  const index = Math.min(Math.max(1, inputNumber.value), pageTotal.value)
  if (index !== current.value) {
    emits("update:page-index", index)
    emits("change")
  }
  isShowJumper.value = false
}

const clickIndex = (index: number) => {
  if (index === current.value) return
  emits("update:page-index", index)
  emits("change")
}
const preHandle = () => {
  if (current.value <= 1) return
  emits("update:page-index", current.value - 1)
  emits("change")
}
const nextHandle = () => {
  if (current.value >= pageTotal.value) return
  emits("update:page-index", current.value + 1)
  emits("change")
}
const clickPageSize = (size: number) => {
  if (size === props.pageSize) return
  const currentItem = props.pageSize * (current.value - 1) + 1
  emits("update:page-size", size)
  const currentPage = Math.ceil(currentItem / size)
  emits("update:page-index", currentPage)
  emits("change")
}
</script>
