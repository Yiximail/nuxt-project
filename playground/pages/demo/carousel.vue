<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    <v-carousel class="w-[600px]" :duration="duration * 1000">
      <template v-for="(item, index) in carouselList" :key="index">
        <div
          v-if="!item.url"
          class="w-full h-[400px] flex items-center justify-center bg-red-200"
        >
          {{ `第${index + 1}页内容` }}
        </div>
        <img
          v-else
          :src="item.url"
          class="w-full h-[400px] object-cover"
          :draggable="false"
        >
      </template>
    </v-carousel>
    <v-carousel
      class="w-[600px] h-[400px]"
      direction="vertical"
      :duration="duration * 1000"
    >
      <template v-for="(item, index) in carouselList" :key="index">
        <div
          v-if="!item.url"
          class="w-full h-[400px] flex items-center justify-center bg-red-200"
        >
          {{ `第${index + 1}页内容` }}
        </div>
        <img
          v-else
          :src="item.url"
          class="w-full h-[400px] object-cover"
          :draggable="false"
        >
      </template>
    </v-carousel>
    <div class="flex gap-2 mt-10">
      <v-button @click="addCarousel">
        添加元素
      </v-button>
      <v-button @click="carouselList.pop()">
        删除元素
      </v-button>
    </div>
    <v-form>
      <v-form-item label="持续时间" fieldset="outline">
        <template #info>
          0 为不自动播放
        </template>
        <v-input-number
          v-model="duration"
          :min="0"
          :max="10"
          :precision="0"
        />
      </v-form-item>
      <v-form-item
        v-for="(item, index) in carouselList"
        :key="index"
        :label="`第${index + 1}页图片链接`"
        fieldset="outline"
      >
        <v-input v-model="item.url" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const carouselList = ref<{ id: string; url?: string }[]>([
  {
    id: guid(),
    url: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
  },
  {
    id: guid(),
    url: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
  }
])
const duration = ref(3)
const addCarousel = () => {
  carouselList.value.push({
    id: guid()
  })
}
</script>
