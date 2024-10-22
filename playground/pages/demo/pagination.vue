<template>
  <div class="flex">
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <div class="mb-5">
        {{ displayContent }}
      </div>
      <v-pagination
        v-model:page-index="pageIndex"
        v-model:page-size="pageSize"
        :total="total"
        :show-page-size="showPageSize"
        :show-total="showTotal"
      />
    </div>
    <v-form>
      <v-form-item label="项总数" fieldset="outline">
        <v-input-number v-model="total" />
      </v-form-item>
      <div class="p-3 flex">
        <v-form-item label="显示总数">
          <v-checkbox v-model="showTotal" />
        </v-form-item>
        <v-form-item label="显示页大小">
          <v-checkbox v-model="showPageSize" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const pageIndex = ref(1)
const pageSize = ref(10)
const total = ref(1000)

const showPageSize = ref(true)
const showTotal = ref(true)

const displayContent = computed(() => {
  const from = (pageIndex.value - 1) * pageSize.value + 1
  const to = Math.min(pageIndex.value * pageSize.value, total.value)
  return `显示项: ${from}项 ~ ${to}项`
})
</script>
