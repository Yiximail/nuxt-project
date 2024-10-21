<template>
  <slot />
  <v-mask
    :model-value="modelValue ?? isShowPreview"
    :class="ui.mask"
    @update:model-value="updateShowPreview"
  >
    <div v-if="imageLoading" :class="ui.loading">
      <v-icon :icon="ui.loadingIcon" />
    </div>
    <div v-else-if="isError" :class="ui.error" :style="imageStyle">
      <v-icon :icon="ui.errorIcon" />
    </div>
    <div :class="ui.controller">
      <v-icon-button
        size="lg"
        icon="mdi:search-add-outline"
        @click="zoomInHandle"
      />
      <v-icon-button size="lg" icon="mdi:magnify" @click="resetHandle" />
      <v-icon-button
        size="lg"
        icon="mdi:search-minus-outline"
        @click="zoomOutHandle"
      />
      <v-icon-button
        size="lg"
        icon="mdi:rotate-left"
        @click="rotateLeftHandle"
      />
      <v-icon-button
        size="lg"
        :icon="{
          name: 'mdi:rotate-left',
          class: 'rotate-180'
        }"
        @click="rotateRightHandle"
      />
      <v-icon-button
        size="lg"
        icon="mdi:download-outline"
        @click="downloadHandle"
      />
      <v-icon-button size="lg" icon="mdi:close" @click="hideHandle" />
    </div>
    <nuxt-img
      v-show="!imageLoading && !isError"
      :class="imageClass"
      :src="imageSrc"
      :format="imageFormat"
      :style="imageStyle"
      :draggable="false"
      quality="100"
      densities="x1"
      @mousedown="mousedownHandle"
      @wheel.stop="wheelHandle"
      @load="loadHandle"
      @error="errorHandle"
    />
  </v-mask>
</template>

<script setup lang="ts">
import VMask from "../mask/mask.vue"
import VIconButton from "../icon/icon-button.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { IMAGE_PREVIEW_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ImagePreviewConfig,
  UI
} from "../../types"
import type { CSSProperties } from "vue"

const props = withDefaults(
  defineProps<{
    /** 是否显示 非undefined则视为手动 */
    modelValue?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["imagePreview"]>
    /** 图片地址 */
    src?: string
    /** 图片格式 */
    format?: "webp" | "avif" | "jpeg" | "jpg" | "png" | "gif" | "svg"
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    src: "",
    format: "webp"
  }
)

const emits = defineEmits<{
  "update:model-value": [value: boolean]
}>()

const { ui } = useUi("imagePreview", props)

const imageClass = computed(() => {
  return classMerge(ui.value.image, props.class)
})

let startX = 0
let startY = 0
const dragging = ref(false)
const rotate = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const deltaX = ref(0)
const deltaY = ref(0)
const zoom = ref(1)
const imageStyle = computed(() => {
  const style = {} as CSSProperties
  let transform = `scale(${zoom.value}) `
  const x = offsetX.value + deltaX.value
  const y = offsetY.value + deltaY.value
  transform += `translate(${x}px, ${y}px) rotate(${rotate.value}deg)`
  style.transform = transform
  style.maxWidth = "unset"
  if (!dragging.value) {
    style.transition = "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
  }
  return style
})
const mousedownHandle = (event: MouseEvent) => {
  if (event.button !== 0) return
  document.removeEventListener("mouseup", mouseupHandle)
  document.removeEventListener("mousemove", mousemoveHandle)
  document.addEventListener("mouseup", mouseupHandle)
  document.addEventListener("mousemove", mousemoveHandle)
  startX = event.clientX
  startY = event.clientY
  dragging.value = true
}
const mouseupHandle = () => {
  document.removeEventListener("mouseup", mouseupHandle)
  document.removeEventListener("mousemove", mousemoveHandle)
  requestAnimationFrame(() => {
    offsetX.value += deltaX.value
    offsetY.value += deltaY.value
    deltaX.value = 0
    deltaY.value = 0
    dragging.value = false
  })
}
let pending = false
let lastEvent: MouseEvent
const mousemoveHandle = (event: MouseEvent) => {
  lastEvent = event
  if (pending) return
  pending = true
  requestAnimationFrame(() => {
    deltaX.value = (lastEvent.clientX - startX) / zoom.value
    deltaY.value = (lastEvent.clientY - startY) / zoom.value
    pending = false
  })
}
const wheelHandle = (event: WheelEvent) => {
  event.preventDefault()
  const baseOffsetX = offsetX.value * zoom.value
  const baseOffsetY = offsetY.value * zoom.value
  const delta = event.deltaY > 0 ? -50 : 50
  const current = zoom.value * naturalValue + delta
  zoom.value = Math.max(Math.min(200, naturalValue), current) / naturalValue
  offsetX.value = baseOffsetX / zoom.value
  offsetY.value = baseOffsetY / zoom.value
}

const isShowPreview = ref(false)
const isError = ref(false)
const imageLoading = ref(false)

const injectionList = ref<ImagePreviewConfig[]>([])
const previewIndex = ref(0)
const setImage = (config: ImagePreviewConfig) => {
  injectionList.value.push(config)
}
const removeImage = (id: string) => {
  const index = injectionList.value.findIndex((item) => item.id === id)
  if (index === -1) return
  injectionList.value.splice(index, 1)
}

const imageList = computed(() => {
  const list = [...injectionList.value]
  if (props.src) list.unshift({ src: props.src, format: props.format })
  return list
})
const imageSrc = computed(() => {
  return imageList.value[previewIndex.value]?.src
})
const imageFormat = computed(() => {
  return imageList.value[previewIndex.value]?.format
})

let naturalWidth = 0
let naturalHeight = 0
let naturalValue = 0

const loadHandle = async (e: Event) => {
  const image = e.currentTarget as HTMLImageElement
  naturalWidth = image.naturalWidth
  naturalHeight = image.naturalHeight
  naturalValue = Math.max(naturalWidth, naturalHeight)
  resetHandle()
  imageLoading.value = false
}
const errorHandle = () => {
  isError.value = true
  imageLoading.value = false
}

const updateShowPreview = (value: boolean) => {
  if (value) {
    showHandle()
  } else {
    hideHandle()
  }
}
const showHandle = (id?: string) => {
  if (id) {
    const index = injectionList.value.findIndex((item) => item.id === id)
    if (index === -1) return
    previewIndex.value = index
  } else {
    previewIndex.value = 0
  }

  imageLoading.value = true
  isShowPreview.value = true
  emits("update:model-value", true)
}
const hideHandle = () => {
  isShowPreview.value = false
  emits("update:model-value", false)
}

provide(IMAGE_PREVIEW_INJECTION, {
  show: showHandle,
  hide: hideHandle,
  setImage,
  removeImage
})

const zoomInHandle = () => {
  const baseOffsetX = offsetX.value * zoom.value
  const baseOffsetY = offsetY.value * zoom.value
  const delta = 50
  const current = zoom.value * naturalValue + delta
  zoom.value = Math.max(Math.min(200, naturalValue), current) / naturalValue
  offsetX.value = baseOffsetX / zoom.value
  offsetY.value = baseOffsetY / zoom.value
}
const resetHandle = () => {
  const maxWidth = window.innerWidth - 100
  const maxHeight = window.innerHeight - 100
  let scale = 1
  while (naturalWidth * scale > maxWidth || naturalHeight * scale > maxHeight) {
    scale -= 0.05
    if (scale <= 0.05) break
  }
  offsetX.value = 0
  offsetY.value = 0
  deltaX.value = 0
  deltaY.value = 0
  zoom.value = scale
}
const zoomOutHandle = () => {
  const baseOffsetX = offsetX.value * zoom.value
  const baseOffsetY = offsetY.value * zoom.value
  const delta = -50
  const current = zoom.value * naturalValue + delta
  zoom.value = Math.max(Math.min(200, naturalValue), current) / naturalValue
  offsetX.value = baseOffsetX / zoom.value
  offsetY.value = baseOffsetY / zoom.value
}
const rotateLeftHandle = () => {
  rotate.value -= 90
}
const rotateRightHandle = () => {
  rotate.value += 90
}
const downloadHandle = () => {
  const a = document.createElement("a")
  a.href = imageSrc.value
  a.download = "image"
  a.click()
}
</script>
