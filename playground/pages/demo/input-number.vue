<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <div>
        {{ `输入内容: ${inputValue ?? ""}` }}
      </div>
      <div class="">
        <v-fieldset
          :label="label"
          :type="type"
          :size="size"
          :always-show="alwaysShow"
        >
          <v-input-number
            v-model="inputValue"
            :placeholder="placeholder"
            :precision="precision"
            :size="size"
            :max="max"
            :min="min"
            :disabled="disabled"
            :clearable="clearable"
          />
        </v-fieldset>
        <v-fieldset
          :label="label"
          :type="type"
          :size="size"
          :active-offset-x="type === 'outline' ? undefined : '16px'"
          offset-x="calc(0.5rem + 16px)"
          :always-show="alwaysShow"
        >
          <v-icon
            icon="mdi:search"
            class="text-natural-500 dark:text-natural-400"
          />
          <v-input-number
            v-model="inputValue"
            :placeholder="placeholder"
            :precision="precision"
            :size="size"
            :max="max"
            :min="min"
            :disabled="disabled"
            :clearable="clearable"
          />
        </v-fieldset>
        <v-fieldset
          :label="label"
          :type="type"
          :size="size"
          :always-show="alwaysShow"
        >
          <template #label>
            <v-icon icon="mdi:magnify" />
            <div>{{ label }}</div>
          </template>
          <v-input-number
            v-model="inputValue"
            :placeholder="placeholder"
            :precision="precision"
            :size="size"
            :max="max"
            :min="min"
            :disabled="disabled"
            :clearable="clearable"
          />
        </v-fieldset>
      </div>
    </div>
    <v-form>
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
      <v-form-item label="占位" fieldset="outline">
        <v-input v-model="placeholder" />
      </v-form-item>
      <v-form-item label="精度" fieldset="outline">
        <v-input-number v-model="precision" :min="0" :precision="0" />
      </v-form-item>
      <v-form-item label="最小值" fieldset="outline">
        <v-input-number v-model="min" />
      </v-form-item>
      <v-form-item label="最大值" fieldset="outline">
        <v-input-number v-model="max" />
      </v-form-item>
      <v-form-item label="输入框标签" fieldset="outline">
        <v-input v-model="label" />
      </v-form-item>
      <v-form-item label="输入框类型">
        <v-radio-button v-model="type" value="outline">
          外边框
        </v-radio-button>
        <v-radio-button v-model="type" value="underline">
          下划线
        </v-radio-button>
        <v-radio-button v-model="type" value="none">
          无
        </v-radio-button>
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
        <v-form-item label="可清除">
          <v-checkbox v-model="clearable" />
        </v-form-item>
        <v-form-item label="一直显示">
          <v-checkbox v-model="alwaysShow" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const inputValue = ref<number>()
const label = ref("数字输入框")
const placeholder = ref("请输入内容")

const precision = ref(2)
const min = ref(0)
const max = ref(100)

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const type = ref<"outline" | "underline" | "none">("outline")

const disabled = ref(false)
const clearable = ref(true)
const alwaysShow = ref(false)
</script>
