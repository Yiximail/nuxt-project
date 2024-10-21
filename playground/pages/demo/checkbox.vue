<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 mb-2"
    >
      <div class="flex gap-1 mb-2">
        {{ value1 }}
        {{ value2 }}
      </div>
      <div class="flex gap-2">
        <v-checkbox
          v-model="value1"
          :ripple="!simple"
          :size="size"
          :indeterminate="indeterminate"
          :disabled="disabled"
        >
          {{ label }}
        </v-checkbox>
        <v-checkbox
          v-model="value2"
          :ripple="!simple"
          :size="size"
          :indeterminate="indeterminate"
          :disabled="disabled"
        >
          {{ label }}
        </v-checkbox>
        <v-button :size="size">
          Test Button
        </v-button>
        <v-input model-value="Test Input" :size="size" class="bg-red-200" />
      </div>
    </div>
    <div class="border border-natural-300 dark:border-natural-700 rounded p-5">
      <div class="flex gap-1 mb-2">
        {{ valueList }}
      </div>
      <div class="flex gap-2">
        <v-checkbox-group
          v-model="valueList"
          :ripple="!simple"
          :disabled="disabled"
          value="value1"
        >
          value1
        </v-checkbox-group>
        <v-checkbox-group
          v-model="valueList"
          :ripple="!simple"
          :disabled="disabled"
          value="value2"
        >
          value2
        </v-checkbox-group>
        <v-checkbox-group
          v-model="valueList"
          :ripple="!simple"
          :disabled="disabled"
          value="value3"
        >
          value3
        </v-checkbox-group>
      </div>
    </div>
    <v-form>
      <v-form-item label="标签文字" fieldset="outline">
        <v-input v-model="label" />
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
      <div class="flex gap-10">
        <v-form-item label="简单模式">
          <v-checkbox v-model="simple" />
        </v-form-item>
        <v-form-item label="半选状态">
          <v-checkbox v-model="indeterminate" />
        </v-form-item>
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const valueList = ref<string[]>([])

const value1 = ref(false)
const value2 = ref(false)
const label = ref("Checkbox")

const simple = ref(false)
const indeterminate = ref(false)
const disabled = ref(false)

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
</script>
