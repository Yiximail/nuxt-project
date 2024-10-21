<template>
  <div ref="containerRef" :class="containerClass" :style="itemStyle">
    <slot name="label">
      <transition name="v-fade">
        <div v-if="menuExpanded" :class="ui.content">
          {{ label }}
        </div>
      </transition>
    </slot>
  </div>
  <slot />
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { MENU_INJECTION, MENU_ITEM_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide, inject } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"
import type { CSSProperties } from "vue"
import type { RouteLocationRaw } from "vue-router"

const containerRef = ref<HTMLElement>()

const props = withDefaults(
  defineProps<{
    /** 标签 */
    label?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["menuGroup"]>
  }>(),
  {
    label: "",
    class: undefined,
    ui: undefined
  }
)

defineSlots<{
  label:() => ComponentSlot
  default: () => ComponentSlot
}>()

const { ui } = useUi("menuGroup", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const itemStyle = computed(() => {
  const style = {} as CSSProperties
  style["--menu-level"] = level.value
  return style
})

const { menuExpanded } = inject(MENU_INJECTION)!
const menuItemInjection = inject(MENU_ITEM_INJECTION, undefined)

const level = computed(() => {
  if (!menuItemInjection) return 0
  return menuItemInjection.level.value + 1
})
const setMenu = (id: string, to?: RouteLocationRaw) => {
  menuItemInjection?.setMenu(id, to)
}
const removeMenu = (id: string) => {
  menuItemInjection?.removeMenu(id)
}
provide(MENU_ITEM_INJECTION, {
  level,
  parentActived: computed(
    () => menuItemInjection?.parentActived?.value ?? false
  ),
  setMenu,
  removeMenu
})
</script>
