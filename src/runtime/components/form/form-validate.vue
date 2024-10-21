<template>
  <v-collapse :show="!!message" :class="containerClass">
    <template v-if="typeof message === 'string'">
      {{ message }}
    </template>
    <template v-else>
      <component :is="message" />
    </template>
  </v-collapse>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  FormValidateStatus,
  FormValidateMessage,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["formValidate"]>
    /** 表单状态 */
    status?: FormValidateStatus
    /** 表单校验信息 */
    message?: FormValidateMessage
  }>(),
  {
    class: undefined,
    ui: undefined,
    status: undefined,
    message: undefined
  }
)

const { ui } = useUi("formValidate", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.status === "success" && ui.value.success,
    props.status === "warning" && ui.value.warning,
    props.status === "error" && ui.value.error,
    props.class
  )
})
</script>
