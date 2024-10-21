<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col"
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
          <v-input-datetime
            v-model="inputValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :clearable="clearable"
            :type="inputType"
            :size="size"
          />
        </v-fieldset>
      </div>
      <div class="">
        <v-fieldset
          :label="`开始: ${startValue ?? ''} 结束: ${endValue ?? ''}`"
          :type="type"
          :size="size"
          :always-show="alwaysShow"
        >
          <v-input-datetime-range
            v-model:start="startValue"
            v-model:end="endValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :clearable="clearable"
            :type="inputType"
            :size="size"
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
      <v-form-item label="类型">
        <v-radio-button v-model="inputType" value="datetime">
          日期时间
        </v-radio-button>
        <v-radio-button v-model="inputType" value="date">
          日期
        </v-radio-button>
        <v-radio-button v-model="inputType" value="time">
          时间
        </v-radio-button>
      </v-form-item>
      <v-form-item label="占位" fieldset="outline">
        <v-input v-model="placeholder" />
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

const inputValue = ref<string>()
const startValue = ref<string>()
const endValue = ref<string>()

const label = ref("日期输入框")
const placeholder = ref("请选择")
const inputType = ref<"datetime" | "date" | "time">("date")

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const type = ref<"outline" | "underline" | "none">("outline")

const disabled = ref(false)
const clearable = ref(true)
const alwaysShow = ref(false)
</script>
