<template>
  <div v-if="isError" :class="errorClass" :style="imageStyle">
    <v-icon :icon="ui.errorIcon" />
  </div>
  <nuxt-img
    v-else-if="src || defaultImg"
    ref="imgRef"
    :class="imageClass"
    :src="src || defaultImg"
    :draggable="draggable"
    :alt="alt"
    :preload="preload"
    :loading="loading"
    :quality="quality"
    :sizes="sizes"
    :format="format"
    :provider="checkedProvider"
    :modifiers="modifiers"
    :placeholder="placeholder"
    :densities="densities"
    :style="imageStyle"
    v-bind="$attrs"
    @click="previewHandle"
    @error="errorHandle"
  />
  <div v-else :class="emptyClass" :style="imageStyle">
    <v-icon :icon="ui.emptyIcon" />
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import { IMAGE_PREVIEW_INJECTION } from "../../utils/injection-keys"
import {
  ref,
  computed,
  watchEffect,
  onBeforeUnmount,
  inject
} from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"
import type { CSSProperties } from "vue"

const nuxtImgRef = ref()
const containerRef = ref<HTMLDivElement>()
const referenceRef = computed(() => {
  if (nuxtImgRef.value.$el) return nuxtImgRef.value.$el
  if (containerRef.value) return containerRef.value
  return undefined
})

export interface VImageProps {
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["image"]>
  src?: string
  /** 图片宽度 */
  width?: string | number
  /** 图片高度 */
  height?: string | number
  /** 图片描述 */
  alt?: string
  /** 图片适应方式 */
  fit?: "cover" | "contain" | "fill" | "scale-down" | "none"
  /** 默认图 */
  defaultImg?: string
  /** 启用拖拽 */
  draggable?: boolean
  /** 块级元素 */
  block?: boolean

  /** 预加载 */
  preload?: boolean
  /** 图片加载方式 */
  loading?: "lazy" | "eager"
  /** 图片渲染质量 */
  quality?: string | number
  /** 图片渲染格式 */
  format?: "webp" | "avif" | "jpeg" | "jpg" | "png" | "gif" | "svg"
  /** 密度 */
  densities?: string

  /** https://image.nuxt.com/usage/nuxt-img#sizes */
  sizes?: string | Record<string, string | number>
  /** https://image.nuxt.com/usage/nuxt-img#provider */
  provider?: string
  /* eslint-disable-next-line */
  modifiers?: Record<string, any>
  placeholder?: string | number | boolean | unknown[]
}

const props = withDefaults(defineProps<VImageProps>(), {
  class: undefined,
  ui: undefined,
  src: "",
  width: undefined,
  height: undefined,
  alt: "",
  preload: false,
  loading: "lazy",
  quality: undefined,
  sizes: undefined,
  fit: "cover",
  defaultImg: undefined,
  draggable: false,
  block: true,
  format: undefined,
  densities: "x1",
  provider: undefined,
  modifiers: undefined,
  placeholder: undefined
})

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

const { ui } = useUi("image", props)

const imageClass = computed(() => {
  return classMerge(
    previewInjection && ui.value.previewable,
    props.block ? ui.value.block.image : ui.value.inline.image,
    props.class
  )
})
const errorClass = computed(() => {
  return classMerge(
    ui.value.error,
    props.block ? ui.value.block.error : ui.value.inline.error,
    props.class
  )
})
const emptyClass = computed(() => {
  return classMerge(
    ui.value.empty,
    props.block ? ui.value.block.empty : ui.value.inline.empty,
    props.class
  )
})
const imageStyle = computed(() => {
  const style = {} as CSSProperties
  if (props.height) {
    if (typeof props.height === "number") {
      style.height = `${props.height}px`
    } else if (typeof props.height === "string") {
      if (/^\d+\.$/.test(props.height)) style.height = `${props.height}px`
      else style.height = props.height
    }
  }
  if (props.width) {
    if (typeof props.width === "number") {
      style.width = `${props.width}px`
    } else if (typeof props.width === "string") {
      if (/^\d+\.$/.test(props.width)) style.width = `${props.width}px`
      else style.width = props.width
    }
  }
  style.objectFit = props.fit
  return style
})

const previewInjection = inject(IMAGE_PREVIEW_INJECTION, undefined)
const id = guid()
previewInjection?.setImage({
  id,
  src: props.src,
  format: props.format
})
watchEffect(() => {
  previewInjection?.setImage({
    id,
    src: props.src,
    format: props.format
  })
})
onBeforeUnmount(() => {
  previewInjection?.removeImage(id)
})
const previewHandle = (event: MouseEvent) => {
  emits("click", event)
  previewInjection?.show(id)
}

const isError = ref(false)
const errorHandle = () => {
  isError.value = true
}

const checkedProvider = computed(() => {
  if (!props.src) return undefined
  if (props.provider) return props.provider
  return undefined
})

defineExpose({ reference: referenceRef })
</script>
