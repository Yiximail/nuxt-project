<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 mb-2"
    >
      <div class="flex gap-2 mb-2">
        {{ value }}
      </div>
      <div class="flex gap-2">
        <v-switch
          v-model="value"
          :size="size"
          :disabled="disabled"
          value="value1"
        >
          {{ label }}
        </v-switch>
      </div>
    </div>
    <v-form>
      <v-form-item label="标签文字" fieldset="outline">
        <v-input v-model="label" />
      </v-form-item>
      <v-form-item label="大小">
        <v-radio-button
          v-for="i in ['xl', 'lg', 'md', 'sm', 'xs']"
          :key="i"
          v-model="size"
          :value="i"
        >
          {{ i }}
        </v-radio-button>
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="简单模式">
          <v-checkbox v-model="simple" />
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

const value = ref(false)
const label = ref("Switch")

const simple = ref(false)
const disabled = ref(false)

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
</script>
