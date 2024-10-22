<template>
  <div>
    <div class="border-2 border-natural-300 dark:border-natural-700 rounded p-5">
      <div>
        <v-link
          :disabled="disabled"
          :underline="underline"
          :color="color"
          target="_blank"
          to="http://baidu.com"
        >
          {{ buttonText }}
        </v-link>
      </div>
    </div>
    <v-form>
      <v-form-item label="链接文字" fieldset="outline">
        <v-input v-model="buttonText" />
      </v-form-item>
      <v-form-item label="链接颜色">
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
        <v-form-item label="下划线">
          <v-checkbox v-model="underline" />
        </v-form-item>
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Color } from "#ui"

definePageMeta({ layout: "demo" })

const buttonText = ref("链接")
const color = ref<Color>("primary")
const underline = ref(true)

const disabled = ref(false)
</script>
