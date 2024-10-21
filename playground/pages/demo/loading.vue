<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <div>默认</div>
      <v-loading />
      <div>自定义</div>
      <v-loading icon="mdi:access-point" text="没有数据" />
      <div>自定义</div>
      <v-loading>
        <v-button>按钮</v-button>
      </v-loading>
      <div>任意元素</div>
      <div
        v-loading="true"
        loading-text="加载中"
        loading-container-class=""
        loading-content-class="text-white"
        loading-spinner-class="text-white"
        loading-text-class="text-white"
        class="w-fit mx-auto"
      >
        <v-image
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
          height="207px"
          width="300px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })
</script>
