<template>
  <div
    ref="containerRef"
    :class="['v-quill', containerClass]"
    v-bind="fieldsetAttrs"
  >
    <div ref="editorRef" :class="['v-quill-editor', ui.editor]" />
  </div>
</template>

<script setup lang="ts">
import useFieldset from "../../composables/use-fieldset"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, watch, computed, nextTick, onMounted } from "vue"

import type { DeepPartial, ClassNameValue, QuillImports, UI } from "../../types"
import type Quill from "quill"

const containerRef = ref<HTMLDivElement>()
const editorRef = ref<HTMLDivElement>()

const props = defineProps<{
  html: string | undefined
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["quillViewer"]>
}>()

const { ui } = useUi("quillViewer", props)

const { fieldsetAttrs } = useFieldset({
  value: ref(true)
})

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
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

  await nextTick()

  if (!editorRef.value) return

  quill = new Quill(editorRef.value, {
    theme: "snow",
    readOnly: true,
    modules: {
      toolbar: false
    }
  })
  watch(
    () => props.html,
    (val) => {
      const contents = quill.clipboard.convert({ html: val })
      quill.setContents(contents)
    },
    { immediate: true }
  )
})
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
.v-quill-editor:deep(img, svg, video, embed, object) {
  display: initial;
  vertical-align: initial;
}
</style>
