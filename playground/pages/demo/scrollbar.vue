<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <div>内容部分为200px x 200px</div>
      <div>蓝色部分为滚动条框</div>

      <v-button @click="addContent">
        添加内容
      </v-button>
      <div class="flex">
        <div class="flex-1 min-w-0">
          <div>内置的</div>
          <v-scrollbar
            class="border border-primary-500 h-[200px] w-[200px]"
            @resize="resizeHandle"
          >
            <div v-for="(item, index) in contentList" :key="index">
              {{ item }}
            </div>
          </v-scrollbar>
          <div class="mt-5">
            外置的
          </div>
          <v-scrollbar
            class="border border-primary-500 h-[200px] w-[200px]"
            outset
          >
            <div class="min-h-[200px]">
              <div v-for="(item, index) in contentList" :key="index">
                {{ item }}
              </div>
            </div>
          </v-scrollbar>
          <div class="mt-5">
            左右滚动的
          </div>
          <v-scrollbar
            class="border border-primary-500 h-[200px] w-[200px]"
            scroll-x
            :scroll-y="false"
          >
            <div class="flex gap-1 w-max">
              <div
                v-for="(item, index) in contentList"
                :key="index"
                class="w-max"
              >
                {{ item }}
              </div>
            </div>
          </v-scrollbar>
          <div>都有的</div>
          <v-scrollbar
            class="border border-primary-500 h-[200px] w-[200px]"
            scroll-x
          >
            <div class="h-max w-max">
              <v-image
                src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
                height="415px"
                width="600px"
              />
            </div>
          </v-scrollbar>
        </div>
        <div class="flex-1 min-w-0">
          <div>原生的</div>
          <v-scrollbar-native
            class="border border-primary-500 h-[200px] w-[200px]"
          >
            <div v-for="(item, index) in contentList" :key="index">
              {{ item }}
            </div>
          </v-scrollbar-native>
          <div class="mt-5">
            -
          </div>
          <div class="h-[202px] w-[202px]" />
          <div class="mt-5">
            左右滚动的
          </div>
          <v-scrollbar-native
            class="border border-primary-500 h-[200px] w-[200px]"
            scroll-x
            :scroll-y="false"
          >
            <div class="flex gap-1 w-max">
              <div
                v-for="(item, index) in contentList"
                :key="index"
                class="w-max"
              >
                {{ item }}
              </div>
            </div>
          </v-scrollbar-native>
          <div>都有的</div>
          <v-scrollbar-native
            class="border border-primary-500 h-[200px] w-[200px]"
            scroll-x
          >
            <div class="h-max w-max">
              <v-image
                src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
                height="415px"
                width="600px"
              />
            </div>
          </v-scrollbar-native>
        </div>
      </div>
    </div>
    <v-form>
      <v-form-item label="操控">
        <div class="flex gap-2">
          <v-button @click="addContent">
            添加内容
          </v-button>
          <v-button @click="removeContent">
            删除内容
          </v-button>
        </div>
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const contentList = ref<string[]>([])
const addContent = () => {
  contentList.value.push(`第${contentList.value.length + 1}项`)
}
const removeContent = () => {
  contentList.value.pop()
}
for (let i = 0; i < 10; i += 1) {
  addContent()
}

const resizeHandle = () => {
  console.log("resizeHandle")
}
</script>
