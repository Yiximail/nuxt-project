<template>
  <div
    ref="containerRef"
    :class="[draggingId ? '' : 'group/item', containerClass]"
    @dragover="dragoverHandle"
    @dragend="dragendHandle"
  >
    <v-image :src="fileImageUrl" :class="ui.image" fit="cover" />

    <div :class="ui.status">
      <v-icon
        v-if="item.status === 'pending'"
        icon="mdi:clock-outline"
        class="size-[90%]"
      />
      <v-icon
        v-else-if="item.status === 'loading'"
        icon="mingcute:loading-fill"
        class="animate-spin size-[90%]"
      />
      <v-icon
        v-else-if="item.status === 'success'"
        icon="mdi:check"
        class="size-[90%]"
      />
      <v-icon
        v-else-if="item.status === 'fail'"
        icon="mdi:close"
        class="size-[90%]"
      />
    </div>

    <div :class="ui.buttonList">
      <div
        :class="ui.drag"
        draggable="true"
        @dragstart="dragstartHandle"
        @dragend="$emit('dragend')"
      >
        <v-icon icon="mdi:drag" class="w-4/5 h-4/5" />
      </div>
      <v-button
        :color="buttonColor"
        :class="ui.button"
        :shadow="false"
        icon="mdi:magnify"
        @click="$emit('preview', fileImageUrl)"
      />

      <v-button
        v-if="item.status === 'pending' && !uploading"
        :color="buttonColor"
        :class="ui.button"
        :shadow="false"
        icon="mdi:cloud-upload-outline"
        @click="$emit('start')"
      />
      <v-button
        v-else-if="item.status === 'fail'"
        :color="buttonColor"
        :class="ui.button"
        :shadow="false"
        icon="mdi:refresh"
        @click="$emit('start')"
      />
      <div
        v-else-if="item.status === 'pending' || item.status === 'loading'"
        :class="ui.loading"
      >
        <v-icon icon="mingcute:loading-fill" class="animate-spin" />
      </div>
      <v-button
        v-else-if="item.status === 'success'"
        :color="buttonColor"
        :class="ui.button"
        :shadow="false"
        icon="mdi:folder-open-outline"
        @click="$emit('select-file')"
      />
      <v-button
        :color="buttonColor"
        :class="ui.button"
        :shadow="false"
        icon="mdi:trash-can-outline"
        @click="$emit('remove')"
      />
    </div>

    <transition name="v-uploader-image-item-progress">
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
  ui?: DeepPartial<UI["uploaderImageItem"]>
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

const { ui } = useUi("uploaderImageItem", props)

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
let dragoverTimer: number | undefined
const dragoverHandle = (event: DragEvent) => {
  if (!props.draggingId || !containerRef.value) return
  event.preventDefault()
  const { width, left } = containerRef.value.getBoundingClientRect()
  const threshold = Math.min(width / 4, 10)
  const offsetX = event.clientX - left
  if (offsetX <= threshold) {
    emits("dragover", props.item.id, "before")
  } else if (offsetX >= width - threshold) {
    emits("dragover", props.item.id, "after")
  } else {
    emits("dragover", props.item.id, "inner")
  }
}
const dragendHandle = () => {
  if (dragoverTimer) clearTimeout(dragoverTimer)
  dragoverTimer = undefined
}
</script>

<style scoped>
.v-uploader-image-item-progress-enter-active,
.v-uploader-image-item-progress-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-uploader-image-item-progress-enter-from,
.v-uploader-image-item-progress-leave-to {
  opacity: 0;
  transform: translateY(1px);
}
</style>
