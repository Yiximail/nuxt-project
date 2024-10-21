<template>
  <div
    ref="containerRef"
    :class="containerClass"
    @dragover="dragoverHandle"
    @dragend="dragendHandle"
  >
    <div
      :class="ui.drag"
      draggable="true"
      @dragstart="dragstartHandle"
      @dragend="$emit('dragend')"
    >
      <v-icon icon="mdi:drag" class="w-full h-full" />
    </div>

    <div :class="ui.preview">
      <v-image
        v-if="fileImageUrl"
        :src="fileImageUrl"
        :class="ui.image"
        fit="cover"
        @click="$emit('preview', fileImageUrl)"
      />
      <v-icon v-else icon="mdi:file-outline" :class="ui.icon" />
    </div>

    <div :class="ui.name">
      {{ fileName }}
    </div>

    <div v-if="labelText" :class="ui.label">
      {{ labelText }}
    </div>

    <v-button
      v-if="item.status === 'pending' && !uploading"
      type="text"
      :color="buttonColor"
      :class="ui.button"
      :shadow="false"
      icon="mdi:cloud-upload-outline"
      @click="$emit('start')"
    />
    <v-button
      v-else-if="item.status === 'fail'"
      type="text"
      :color="buttonColor"
      :class="ui.button"
      :shadow="false"
      icon="mdi:refresh"
      @click="$emit('start')"
    />
    <div v-else-if="item.status === 'pending'" :class="ui.loading">
      <v-icon icon="mdi:clock-outline" class="w-full h-full" />
    </div>
    <div v-else-if="item.status === 'loading'" :class="ui.loading">
      <v-icon icon="mingcute:loading-fill" class="animate-spin w-full h-full" />
    </div>
    <v-button
      v-else-if="item.status === 'success'"
      type="text"
      :color="buttonColor"
      :class="ui.button"
      :shadow="false"
      icon="mdi:folder-open-outline"
      @click="$emit('select-file')"
    />

    <v-button
      type="text"
      :color="buttonColor"
      :class="ui.button"
      :shadow="false"
      icon="mdi:trash-can-outline"
      @click="$emit('remove')"
    />

    <transition name="v-fade">
      <v-progress
        v-if="item.percentage !== undefined"
        :class="ui.progress"
        :bar-class="ui.progressBar"
        :to="item.percentage"
        :duration="3000"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import VImage from "../image/image.vue"
import VButton from "../button/button.vue"
import VProgress from "../progress/progress.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  UploaderItem,
  DragPosition,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = defineProps<{
  /** item对象 */
  item: UploaderItem
  /** 上传中 */
  uploading: boolean
  /** 拖动中的元素ID */
  draggingId?: string
  /** 拖动至的ID */
  dragoverId?: string
  /** 拖动中的位置 */
  dragoverPosition?: DragPosition
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["uploaderItem"]>
}>()

const emits = defineEmits<{
  start: []
  remove: []
  "select-file": []
  preview: [src: string]
  dragstart: [id: string]
  dragover: [id: string, position: DragPosition]
  dragend: []
}>()

const { ui } = useUi("uploaderItem", props)

const containerClass = computed(() => {
  const isDragOver = props.dragoverId === props.item.id
  return classMerge(
    ui.value?.container,
    props.item.status === "fail" && ui.value?.error,
    props.item.status === "success" && ui.value?.success,
    isDragOver &&
      props.dragoverPosition && [
      ui.value.dragover.container,
      ui.value.dragover[props.dragoverPosition]
    ],
    props.class
  )
})

const fileImageUrl = ref("")
const updateFileImageUrl = () => {
  let url = ""
  const file = props.item.file
  const src = props.item.src
  if (file && file.type.startsWith("image")) {
    url = URL.createObjectURL(file)
  } else if (src) {
    switch (true) {
      case src.endsWith(".apng"):
      case src.endsWith(".avif"):
      case src.endsWith(".gif"):
      case src.endsWith(".jpg"):
      case src.endsWith(".jpeg"):
      case src.endsWith(".jfif"):
      case src.endsWith(".pjpeg"):
      case src.endsWith(".pjp"):
      case src.endsWith(".png"):
      case src.endsWith(".svg"):
      case src.endsWith(".webp"):
        url = src
        break
    }
  }
  if (fileImageUrl.value === url) return
  if (fileImageUrl.value) URL.revokeObjectURL(fileImageUrl.value)
  fileImageUrl.value = url
}
onMounted(() => {
  watch(() => [props.item.file, props.item.src], updateFileImageUrl, {
    immediate: true
  })
})

const fileName = computed(() => {
  if (props.item.name) return props.item.name
  if (props.item.file) return props.item.file.name
  if (props.item.src) {
    // 解码
    const urlStr = decodeURIComponent(props.item.src)
    return urlStr.split("/")?.pop() ?? ""
  }
  return ""
})
const labelText = computed(() => {
  switch (true) {
    case props.item.status === "pending" && !props.uploading:
      return "未上传"
    case props.item.status === "pending":
      return "队列中"
    case props.item.status === "fail":
      return "上传失败"
    default:
      return undefined
  }
})

const buttonColor = computed(() => {
  switch (props.item.status) {
    case "success":
      return "primary"
    case "fail":
      return "danger"
    default:
      return "natural"
  }
})

const dragstartHandle = (event: DragEvent) => {
  if (containerRef.value) {
    event.dataTransfer?.setDragImage(containerRef.value, 20, 20)
  }
  emits("dragstart", props.item.id)
}
const dragoverHandle = (event: DragEvent) => {
  if (!props.draggingId || !containerRef.value) return
  event.preventDefault()
  const { height, top } = containerRef.value.getBoundingClientRect()
  const threshold = Math.min(height / 4, 10)
  const offsetY = event.clientY - top
  if (offsetY <= threshold) {
    emits("dragover", props.item.id, "before")
  } else if (offsetY >= height - threshold) {
    emits("dragover", props.item.id, "after")
  } else {
    emits("dragover", props.item.id, "inner")
  }
}
const dragendHandle = () => {
  emits("dragend")
}
</script>
