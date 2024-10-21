<template>
  <Icon
    v-if="iconName"
    :icon="iconName"
    :class="containerClass"
    :draggable="draggable"
    ssr
    :inline="!block"
    v-bind="$attrs"
  />
  <nuxt-img
    v-else-if="iconSrc"
    ref="imgRef"
    :class="containerClass"
    :src="iconSrc"
    :draggable="draggable"
    v-bind="$attrs"
  />
  <span
    v-else-if="iconSvg"
    ref="containerRef"
    :class="containerClass"
    :draggable="draggable"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import dompurify from "dompurify"
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  IconComponent,
  UI
} from "../../types"

const nuxtImgRef = ref()
const containerRef = ref<HTMLSpanElement>()
const referenceRef = computed(() => {
  if (nuxtImgRef.value) return nuxtImgRef.value.$el
  if (containerRef.value) return containerRef.value
  return undefined
})

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["icon"]>
    /** 图标名 */
    name?: string
    /** svg */
    svg?: string
    /** 图片地址 */
    src?: string
    /** 图标的配置 和 name\class\svg\src 一样 */
    icon?: IconComponent
    /** 启用拖拽 */
    draggable?: boolean
    /** 块级元素 */
    block?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    name: undefined,
    svg: undefined,
    src: undefined,
    draggable: false,
    icon: undefined,
    block: true
  }
)

const { ui } = useUi("icon", props)

const iconClass = computed(() => {
  if (!props.icon) return undefined // 下面继承了 className
  if (typeof props.icon === "string") return undefined
  return props.icon.class
})
const iconName = computed(() => {
  if (!props.icon) return props.name
  if (typeof props.icon === "string") return props.icon
  return props.icon.name
})
const iconSvg = computed(() => {
  if (!props.icon) return props.svg
  if (typeof props.icon === "string") return undefined
  return props.icon.svg
})
const iconSrc = computed(() => {
  if (!props.icon) return props.src
  if (typeof props.icon === "string") return undefined
  return props.icon.src
})

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.block ? ui.value.block : ui.value.inline,
    iconClass.value,
    props.class
  )
})

const updateIcon = async () => {
  await nextTick()
  if (!containerRef.value || !iconSvg.value) return
  const content = dompurify.sanitize(iconSvg.value)
  containerRef.value.innerHTML = content
}
onMounted(() => {
  watch(iconSvg, updateIcon, { immediate: true })
})

defineExpose({ reference: referenceRef })
</script>
