<template>
  <form :class="containerClass" novalidate>
    <slot />
  </form>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import classMerge from "../../utils/class-merge"
import { FORM_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide } from "vue"

import type { DeepPartial, ClassNameValue, Size, UI } from "../../types"
import type { FormInjectionItem } from "../../types/injections"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["form"]>
    /** 大小 */
    size?: Size
  }>(),
  {
    class: undefined,
    ui: undefined,
    size: undefined
  }
)

const { ui } = useUi("form", props)
const { size } = useInheritedSize(props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, ui.value.size[size.value], props.class)
})

const formItemList = ref<FormInjectionItem[]>([])

const addFormItem = (item: FormInjectionItem) => {
  const index = formItemList.value.findIndex((v) => v.id === item.id)
  if (index !== -1) {
    console.warn(`[v-form] 表单项 ${item.id} 已经存在.`)
  } else {
    formItemList.value.push(item)
  }
}
const updateLabel = (id: string, label: string | undefined) => {
  const item = formItemList.value.find((v) => v.id === id)
  if (item) item.label = label
}
const removeFormItem = (id: string) => {
  const index = formItemList.value.findIndex((v) => v.id === id)
  if (index !== -1) formItemList.value.splice(index, 1)
}

const validateItem = async (label: string | string[]) => {
  const list = Array.isArray(label) ? label : [label]
  const items = formItemList.value.filter((v) => {
    if (v.label) return list.includes(v.label)
    console.warn(`[v-form] 表单项 ${v.id} 未设置 label.`)
    return false
  })
  const results = await Promise.all(items.map((v) => v.validate("validate")))
  const index = results.findIndex((v) => !v)
  if (index !== -1) {
    items[index].scrollIntoView()
    return false
  } else {
    return true
  }
}

const scrollToItem = (label: string) => {
  const item = formItemList.value.find((v) => v.label === label)
  if (item) item.scrollIntoView()
}

const validate = async () => {
  let valid = true
  let scrolled = false
  for (let i = 0; i < formItemList.value.length; i += 1) {
    const item = formItemList.value[i]
    const res = await item.validate("validate")
    if (res) continue
    valid = false
    if (scrolled) continue
    item.scrollIntoView()
    scrolled = true
  }
  return valid
}

const clearValidate = () => {
  for (let i = 0; i < formItemList.value.length; i += 1) {
    const item = formItemList.value[i]
    item.clearValidate()
  }
}

provide(FORM_INJECTION, {
  addFormItem,
  updateLabel,
  removeFormItem,
  validate,
  clearValidate
})

defineExpose({
  validate,
  validateItem,
  scrollToItem,
  clearValidate
})
</script>
