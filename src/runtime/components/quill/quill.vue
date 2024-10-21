<template>
  <div ref="containerRef" :class="containerClass" v-bind="fieldsetAttrs">
    <div ref="toolbarRef" :class="['v-quill-toolbar', toolbarClass]">
      <div class="mr-3 empty:mr-0">
        <select v-if="formats.includes('header')" class="ql-header bg-inherit">
          <option value="1">
            标题1
          </option>
          <option value="2">
            标题2
          </option>
          <option value="3">
            标题3
          </option>
          <option value="4">
            标题4
          </option>
          <option :value="false" selected>
            正文
          </option>
        </select>
        <select v-if="formats.includes('size')" class="ql-size bg-inherit">
          <option value="10px">
            10px
          </option>
          <option value="12px">
            12px
          </option>
          <option value="14px">
            14px
          </option>
          <option value="16px" selected>
            16px
          </option>
          <option value="20px">
            20px
          </option>
          <option value="24px">
            24px
          </option>
          <option value="36px">
            36px
          </option>
        </select>
      </div>
      <div class="mr-3 empty:mr-0">
        <select v-if="formats.includes('align')" class="ql-align bg-inherit" />
      </div>
      <div class="mr-3 empty:mr-0">
        <button v-if="formats.includes('bold')" class="ql-bold" />
        <button v-if="formats.includes('italic')" class="ql-italic" />
        <button v-if="formats.includes('underline')" class="ql-underline" />
        <button v-if="formats.includes('strike')" class="ql-strike" />
      </div>
      <div class="mr-3 empty:mr-0">
        <button v-if="formats.includes('blockquote')" class="ql-blockquote" />
      </div>
      <div class="mr-3 empty:mr-0">
        <button v-if="formats.includes('link')" class="ql-link" />
        <button v-if="formats.includes('image')" class="ql-image" />
        <button v-if="formats.includes('video')" class="ql-video" />
      </div>
      <div class="mr-3 empty:mr-0">
        <button
          v-if="formats.includes('list')"
          class="ql-list"
          value="ordered"
        />
        <button
          v-if="formats.includes('list')"
          class="ql-list"
          value="bullet"
        />
      </div>
      <div class="mr-3 empty:mr-0">
        <button
          v-if="formats.includes('indent')"
          class="ql-indent"
          value="-1"
        />
        <button
          v-if="formats.includes('indent')"
          class="ql-indent"
          value="+1"
        />
      </div>
      <div class="mr-3 empty:mr-0">
        <select v-if="formats.includes('color')" class="ql-color bg-inherit" />
        <select
          v-if="formats.includes('background')"
          class="ql-background bg-inherit"
        />
      </div>
      <div>
        <button class="ql-clean" />
      </div>
    </div>
    <v-divider />
    <div ref="editorRef" :class="['v-quill-editor', editorClass]" />
    <div v-if="isShowLimit && !disabled && countText" :class="countClass">
      {{ countText }}
    </div>
    <transition name="v-fade">
      <div
        v-if="processing"
        :class="ui.processMask"
        :style="{ backdropFilter: 'blur(3px)' }"
      >
        <v-icon icon="mingcute:loading-fill" class="animate-spin h-5 w-5" />
        <div>处理图片中...</div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import VDivider from "../divider/divider.vue"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useFormItem from "../../composables/use-form-item"

import VideoBlot from "./video-blot"
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import { ref, watch, computed, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  QuillFormats,
  QuillImports,
  ValidateOptions,
  UI
} from "../../types"
import type Quill from "quill"

const containerRef = ref<HTMLDivElement>()
const toolbarRef = ref<HTMLDivElement>()
const editorRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** 禁用 */
    disabled?: boolean
    /** 占位符 */
    placeholder?: string
    /** 格式 */
    formats?: QuillFormats[]
    /** 最大长度 */
    maxlength?: number
    /** 是否显示限制长度 */
    isShowLimit?: boolean
    /** 图片处理 */
    imageProcess?:(
      file: File,
      element: HTMLImageElement
    ) => Promise<string | undefined>
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["quill"]>
    /** 自动获得焦点 */
    autoFocus?: boolean
    /** 获得焦点时是否忽略外部变化 */
    focusIgnoreChange?: boolean
  }>(),
  {
    modelValue: undefined,
    disabled: false,
    placeholder: "",
    formats: () => [
      "header",
      "size",
      "align",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "link",
      "image",
      "list",
      "indent",
      "color",
      "background"
    ],
    maxlength: undefined,
    isShowLimit: true,
    imageProcess: undefined,
    class: undefined,
    ui: undefined,
    autoFocus: false,
    focusIgnoreChange: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: string]
  focus: []
  blur: []
}>()

const { ui } = useUi("quill", props)

const { disabled } = useInheritedDisabled(props)
const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: ref(true),
  disabled
})

const containerClass = computed(() => {
  return classMerge(
    fieldsetContentClass?.value,
    ui.value.container,
    props.class
  )
})
const toolbarClass = computed(() => {
  return classMerge(
    ui.value.toolbar,
    disabled.value && ui.value.toolbarDisabled
  )
})
const editorClass = computed(() => {
  return classMerge(
    ui.value.editor,
    disabled.value && ui.value.editorDisabled
  )
})
const countClass = computed(() => {
  const length = props.modelValue?.length ?? 0
  const isOverCount = !props.maxlength || length > props.maxlength
  return classMerge(ui.value.count, isOverCount && ui.value.count)
})
const countText = computed(() => {
  if (props.maxlength === undefined) return
  const length = props.modelValue?.length ?? 0
  return `${length}/${props.maxlength}`
})

let quill: Quill

onMounted(async () => {
  const module = await import("quill")
  const Quill = module.default
  const fontSize = Quill.import("attributors/style/size") as QuillImports
  fontSize.whitelist = ["10px", "12px", "14px", "16px", "20px", "24px", "36px"]
  Quill.register(fontSize, true)
  const header = Quill.import("formats/header") as QuillImports
  header.whitelist = [1, 2, 3, 4, false]
  Quill.register(header, true)
  if (props.formats.includes("video")) Quill.register(VideoBlot)

  await nextTick()

  if (!editorRef.value) return

  quill = new Quill(editorRef.value, {
    formats: props.formats,
    theme: "snow",
    placeholder: props.placeholder,
    bounds: editorRef.value,
    modules: {
      toolbar: toolbarRef.value
    }
  })
  quill.on("text-change", textChange)
  editorRef.value.removeEventListener("focusin", focusHandle)
  editorRef.value.addEventListener("focusin", focusHandle, { passive: true })
  editorRef.value.removeEventListener("focusout", blurHandle)
  editorRef.value.addEventListener("focusout", blurHandle, { passive: true })
  watch(
    () => props.modelValue,
    (val) => {
      if (props.focusIgnoreChange && isFocusing.value) return
      if (quillValue === val) return
      const contents = quill.clipboard.convert({ html: val })
      quill.setContents(contents)
    },
    { immediate: true }
  )
  watch(
    disabled,
    (val) => {
      if (val) quill.disable()
      else quill.enable()
    },
    { immediate: true }
  )
  // 这里等watch执行完
  nextTick(() => {
    if (props.autoFocus) activeQuill()
  })
})

const processing = ref(false)
const createProcess = async (image: string) => {
  if (!props.imageProcess) return
  const match = image.match(/<img src="data:(.+);base64,(.+)">/)
  if (!match) return
  const type = match[1]
  const base64 = match[2]
  const element = await new Promise<HTMLImageElement>((resolve) => {
    const imageElement = new Image()
    imageElement.onload = () => resolve(imageElement)
    imageElement.src = `data:${type};base64,${base64}`
  })
  const suffix = type.split("/")[1]
  const name = `${guid(false)}.${suffix}`
  const data = atob(base64)
  const arrayBuffer = new ArrayBuffer(data.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < data.length; i++) {
    uint8Array[i] = data.charCodeAt(i)
  }
  const blobImg = new Blob([uint8Array], { type })
  const file = new File([blobImg], name, { type, lastModified: Date.now() })
  const url = await props.imageProcess(file, element)
  return url ? { before: image, after: `<img src="${url}">` } : undefined
}

const textChange = async () => {
  const before = quill.getSemanticHTML()
  const imageList = before.match(/<img src="data:(.+?);base64,(.+?)">/g)
  if (!imageList?.length || !props.imageProcess) {
    quillValue = before
    emits("update:model-value", before)
    formEmits?.("input")
    return
  }
  let str = before
  processing.value = true
  const replaceList = await Promise.all(
    imageList.map((image) => createProcess(image))
  )
  processing.value = false
  for (let i = 0; i < replaceList.length; i += 1) {
    const item = replaceList[i]
    if (!item) continue
    str = str.replace(item.before, item.after)
  }
  quill.setContents(quill.clipboard.convert({ html: str }))
  quillValue = str
  emits("update:model-value", str)
  formEmits?.("input")
}

const isFocusing = ref(false)
const focusHandle = () => {
  isFocusing.value = true
  emits("focus")
  formEmits?.("focus")
}
const blurHandle = () => {
  isFocusing.value = false
  emits("blur")
  formEmits?.("blur")
}
const activeQuill = () => {
  if (disabled.value) return
  quill.focus()
}

let quillValue = ""

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (!value || value === "<p><br></p>" || value === "<p></p>") {
      if (options.requiredError) return options.requiredError
      if (options.label) return `当前内容为空，请输入${options.label}`
      return "当前内容为空，请输入"
    }
  }
  if (props.maxlength && value && value.length > props.maxlength) {
    return `最多输入${props.maxlength}个字符`
  }
  if (options.regexp) {
    if (!options.regexp.test(value ?? "")) {
      if (options.regexpError) return options.regexpError
      if (options.label) return `${options.label}格式不正确`
      return "格式不正确"
    }
  }
}
const { formEmits } = useFormItem(validate, activeQuill)
</script>

<style scoped>
.v-quill-toolbar {
  font-family: initial;
  font-size: initial;
  border: none;
  padding: 4px 8px;
}
.v-quill-toolbar:deep(.ql-picker) {
  color: inherit;
}
.v-quill-toolbar:deep(.ql-stroke) {
  stroke: currentColor;
}
.v-quill-toolbar:deep(.ql-fill) {
  fill: currentColor;
}
.v-quill-toolbar:deep(.ql-picker-options) {
  z-index: 999 !important;
  padding: 4px;
  @apply bg-natural-50 dark:bg-natural-950;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="10px"] {
  font-size: 10px;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="12px"] {
  font-size: 12px;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="14px"] {
  font-size: 14px;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="16px"] {
  font-size: 16px;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="20px"] {
  font-size: 20px;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="24px"] {
  font-size: 24px;
}
.v-quill-toolbar:deep(.ql-picker-item)[data-value="36px"] {
  font-size: 36px;
}
.v-quill-editor {
  font-family: initial;
  font-size: initial;
  height: unset;
  border: none;
}
.v-quill-editor:deep(.ql-blank::before) {
  @apply text-natural-400/60;
}
html.dark .v-quill-editor:deep(.ql-blank::before) {
  @apply text-natural-400/60;
}
.v-quill-editor:deep(.ql-editor)[contenteditable="false"] > * {
  cursor: not-allowed;
}
.v-quill-editor:deep(img, svg, video, embed, object) {
  display: initial;
  vertical-align: initial;
}
.v-quill-editor:deep(.ql-tooltip)::before {
  content: "跳转链接:";
}
.v-quill-editor:deep(.ql-tooltip) .ql-action::after {
  content: "保存";
}
.v-quill-editor:deep(.ql-tooltip) .ql-remove::before {
  content: "取消";
}
.v-quill-editor:deep(.ql-tooltip)[data-mode="link"]::before {
  content: "跳转链接:";
}
.v-quill-editor:deep(.ql-tooltip)[data-mode="link"] .ql-action::after {
  content: "保存";
}
.v-quill-editor:deep(.ql-tooltip)[data-mode="video"]::before {
  content: "视频链接:";
}
.v-quill-editor:deep(.ql-tooltip)[data-mode="video"] .ql-action::after {
  content: "保存";
}
</style>
