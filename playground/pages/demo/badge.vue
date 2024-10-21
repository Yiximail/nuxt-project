<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <div class="flex items-center gap-10">
        <v-badge
          :content="number"
          :max="max"
          :color="color"
          :empty-hide="emptyHide"
          :shadow="shadow"
        >
          <v-button>按钮</v-button>
        </v-badge>
        <v-badge
          :content="number"
          :max="max"
          :color="color"
          :empty-hide="emptyHide"
          :shadow="shadow"
        >
          <span>文本</span>
        </v-badge>
        <v-badge
          :content="number"
          :max="max"
          :color="color"
          :empty-hide="emptyHide"
          :shadow="shadow"
        >
          <v-image
            src="/image.png"
            height="50"
            width="50"
            class="inline-block"
          />
        </v-badge>

        <v-badge
          content="文本"
          :max="max"
          :color="color"
          :empty-hide="emptyHide"
          :shadow="shadow"
        >
          <v-image
            src="/image.png"
            height="50"
            width="50"
            class="inline-block"
          />
        </v-badge>
      </div>
    </div>
    <v-form>
      <v-form-item label="颜色">
        <v-radio-button
          v-for="value in [
            'natural',
            'primary',
            'success',
            'warning',
            'danger',
            'info'
          ]"
          :key="value"
          v-model="color"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <v-form-item label="数" fieldset="outline">
        <v-input-number v-model="number" :min="0" :precision="0" />
      </v-form-item>
      <v-form-item label="最大值" fieldset="outline">
        <v-input-number v-model="max" :min="0" :precision="0" />
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="数字为零 字符串为空 隐藏">
          <v-checkbox v-model="emptyHide" />
        </v-form-item>
        <v-form-item label="阴影">
          <v-checkbox v-model="shadow" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const color = ref<Colors>("danger")

const number = ref(3)
const max = ref(99)
const emptyHide = ref(false)

const shadow = ref(true)
</script>
