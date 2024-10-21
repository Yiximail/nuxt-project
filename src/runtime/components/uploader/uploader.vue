<template>
  <div
    :class="containerClass"
    @dragover="containerDragover"
    @dragleave="containerDragleave"
    @drop="containerDrop"
  >
    <transition-group name="v-uploader">
      <v-uploader-item
        v-for="(item, index) in itemList"
        :key="item.id"
        :item="item"
        :uploading="uploading"
        :dragging-id="draggingId"
        :dragover-id="dragoverId"
        :dragover-position="dragoverPosition"
        @start="startHandle(index)"
        @remove="removeHandle(index)"
        @dragstart="dragstartHandle"
        @dragover="dragoverHandle"
        @dragend="dragendHandle"
        @select-file="selectFile(index)"
        @preview="previewHandle"
      />
      <v-button
        key="__image-insert"
        :class="ui.button"
        :disabled="isDisabled"
        @click="selectFile()"
      >
        <template v-if="itemList.length >= maxlength">
          {{ `已达上限 (${itemList.length}/${maxlength})` }}
        </template>
        <template v-else>
          {{ `上传文件 (${itemList.length}/${maxlength})` }}
        </template>
      </v-button>
    </transition-group>
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept.join(',')"
      :multiple="maxlength > 1 && selectFileIndex === undefined"
      @change="fileSelected"
    >
    <v-image-preview v-model="isShowPreview" :src="previewSrc" />
  </div>
</template>

<script setup lang="ts">
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import $message from "../../utils/message"
import { ref, computed, watch, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  FormTrigger,
  ValidateOptions,
  UploaderItem,
  UploaderStatus,
  UploadFunction,
  DragPosition,
  Size,
  UI
} from "../../types"

const inputRef = ref<HTMLInputElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: UploaderItem[]
    /** 最大上传数量 */
    maxlength?: number
    /** 可选择的格式 */
    accept?: string[]
    /** 最大大小限制 */
    maxSize?: number
    /** 上传函数 */
    upload: UploadFunction
    /** 选择完自动开始上传 */
    autoUpload?: boolean
    /** 上传前校验 返回false则不添加 */
    beforeUpload?:(file: File) => Promise<boolean> | boolean
    /** 禁用 */
    disabled?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["uploader"]>
    /** 大小 */
    size?: Size
  }>(),
  {
    modelValue: () => [],
    maxlength: 1,
    accept: () => ["*"],
    maxSize: undefined,
    autoUpload: true,
    beforeUpload: () => true,
    disabled: undefined,
    class: undefined,
    ui: undefined,
    size: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [list: UploaderItem[]]
  change: [list: UploaderItem[]]
  error: [item: UploaderItem]
  upload: [item: UploaderItem]
  uploaded: [item: UploaderItem]
}>()

const { ui } = useUi("uploader", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    isDraggingover.value && ui.value.dragover,
    ui.value.size[size.value],
    props.class
  )
})

const isDisabled = computed(() => {
  if (disabled.value) return true
  if (itemList.value.length >= props.maxlength) return true
  return false
})

const selectFileIndex = ref<number>()
const selectFile = (index?: number) => {
  if (!inputRef.value) return
  selectFileIndex.value = index
  inputRef.value.value = ""
  inputRef.value.click()
}
const fileSelected = () => {
  const files = inputRef.value?.files
  if (!files) return
  const fileList = Array.from(files)
  if (fileList.length === 0) return
  if (selectFileIndex.value !== undefined) {
    const item = itemList.value[selectFileIndex.value]
    if (!item) return
    item.status = "pending"
    item.percentage = undefined
    item.file = fileList[0]
    item.src = undefined
    item.name = fileList[0].name
    item.data = undefined
  } else {
    if (fileList.length + itemList.value.length > props.maxlength!) {
      $message.error(`最多上传${props.maxlength}个文件`)
      return
    }
    const items = fileList.map((file) => {
      return {
        id: guid(),
        status: "pending" as UploaderStatus,
        file,
        name: file.name
      }
    })
    itemList.value = [...itemList.value, ...items]
  }
  changeHandle("safe-change")
  if (props.autoUpload) uploadNext()
}

const itemList = ref<UploaderItem[]>([])
const changeHandle = (event: FormTrigger) => {
  emits("change", itemList.value)
  emits("update:model-value", itemList.value)
  formEmits?.(event)
}
onMounted(() => {
  watch(
    () => props.modelValue,
    (list) => {
      let isChanged = list.length !== itemList.value.length
      for (let i = 0; i < list.length; i += 1) {
        if (isChanged) break
        if (list[i].id !== itemList.value[i].id) {
          isChanged = true
        }
      }
      if (!isChanged) return
      itemList.value = [...list]
      changeHandle("change")
    },
    { immediate: true, deep: true }
  )
})

const uploading = ref(false)
const uploadingId = ref<string>()
const checkFile = async (file?: File) => {
  if (!file) {
    $message.error("源文件丢失，请删除后重新选择")
    return false
  }
  if (props.maxSize !== undefined) {
    if (file.size > props.maxSize) {
      $message.error("文件大小超出限制")
      return false
    }
  }
  return await props.beforeUpload(file)
}
const startHandle = (index: number) => {
  itemList.value[index].status = "pending"
  changeHandle("safe-change")
  uploadNext()
}
const uploadHandle = async (index: number) => {
  const item = itemList.value[index]
  const valid = await checkFile(item.file)
  if (!valid) {
    item.status = "fail"
    item.percentage = undefined
    emits("error", item)
    changeHandle("safe-change")
    uploadNext(true)
    return
  }
  item.status = "loading"
  uploadingId.value = item.id
  emits("upload", item)
  changeHandle("safe-change")
  const cb = (percentage: number) => {
    item.percentage = percentage
  }
  const result = await props.upload(item.file!, cb)
  // 这里被关闭中断了
  if (uploadingId.value !== item.id) return
  if (result) {
    item.status = result.status
    item.data = result.data
    // 这里让进度条走完才关闭
    setTimeout(() => {
      item.percentage = undefined
    }, 300)
  } else {
    item.status = "fail"
    item.data = undefined
    item.percentage = undefined
  }
  emits("uploaded", item)
  changeHandle("safe-change")
  uploadNext(true)
}
const uploadNext = (uploaded?: boolean) => {
  if (uploading.value && !uploaded) return
  uploading.value = true
  const index = itemList.value.findIndex((item) => item.status === "pending")
  if (index === -1) {
    uploading.value = false
  } else {
    uploadHandle(index)
  }
}

const removeHandle = (index: number) => {
  const id = itemList.value[index].id
  itemList.value.splice(index, 1)
  if (uploadingId.value === id) uploadNext(true)
  changeHandle("change")
}

const isShowPreview = ref(false)
const previewSrc = ref("")
const previewHandle = (src: string) => {
  previewSrc.value = src
  isShowPreview.value = true
}

const draggingId = ref<string>()
const dragoverId = ref<string>()
const dragoverPosition = ref<DragPosition>()
const dragstartHandle = (id: string) => {
  draggingId.value = id
}
const dragoverHandle = (id: string, position: DragPosition) => {
  if (!draggingId.value) return
  if (id !== dragoverId.value || position !== dragoverPosition.value) {
    dragoverId.value = id
    dragoverPosition.value = position
  }
}
const dragendHandle = () => {
  const draggingIndex = itemList.value.findIndex(
    (item) => item.id === draggingId.value
  )
  const dragoverIndex = itemList.value.findIndex(
    (item) => item.id === dragoverId.value
  )
  if (draggingIndex !== -1 && dragoverIndex !== -1 && dragoverPosition.value) {
    if (dragoverPosition.value === "before") {
      const item = itemList.value[draggingIndex]
      itemList.value.splice(draggingIndex, 1)
      itemList.value.splice(dragoverIndex, 0, item)
    } else if (dragoverPosition.value === "inner") {
      const item = itemList.value[draggingIndex]
      itemList.value[draggingIndex] = itemList.value[dragoverIndex]
      itemList.value[dragoverIndex] = item
    } else {
      const item = itemList.value[draggingIndex]
      itemList.value.splice(draggingIndex, 1)
      itemList.value.splice(dragoverIndex + 1, 0, item)
    }
    changeHandle("safe-change")
  }
  draggingId.value = undefined
  dragoverId.value = undefined
  dragoverPosition.value = undefined
}

const isDraggingover = ref(false)
const containerDragover = (event: DragEvent) => {
  if (draggingId.value) return
  const types = event.dataTransfer?.types
  if (!types?.includes("Files")) return
  event.preventDefault()
  isDraggingover.value = true
}
const containerDragleave = (event: DragEvent) => {
  if (draggingId.value) return
  event.preventDefault()
  isDraggingover.value = false
}
const containerDrop = (event: DragEvent) => {
  isDraggingover.value = false
  const files = event.dataTransfer?.files
  if (!files?.length) return
  event.preventDefault()
  const insertLit = [] as File[]
  for (let i = 0; i < files.length; i += 1) {
    const name = files[i].name
    const type = files[i].type
    for (let j = 0; j < props.accept.length; j += 1) {
      if (props.accept[j] === "*") continue
      if (props.accept[j].includes("/")) {
        const acceptType = props.accept[j].replace("*", "")
        if (!type.startsWith(acceptType)) {
          $message.error(`文件${type}格式不支持`)
          return
        }
      } else if (!name.endsWith(props.accept[j])) {
        $message.error(`文件${name}格式不支持`)
        return
      }
    }
    insertLit.push(files[i])
  }
  if (insertLit.length + itemList.value.length > props.maxlength!) {
    $message.error(`最多上传${props.maxlength}个文件`)
    return
  }
  const items = insertLit.map((file) => {
    return {
      id: guid(),
      status: "pending",
      file,
      name: file.name
    }
  }) as UploaderItem[]
  itemList.value = [...itemList.value, ...items]
  changeHandle("safe-change")
  if (props.autoUpload) uploadNext()
}

const validate = async (options: ValidateOptions) => {
  if (options.required) {
    if (!itemList.value.length) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请上传${options.label}`
      return "请上传"
    }
  } else if (uploading.value) {
    return "文件正在上传中"
  }
}
const { formEmits } = useFormItem(validate)
</script>

<style scoped>
.v-uploader-move,
.v-uploader-enter-active,
.v-uploader-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-uploader-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.v-uploader-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.v-uploader-leave-active {
  position: absolute;
  width: 100%;
}
</style>
