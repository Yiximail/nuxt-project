<template>
  <aside :class="containerClass" :style="menuStyle" v-bind="$attrs">
    <template v-if="$slots.header">
      <div :class="headerClass">
        <slot name="header" :expanded="showExpanded" />
      </div>
      <v-divider
        v-if="divider"
        :class="showExpanded ? 'my-3 mx-2' : 'my-3 mx-1'"
      />
    </template>
    <transition name="v-fade" mode="out-in">
      <v-scrollbar
        :ui="{
          container: scrollerClass,
          content: contentClass,
          vertical: { track: ui.scrollbar },
          view: viewClass
        }"
      >
        <slot :expanded="showExpanded" />
      </v-scrollbar>
    </transition>
    <template v-if="$slots.footer">
      <v-divider
        v-if="divider"
        :class="showExpanded ? 'my-3 mx-2' : 'my-3 mx-1'"
      />
      <div :class="footerClass">
        <slot name="footer" :expanded="showExpanded" />
      </div>
    </template>
    <div v-if="showButton" :class="buttonClass">
      <slot name="button" :expanded="showExpanded">
        <v-button
          type="plain"
          border
          size="sm"
          color="natural"
          class="w-5 bg-[--menu-bg] dark:bg-[--menu-bg] before:border-[--menu-border] dark:before:border-[--menu-border] hover:before:border-[--menu-border]"
          :shadow="false"
          @click="toggleHandle"
        >
          <v-icon
            icon="mdi:chevron-right"
            :class="showExpanded ? 'rotate-180' : ''"
            class="transition-transform h-5 w-5"
          />
        </v-button>
      </slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import VButton from "../button/button.vue"
import VDivider from "../divider/divider.vue"
import VScrollbar from "../scrollbar/scrollbar.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { MENU_INJECTION } from "../../utils/injection-keys"
import { ref, computed, watch, onMounted, provide, toRef } from "vue"
import { useRouter } from "#imports"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"
import type { CSSProperties } from "vue"

const props = withDefaults(
  defineProps<{
    /** 是否展开 */
    modelValue?: boolean
    /** 显示按钮 */
    showButton?: boolean
    /** 显示时动画 */
    appear?: boolean
    /** 展开后的宽度 */
    expandedWidth?: number | string
    /** 收起后的宽度 */
    collapsedWidth?: number | string
    /** 是否显示分割线 */
    divider?: boolean
    /** 是否显示阴影 */
    shadow?: boolean
    /** 激活的项 */
    actived?: string[]
    /** 展开的项 */
    expanded?: string[]
    /** 检测路由激活，判断值为name */
    routeActive?: boolean
    /** 子级激活，父级也激活 */
    parentActive?: boolean
    /** 子级继承父级激活 */
    childInherit?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["menu"]>
  }>(),
  {
    modelValue: undefined,
    showButton: true,
    appear: false,
    expandedWidth: "200px",
    collapsedWidth: "48px",
    divider: true,
    shadow: true,
    actived: undefined,
    expanded: undefined,
    routeActive: true,
    parentActive: false,
    childInherit: true,
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  "update:model-value": [value: boolean]
  "update:actived": [value: string[]]
  "update:expanded": [value: string[]]
}>()

defineSlots<{
  header:(props: { expanded: boolean }) => ComponentSlot
  default: (props: { expanded: boolean }) => ComponentSlot
  footer: (props: { expanded: boolean }) => ComponentSlot
  button: (props: { expanded: boolean }) => ComponentSlot
}>()

const { ui } = useUi("menu", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    isExpanded.value && ui.value.expanded.container,
    props.class
  )
})
const headerClass = computed(() => {
  return classMerge(
    ui.value.header,
    isExpanded.value && ui.value.expanded.header
  )
})
const scrollerClass = computed(() => {
  return classMerge(
    ui.value.scroller,
    isExpanded.value && ui.value.expanded.scroller
  )
})
const contentClass = computed(() => {
  return classMerge(
    ui.value.content,
    isExpanded.value && ui.value.expanded.content
  )
})
const viewClass = computed(() => {
  return classMerge(ui.value.view, isExpanded.value && ui.value.expanded.view)
})
const footerClass = computed(() => {
  return classMerge(
    ui.value.footer,
    isExpanded.value && ui.value.expanded.footer
  )
})
const buttonClass = computed(() => {
  return classMerge(
    ui.value.button,
    isExpanded.value && ui.value.expanded.button
  )
})

const menuStyle = computed(() => {
  const style = {} as CSSProperties
  if (typeof props.expandedWidth === "number") {
    style["--expanded-width"] = `${props.expandedWidth}px`
  } else {
    style["--expanded-width"] = props.expandedWidth
  }
  if (typeof props.collapsedWidth === "string") {
    style["--collapsed-width"] = props.collapsedWidth
  } else {
    style["--collapsed-width"] = `${props.collapsedWidth}px`
  }
  return style
})

const showExpanded = computed(() => {
  return (props.modelValue ?? isExpanded.value) || beforeMountedShow.value
})

const isExpanded = ref(props.modelValue ?? true)
const toggleHandle = () => {
  if (showExpanded.value) {
    collapseHandle()
  } else {
    expandHandle()
  }
}
const expandHandle = () => {
  isExpanded.value = true
  emits("update:model-value", true)
}
const collapseHandle = () => {
  isExpanded.value = false
  emits("update:model-value", false)
}
const beforeMountedShow = ref(props.appear && !props.modelValue)
onMounted(() => {
  watch(
    () => props.modelValue,
    (val) => {
      if (val === undefined) return
      if (val) {
        expandHandle()
      } else {
        collapseHandle()
      }
    },
    { immediate: true }
  )
  requestAnimationFrame(() => {
    beforeMountedShow.value = false
  })
})

const activedList = ref<string[]>([])
const updateActived = (id: string, value: boolean) => {
  if (props.actived) {
    const index = props.actived.indexOf(id)
    if (value && index === -1) {
      const newList = [...props.actived, id]
      emits("update:actived", newList)
    } else if (!value && index !== -1) {
      const newList = [...props.actived].splice(index, 1)
      emits("update:actived", newList)
    }
  } else {
    const index = activedList.value.indexOf(id)
    if (value && index === -1) {
      activedList.value.push(id)
    } else if (!value && index !== -1) {
      activedList.value.splice(index, 1)
    }
  }
}
const expandedList = ref<string[]>([])
const updateExpanded = (id: string, value: boolean) => {
  if (props.expanded) {
    const index = props.expanded.indexOf(id)
    if (value && index === -1) {
      const newList = [...props.expanded, id]
      emits("update:expanded", newList)
    } else if (!value && index !== -1) {
      const newList = [...props.expanded].splice(index, 1)
      emits("update:expanded", newList)
    }
  } else {
    const index = expandedList.value.indexOf(id)
    if (value && index === -1) {
      expandedList.value.push(id)
    } else if (!value && index !== -1) {
      expandedList.value.splice(index, 1)
    }
  }
}

const router = useRouter()
const currentRoute = computed(() => {
  if (!props.routeActive) return
  return router.currentRoute.value
})

provide(MENU_INJECTION, {
  classes: computed(() => {
    return ui.value.item
  }),
  menuExpanded: computed(() => {
    if (props.modelValue !== undefined) return props.modelValue
    return isExpanded.value
  }),
  activedList: computed(() => {
    if (props.actived) return props.actived
    return activedList.value
  }),
  updateActived,
  expandedList: computed(() => {
    if (props.expanded) return props.expanded
    return expandedList.value
  }),
  updateExpanded,
  currentRoute,
  childInherit: toRef(props, "childInherit"),
  parentActive: toRef(props, "parentActive")
})
</script>
