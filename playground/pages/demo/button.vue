<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 flex gap-2 items-center"
    >
      <v-button
        :border="border"
        :rounded="rounded"
        :disabled="disabled"
        :size="size"
        :color="color"
        :type="type"
        :shadow="shadow"
      >
        <v-icon name="mdi:account" />
      </v-button>
      <v-button
        :border="border"
        :rounded="rounded"
        :disabled="disabled"
        :size="size"
        :color="color"
        :type="type"
        :shadow="shadow"
      >
        <template v-if="!icon && !simple">
          {{ buttonText }}
        </template>
      </v-button>
      <v-button
        :border="border"
        :rounded="rounded"
        :disabled="disabled"
        :size="size"
        :color="color"
        :type="type"
        :shadow="shadow"
        target="_blank"
        to="http://baidu.com"
      >
        <template v-if="!icon && !simple">
          {{ buttonText }}
        </template>
      </v-button>
    </div>
    <v-form>
      <v-form-item label="按钮图标 svg" fieldset="outline">
        <template #info>
          https://icon-sets.iconify.design/mdi/
        </template>
        <v-input v-model="buttonIcon" />
      </v-form-item>
      <v-form-item label="按钮文字" fieldset="outline">
        <v-input v-model="buttonText" />
      </v-form-item>
      <v-form-item label="按钮类型">
        <v-radio-button
          v-for="value in ['base', 'plain', 'text']"
          :key="value"
          v-model="type"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <v-form-item label="按钮大小">
        <v-radio-button
          v-for="value in ['xl', 'lg', 'md', 'sm', 'xs']"
          :key="value"
          v-model="size"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <v-form-item label="按钮颜色">
        <v-radio-button
          v-for="value in [
            'natural',
            'primary',
            'success',
            'warning',
            'danger'
          ]"
          :key="value"
          v-model="color"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="边框">
          <v-checkbox v-model="border" />
        </v-form-item>
        <v-form-item label="圆形按钮">
          <v-checkbox v-model="rounded" />
        </v-form-item>
        <v-form-item label="阴影">
          <v-checkbox v-model="shadow" />
        </v-form-item>
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
        <v-form-item label="加载中">
          <v-checkbox v-model="loading" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Color } from "#ui"

definePageMeta({ layout: "demo" })

const buttonIcon = ref(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4\"/></svg>"
)
const buttonText = ref("按钮")
const type = ref<"base" | "plain" | "text">("base")
const simple = ref(false)
const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const color = ref<Color>("primary")
const border = ref(false)
const rounded = ref(false)
const icon = ref(false)
const shadow = ref(true)

const disabled = ref(false)
const loading = ref(true)
</script>
