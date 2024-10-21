<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    <div>
      {{ `当前页: ${tabValue ?? ""}` }}
    </div>
    <v-tabs v-model="tabValue" type="p">
      <template v-for="(tab, index) in tabs" :key="tab.name">
        <v-tabs-item :value="tab.name">
          <div class="">
            {{ `页面，${index}` }}
          </div>
          <v-fieldset>
            <v-input placeholder="测试输入框" />
          </v-fieldset>
        </v-tabs-item>
      </template>
    </v-tabs>
    <div class="flex gap-2 mt-10">
      <v-button @click="addTab">
        添加标签
      </v-button>
      <v-button @click="tabs.pop()">
        删除标签
      </v-button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const tabs = ref<{ name: string }[]>([
  { name: "0" },
  { name: "1" },
  { name: "2" }
])
const tabValue = ref<string>("0")
const addTab = () => {
  tabs.value.push({ name: tabs.value.length.toString() })
}
</script>
