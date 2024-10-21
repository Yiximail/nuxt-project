<template>
  <nuxt-link
    ref="linkRef"
    :class="linkClass"
    :to="to"
    :href="href"
    :external="external"
    :target="target"
    :rel="rel"
    :no-rel="noRel"
    :prefetched-class="prefetchedClass"
    :prefetch="prefetch ?? !noPrefetch"
    :prefetch-on="prefetchOn"
    v-bind="$attrs"
    @click="clickLinkHandle"
  >
    <slot />
  </nuxt-link>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import useInheritedDisabled from "../../composables/use-inherited-disabled"

import classMerge from "../../utils/class-merge"
import { ref, toRef, computed } from "vue"

import type { ClassNameValue, DeepPartial, Color, UI } from "../../types"
import type { NuxtLinkProps } from "nuxt/app"
import type { RouterLink } from "vue-router"

const linkRef = ref<InstanceType<typeof RouterLink>>()

interface LinkProps extends NuxtLinkProps {
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["link"]>
  /** 颜色 */
  color?: Color
  /** 下划线 */
  underline?: boolean
  /** 禁用 */
  disabled?: boolean
}
const props = withDefaults(defineProps<LinkProps>(), {
  class: undefined,
  ui: undefined,
  color: "primary",
  underline: true,
  disabled: undefined
})

const { ui } = useUi("link", props, { color: toRef(props, "color") })
const { disabled } = useInheritedDisabled(props)

const linkClass = computed(() => {
  return classMerge(
    ui.value.base,
    !disabled.value && ui.value.enabled,
    disabled.value && ui.value.disabled,
    props.underline && ui.value.underline,
    props.class
  )
})

const clickLinkHandle = (event: MouseEvent) => {
  if (disabled.value) event.preventDefault()
}

defineExpose({ reference: linkRef })
</script>
