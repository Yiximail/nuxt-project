<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <v-progress
        ref="progressRef"
        v-model="isRunning"
        :class="direction === 'vertical' ? 'h-[300px]' : ''"
        :bar-class="barColor"
        :from="from"
        :to="to"
        :fixed="fixed"
        :direction="direction"
        :duration="duration * 1000"
      />
    </div>
    <v-form>
      <v-form-item label="进度条方向">
        <v-radio-button v-model="direction" value="horizontal">
          水平的
        </v-radio-button>
        <v-radio-button v-model="direction" value="vertical">
          垂直的
        </v-radio-button>
      </v-form-item>
      <v-form-item label="固定方向">
        <v-radio-button v-model="fixed" value="start">
          固定左（上）
        </v-radio-button>
        <v-radio-button v-model="fixed" value="end">
          固定右（下）
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
      <v-form-item label="开始值" fieldset="outline">
        <template #info>
          0~100，也可以比结束值大，会反向缩短
        </template>
        <v-input-number
          v-model="from"
          :min="0"
          :max="100"
          :precision="0"
        />
      </v-form-item>
      <v-form-item label="结束值" fieldset="outline">
        <v-input-number
          v-model="to"
          :min="0"
          :max="100"
          :precision="0"
        />
      </v-form-item>
      <v-form-item label="整条进度条的时间" fieldset="outline">
        <v-input-number
          v-model="duration"
          :min="0"
          :max="100"
          :precision="0"
        />
        秒
      </v-form-item>
      <v-form-item label="操控">
        <v-button @click="startHandle">
          开始
        </v-button>
        <v-button @click="pauseHandle">
          暂停
        </v-button>
        <v-button @click="restartHandle">
          重新开始
        </v-button>
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { VProgress } from "#components"
import type { Color } from "#ui"

definePageMeta({ layout: "demo" })

const progressRef = ref<InstanceType<typeof VProgress>>()

const isRunning = ref(true)
const from = ref(0)
const to = ref(100)
const duration = ref(5)

const direction = ref<"horizontal" | "vertical">("horizontal")
const fixed = ref<"start" | "end">("start")
const color = ref<Color>("primary")
const barColor = computed(() => {
  switch (color.value) {
    case "primary":
      return "bg-primary-500"
    case "success":
      return "bg-success-500"
    case "warning":
      return "bg-warning-500"
    case "danger":
      return "bg-danger-500"
    default:
      return "bg-natural-500"
  }
})

const startHandle = () => {
  progressRef.value?.start()
}
const pauseHandle = () => {
  progressRef.value?.pause()
}
const restartHandle = () => {
  progressRef.value?.restart()
}
</script>
