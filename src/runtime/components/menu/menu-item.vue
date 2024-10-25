<template>
  <div
    v-if="!to"
    ref="containerRef"
    :class="containerClass"
    :style="itemStyle"
    @click="clickHandle"
    @mouseenter.capture="mouseenterHandle"
  >
    <slot name="prepend" :expanded="isExpanded" :actived="isActived">
      <transition name="v-fade">
        <v-icon v-if="icon && (!level || menuExpanded)" :icon="icon" />
      </transition>
    </slot>
    <transition name="v-fade">
      <div v-if="menuExpanded" ref="labelRef" :class="labelClass">
        <slot name="label" :expanded="isExpanded" :actived="isActived">
          {{ label }}
        </slot>
      </div>
    </transition>
    <transition name="v-fade">
      <slot name="append" :expanded="isExpanded" :actived="isActived">
        <v-icon
          v-if="hasChildren && menuExpanded"
          icon="mdi:chevron-right"
          :class="arrowClass"
        />
      </slot>
    </transition>
  </div>
  <nuxt-link
    v-else
    ref="linkRef"
    :class="containerClass"
    :style="itemStyle"
    :to="to"
    @mouseenter.capture="mouseenterHandle"
  >
    <slot name="prepend" :expanded="isExpanded" :actived="isActived">
      <transition name="v-fade">
        <v-icon v-if="icon && (!level || menuExpanded)" :icon="icon" />
      </transition>
    </slot>
    <transition name="v-fade">
      <div v-if="menuExpanded" ref="labelRef" :class="labelClass">
        <slot name="label" :expanded="isExpanded" :actived="isActived">
          {{ label }}
        </slot>
      </div>
    </transition>
    <transition name="v-fade">
      <slot name="append" :expanded="isExpanded" :actived="isActived">
        <v-icon
          v-if="hasChildren && menuExpanded"
          icon="mdi:chevron-right"
          :class="arrowClass"
        />
      </slot>
    </transition>
  </nuxt-link>
  <v-tooltip
    v-if="elementRef"
    :model-value="showTooltip"
    :reference="elementRef"
    trigger="hover"
    placement="right"
    :content="label"
    @update:model-value="updateShowTooltip"
  />
  <v-collapse :show="isExpanded && menuExpanded" always-render>
    <slot :expanded="isExpanded" :actived="isActived" />
  </v-collapse>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import VTooltip from "../tooltip/tooltip.vue"
import VCollapse from "../collapse/collapse.vue"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import {
  MENU_INJECTION,
  MENU_ITEM_INJECTION,
  SCROLLBAR_INJECTION
} from "../../utils/injection-keys"
import {
  ref,
  computed,
  watch,
  provide,
  inject,
  onMounted,
  onBeforeUnmount
} from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  IconComponent,
  ComponentSlot,
  UI
} from "../../types"
import type { CSSProperties } from "vue"
import type { RouterLink, RouteLocationRaw } from "vue-router"

const containerRef = ref<HTMLElement>()
const labelRef = ref<HTMLElement>()
const linkRef = ref<InstanceType<typeof RouterLink>>()

const props = withDefaults(
  defineProps<{
    /** 唯一值，不写时会随机生成 */
    id?: string
    /** 是否展开 */
    expanded?: boolean
    /** 是否激活，不写时匹配路由跳转 */
    actived?: boolean
    /** 禁用 */
    disabled?: boolean
    /** 图标 */
    icon?: IconComponent
    /** 标签 */
    label?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["menuItem"]>

    /** 路由跳转 */
    to?: RouteLocationRaw
  }>(),
  {
    id: () => guid(),
    expanded: undefined,
    actived: undefined,
    disabled: undefined,
    icon: undefined,
    label: "",
    class: undefined,
    ui: undefined,
    to: undefined
  }
)

const emits = defineEmits<{
  click: [event: MouseEvent]
  "update:expanded": [val: boolean]
  "update:actived": [val: boolean]
}>()

defineSlots<{
  append:(props: { expanded: boolean; actived: boolean }) => ComponentSlot
  label: (props: { expanded: boolean; actived: boolean }) => ComponentSlot
  prepend: (props: { expanded: boolean; actived: boolean }) => ComponentSlot
  default: (props: { expanded: boolean; actived: boolean }) => ComponentSlot
}>()

const hasChildren = computed(() => childrenIds.value.length > 0)

const { ui } = useUi("menuItem", props)

const { disabled } = useInheritedDisabled(props)
const elementRef = computed(() => {
  const linkEl = (linkRef.value as Record<string, unknown>)?.$el
  if (window === undefined) return undefined
  if (linkEl instanceof HTMLElement) {
    return linkEl
  } else if (containerRef.value) {
    return containerRef.value
  }
  return undefined
})
useClickRipple(elementRef, {
  disabled
})

const containerClass = computed(() => {
  return classMerge(
    classes.value.container,
    ui.value.container,
    isActived.value && [
      classes.value.actived.container,
      ui.value.actived.container
    ],
    isExpanded.value && [
      classes.value.expanded.container,
      ui.value.expanded.container
    ],
    disabled.value && [
      classes.value.disabled.container,
      ui.value.disabled.container
    ],
    props.class
  )
})
const labelClass = computed(() => {
  return classMerge(
    classes.value.label,
    ui.value.label,
    isActived.value && [classes.value.actived.label, ui.value.actived.label],
    isExpanded.value && [
      classes.value.expanded.label,
      ui.value.expanded.label
    ],
    disabled.value && [classes.value.disabled.label, ui.value.disabled.label]
  )
})
const arrowClass = computed(() => {
  return classMerge(
    classes.value.arrow,
    ui.value.arrow,
    isActived.value && [classes.value.actived.arrow, ui.value.actived.arrow],
    isExpanded.value && [
      classes.value.expanded.arrow,
      ui.value.expanded.arrow
    ],
    disabled.value && [classes.value.disabled.arrow, ui.value.disabled.arrow]
  )
})

const itemStyle = computed(() => {
  const style = {} as CSSProperties
  style["--menu-level"] = level.value
  return style
})

const {
  classes,
  menuExpanded,
  activedList,
  updateActived,
  expandedList,
  updateExpanded,
  currentRoute,
  childInherit,
  parentActive
} = inject(MENU_INJECTION)!
const isRouteActived = (to: RouteLocationRaw) => {
  if (!currentRoute.value) return false
  const { path, name } = currentRoute.value
  const toName =
    typeof to !== "string" && to?.path === undefined ? to?.name : undefined
  // if (matched.some((route) => route.path === to)) return true
  if (name && name === toName) return true
  if (path && path === to) return true
  return false
}
const isActived = computed(() => {
  if (props.actived !== undefined) return props.actived
  if (props.to && isRouteActived(props.to)) return true
  if (parentActive.value && menuItemInjection?.parentActived) return true
  if (childActived.value) return true
  return activedList.value.includes(props.id)
})
const childActived = computed(() => {
  if (!childInherit.value) return false
  return childrenIds.value.some((child) => {
    if (activedList.value.includes(child.id)) return true
    return !!child.to && isRouteActived(child.to)
  })
})
const isExpanded = computed(() => {
  if (!hasChildren.value) return false
  if (props.expanded !== undefined) return props.expanded
  return expandedList.value.includes(props.id)
})

const menuItemInjection = inject(MENU_ITEM_INJECTION, undefined)
onMounted(() => {
  menuItemInjection?.setMenu(props.id, props.to)
  watch(
    () => ({ id: props.id, to: props.to }),
    (newVal, oldVal) => {
      updateActived(oldVal.id, false)
      updateExpanded(oldVal.id, false)
      menuItemInjection?.removeMenu(oldVal.id)
      menuItemInjection?.setMenu(newVal.id, newVal.to)
    }
  )
})
onBeforeUnmount(() => {
  updateActived(props.id, false)
  updateExpanded(props.id, false)
  menuItemInjection?.removeMenu(props.id)
})

const level = computed(() => {
  if (!menuItemInjection) return 0
  return menuItemInjection.level.value + 1
})
const childrenIds = ref<{ id: string; to?: RouteLocationRaw }[]>([])
const setMenu = (id: string, to?: RouteLocationRaw) => {
  const index = childrenIds.value.findIndex((item) => item.id === id)
  if (index === -1) childrenIds.value.push({ id, to })
  menuItemInjection?.setMenu(id, to)
}
const removeMenu = (id: string) => {
  const index = childrenIds.value.findIndex((item) => item.id === id)
  if (index !== -1) childrenIds.value.splice(index, 1)
  menuItemInjection?.removeMenu(id)
}
provide(MENU_ITEM_INJECTION, {
  level,
  parentActived: isActived,
  setMenu,
  removeMenu
})

const clickHandle = (event: MouseEvent) => {
  if (disabled.value) return
  emits("click", event)
  if (isExpanded.value && hasChildren.value) {
    emits("update:expanded", false)
    updateExpanded(props.id, false)
  } else {
    emits("update:expanded", true)
    updateExpanded(props.id, true)
  }
}

const scrollbarInjection = inject(SCROLLBAR_INJECTION, undefined)
const scrollTo = () => {
  if (!elementRef.value) return
  if (scrollbarInjection?.scrollbar.value) {
    const scrollbarHeight = scrollbarInjection.scrollbar.value.clientHeight
    const height = elementRef.value.clientHeight
    scrollbarInjection.scrollbar.value.scrollTo({
      top: elementRef.value.offsetTop - scrollbarHeight / 2 + height / 2
    })
  } else {
    elementRef.value.scrollIntoView({ block: "nearest" })
  }
}
onMounted(() => {
  if (isActived.value) {
    scrollTo()
  }
})

const showTooltip = ref(false)
const updateShowTooltip = (val: boolean) => {
  if (!val) showTooltip.value = false
}
let expandingTimer: number | undefined
watch(menuExpanded, () => {
  if (!expandingTimer) {
    expandingTimer = window.setTimeout(() => {
      showTooltip.value = false
      expandingTimer = undefined
    }, 200)
  }
})
const mouseenterHandle = () => {
  if (expandingTimer) return
  if (!labelRef.value) {
    showTooltip.value = true
  } else if (labelRef.value.scrollWidth > labelRef.value.clientWidth) {
    showTooltip.value = true
  } else {
    showTooltip.value = false
  }
}
</script>
