<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <div>默认</div>
      <v-empty />
      <div>自定义</div>
      <v-empty icon="mdi:access-point" text="没有数据" />
      <div>自定义</div>
      <v-empty>
        <v-button>按钮</v-button>
      </v-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })
</script>
