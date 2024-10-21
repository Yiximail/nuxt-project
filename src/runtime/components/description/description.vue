<template>
  <div ref="containerRef" :class="containerClass">
    <table :class="ui.table">
      <tbody :class="ui.tableBody">
        <template v-if="layout === 'vertical'">
          <template v-for="(row, rowIndex) in displayList" :key="rowIndex">
            <tr v-if="row.type === 'label'">
              <td
                v-for="(item, itemIndex) in row.list"
                :key="itemIndex"
                :class="
                  classMerge(
                    itemClass,
                    labelClass,
                    item.itemClass,
                    item.labelClass
                  )
                "
                :colspan="item.span"
              >
                <component :is="item.slots.label" v-if="item.slots.label" />
                <span v-else>{{ item.label }}</span>
              </td>
            </tr>
            <tr v-else>
              <td
                v-for="(item, itemIndex) in row.list"
                :key="itemIndex"
                :class="
                  classMerge(
                    itemClass,
                    contentClass,
                    item.itemClass,
                    item.contentClass
                  )
                "
                :colspan="item.span"
              >
                <component :is="item.slots.content" v-if="item.slots.content" />
                <span v-else>{{ item.content }}</span>
              </td>
            </tr>
          </template>
        </template>
        <template v-else-if="layout === 'horizontal'">
          <template v-for="(row, rowIndex) in displayList" :key="rowIndex">
            <tr>
              <template v-for="(item, itemIndex) in row.list" :key="itemIndex">
                <td
                  :class="
                    classMerge(
                      itemClass,
                      labelClass,
                      item.itemClass,
                      item.labelClass
                    )
                  "
                >
                  <component :is="item.slots.label" v-if="item.slots.label" />
                  <span v-else>{{ item.label }}</span>
                </td>
                <td
                  :class="
                    classMerge(
                      itemClass,
                      contentClass,
                      item.itemClass,
                      item.contentClass
                    )
                  "
                  :colspan="item.span * 2 - 1"
                >
                  <component
                    :is="item.slots.content"
                    v-if="item.slots.content"
                  />
                  <span v-else>{{ item.content }}</span>
                </td>
              </template>
            </tr>
          </template>
        </template>
        <template v-else>
          <template v-for="(row, rowIndex) in displayList" :key="rowIndex">
            <tr>
              <td
                v-for="(item, itemIndex) in row.list"
                :key="itemIndex"
                :class="classMerge(itemClass, item.itemClass)"
                :colspan="item.span"
              >
                <component
                  :is="layout === 'vertical-inline' ? 'div' : 'span'"
                  :class="classMerge(labelClass, item.labelClass)"
                >
                  <component :is="item.slots.label" v-if="item.slots.label" />
                  <span v-else>
                    {{
                      item.label && layout === "horizontal-inline"
                        ? item.label + inlineSeparator
                        : item.label
                    }}
                  </span>
                </component>
                <component
                  :is="layout === 'vertical-inline' ? 'div' : 'span'"
                  :class="classMerge(contentClass, item.contentClass)"
                >
                  <component
                    :is="item.slots.content"
                    v-if="item.slots.content"
                  />
                  <span v-else>{{ item.content }}</span>
                </component>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div class="hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { DESCRIPTION_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"
import type { DescriptionItem } from "../../types/injections"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["description"]>
    /** 列数 */
    column?: number
    /** 布局方式 */
    layout?: "vertical" | "horizontal" | "vertical-inline" | "horizontal-inline"
    /** 内联样式的分隔符 */
    inlineSeparator?: string
    /** 是否显示边框 */
    border?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    column: 3,
    layout: "horizontal",
    inlineSeparator: ":",
    border: true
  }
)

const { ui } = useUi("description", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})
const itemClass = computed(() => {
  return classMerge(
    ui.value.item,
    ui.value[props.layout].item,
    props.border && ui.value.border
  )
})
const labelClass = computed(() => {
  return classMerge(ui.value.label, ui.value[props.layout].label)
})
const contentClass = computed(() => {
  return classMerge(ui.value.content, ui.value[props.layout].content)
})

const displayList = computed(() => {
  const results: { type: "label" | "content"; list: DescriptionItem[] }[] = []
  let label: DescriptionItem[] = []
  let content: DescriptionItem[] = []
  let listSpan = 0
  for (const item of itemList.value) {
    if (listSpan + item.span > props.column && listSpan !== 0) {
      results.push({ type: "label", list: label })
      results.push({ type: "content", list: content })
      label = []
      content = []
      listSpan = 0
    }
    if (item.span > props.column) {
      results.push({ type: "label", list: [item] })
      results.push({ type: "content", list: [item] })
    } else {
      label.push(item)
      content.push(item)
      listSpan += item.span
    }
  }
  if (listSpan !== 0) {
    results.push({ type: "label", list: label })
    results.push({ type: "content", list: content })
  }
  if (props.layout !== "vertical") {
    return results.filter((r) => r.type === "content")
  }
  return results
})
const itemList = ref<DescriptionItem[]>([])
const setItem = (item: DescriptionItem) => {
  const index = itemList.value.findIndex((i) => i.id === item.id)
  if (index === -1) {
    itemList.value.push(item)
  } else {
    Object.assign(itemList.value[index], item)
  }
}
const removeItem = (id: string) => {
  const index = itemList.value.findIndex((i) => i.id === id)
  if (index !== -1) {
    itemList.value.splice(index, 1)
  }
}

provide(DESCRIPTION_INJECTION, { setItem, removeItem })
</script>
