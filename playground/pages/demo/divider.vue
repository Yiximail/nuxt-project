<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <div>普通分割线</div>
      <v-divider />
      <div>文本</div>
      <v-divider> 插入文本 </v-divider>
      <div>图标</div>
      <v-divider>
        <v-icon icon="mdi:abacus" />
      </v-divider>

      <div class="mt-20 border flex items-center h-[300px]">
        <div class="px-10">
          垂直的分割线
        </div>
        <v-divider type="vertical" />
        <div class="px-10">
          文本
        </div>
        <v-divider type="vertical">
          插入文本
        </v-divider>
        <div class="px-10">
          图标
        </div>
        <v-divider type="vertical">
          <v-icon icon="mdi:abacus" />
        </v-divider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })
</script>
