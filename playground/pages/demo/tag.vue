<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 flex gap-1"
    >
      <v-tag
        :border="border"
        :closeable="closeable"
        :size="size"
        :color="color"
        :type="type"
        :shadow="shadow"
      >
        <v-icon v-if="buttonIcon" :svg="buttonIcon" />
        {{ buttonText }}
      </v-tag>
      <v-tag
        :border="border"
        :closeable="closeable"
        :size="size"
        :color="color"
        :type="type"
        :shadow="shadow"
      >
        <v-icon v-if="buttonIcon" :svg="buttonIcon" />
        {{ buttonText }}
      </v-tag>
    </div>
    <v-form>
      <v-form-item label="图标 svg" fieldset="outline">
        <template #info>
          https://icon-sets.iconify.design/mdi/
        </template>
        <v-input v-model="buttonIcon" />
      </v-form-item>
      <v-form-item label="文字" fieldset="outline">
        <v-input v-model="buttonText" />
      </v-form-item>
      <v-form-item label="类型">
        <v-radio-button
          v-for="value in ['base', 'plain', 'outline', 'text']"
          :key="value"
          v-model="type"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <v-form-item label="大小">
        <v-radio-button
          v-for="value in ['xl', 'lg', 'md', 'sm', 'xs']"
          :key="value"
          v-model="size"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <v-form-item label="颜色">
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
        <v-form-item label="可关闭">
          <v-checkbox v-model="closeable" />
        </v-form-item>
        <v-form-item label="阴影">
          <v-checkbox v-model="shadow" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Color } from "#ui"

definePageMeta({ layout: "demo" })

const buttonIcon = ref("")
const buttonText = ref("标签")
const type = ref<"base" | "plain" | "text">("base")
const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const color = ref<Color>("primary")
const border = ref(false)
const closeable = ref(false)
const shadow = ref(false)
</script>
