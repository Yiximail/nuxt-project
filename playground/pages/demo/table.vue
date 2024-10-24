<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 gap-1"
    >
      <v-table
        ref="tableRef"
        v-model:sort-key="sortKey"
        v-model:sort-order="sortOrder"
        v-model:control-list="controlList"
        :loading="tableLoading"
        :selected-list="selectMode === 'list' ? selectedList : undefined"
        :selected-info="selectMode === 'info' ? selectedInfo : undefined"
        :data="tableData"
        :total="total"
        class="h-[500px]"
        select-key="data3"
        :draggable="draggable"
        @drop="dropHandle"
        @update:selected-list="($event) => (selectedList = $event)"
        @update:selected-info="($event) => (selectedInfo = $event)"
      >
        <v-table-column
          label="测试"
          prop="name"
          width="200px"
          fixed="left"
        />
        <v-table-column label="日期" prop="age" sort-key="age">
          <template #head>
            <v-table-fieldset>
              <v-input-datetime-range
                v-model:start="startValue"
                v-model:end="endValue"
                class="w-[250px]"
                :placeholder="placeholder"
                :disabled="disabled"
                :clearable="clearable"
                :type="inputType"
              />
            </v-table-fieldset>
          </template>
        </v-table-column>
        <v-table-column label="金额" prop="cash" sort-key="cash">
          <template #head>
            <v-table-fieldset>
              <v-input v-model="cash" class="w-[120px]" placeholder="cash" />
              <v-icon icon="mdi:magnify" />
            </v-table-fieldset>
          </template>
        </v-table-column>
        <v-table-column label="地址" prop="address">
          <template #head>
            <v-table-fieldset label="address">
              <v-select
                v-model="address"
                class="w-[120px]"
                placeholder="address"
                :options="options"
                :popper="{ strategy: 'fixed' }"
              />
            </v-table-fieldset>
          </template>
        </v-table-column>
        <v-table-column label="data1" prop="data1" />
        <v-table-column label="data2" prop="data2" />
        <v-table-column label="data3" prop="data3" fixed="right">
          <v-button size="sm" type="text" :shadow="false">
            small
          </v-button>
        </v-table-column>
        <template v-if="false" #hover="{ row }">
          <v-button size="sm">
            {{ row.name.slice(0, 3) }}
          </v-button>
          <v-button size="sm">
            按钮2
          </v-button>
        </template>
      </v-table>
      <v-pagination
        v-model:page-size="pageSize"
        v-model:page-index="pageIndex"
        :total="total"
        @change="refreshTable"
      />
    </div>
    <v-form>
      <v-form-item label="滚动">
        <v-checkbox v-model="isScrollToTop">
          切换页面后滚动到顶部
        </v-checkbox>
        <v-button @click="scrollToTop">
          滚动到顶部
        </v-button>
      </v-form-item>
      <v-form-item label="选择类型">
        <v-radio-button v-model="selectMode" value="info" label="多页选择" />
        <v-radio-button v-model="selectMode" value="list" label="单页选择" />
        <v-radio-button v-model="selectMode" value="none" label="不能选择" />
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="能否拖拽">
          <v-checkbox v-model="draggable" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type {
  TableSelectedGenericInfo,
  TableColumnControl,
  TableDragObject,
  DragPosition,
  SelectOption,
  ComponentInstance
} from "#ui"
import { VButton, VTable } from "#components"

definePageMeta({ layout: "demo" })

interface TableDataItem {
  name: string
  age: number
  address: string
  cash: number
  data1: string
  data2: string
  data3: string
}
const selectedList = ref<TableDataItem[]>([])

const tableRef = ref<ComponentInstance<typeof VTable<TableDataItem>>>()

const selectMode = ref<string>("list")

const selectedInfo = ref<TableSelectedGenericInfo<TableDataItem>>({
  isSelectAll: false,
  includeList: [],
  excludeList: []
})
const tableLoading = ref(false)
const tableData = ref<TableDataItem[]>([])

const cash = ref("")
const address = ref<string>()
const sortKey = ref()
const sortOrder = ref<"asc" | "desc">("desc")

const controlList = ref<TableColumnControl[]>()
onMounted(() => {
  controlList.value = JSON.parse(
    window.localStorage.getItem("controlList") || "[]"
  )
  watch(controlList, (val) => {
    window.localStorage.setItem("controlList", JSON.stringify(val))
  })
})

const options = ref<SelectOption[]>([
  { value: "1", label: "选项1" },
  { value: "2", label: "选项2" },
  {
    value: "3",
    label: "选项3"
  },
  { value: "4", label: "选项4" },
  { value: "5", label: "选项5" },
  { value: "6", label: "选项6" },
  { value: "7", label: "选项7" },
  { value: "8", label: "选项8" },
  { value: "9", label: "选项9" },
  { value: "10", label: "选项10" }
])

const dropHandle = (
  dragging: TableDragObject<TableDataItem>,
  target: TableDragObject<TableDataItem>,
  position: DragPosition
) => {
  if (dragging.index !== -1 && target.index !== -1) {
    if (position === "before") {
      const item = tableData.value[dragging.index]
      tableData.value.splice(dragging.index, 1)
      tableData.value.splice(target.index, 0, item)
    } else if (position === "inner") {
      const item = tableData.value[dragging.index]
      tableData.value[dragging.index] = tableData.value[target.index]
      tableData.value[target.index] = item
    } else {
      const item = tableData.value[dragging.index]
      tableData.value.splice(dragging.index, 1)
      tableData.value.splice(target.index + 1, 0, item)
    }
  }
}

const refreshTable = async () => {
  tableLoading.value = true
  await new Promise((resolve) => window.setTimeout(resolve, 500))
  const list = [] as typeof tableData.value
  for (let i = 0; i < pageSize.value; i++) {
    list.push({
      name: guid(),
      age: Math.random(),
      address: guid(),
      cash: Math.random(),
      data1: guid(),
      data2: guid(),
      data3: guid()
    })
  }
  tableData.value = list
  tableLoading.value = false
  if (isScrollToTop.value) scrollToTop()
}
const pageSize = ref(20)
const pageIndex = ref(1)
const total = ref(1000)

onMounted(() => {
  refreshTable()
})

const startValue = ref<string>()
const endValue = ref<string>()
const draggable = ref(false)
const placeholder = ref("请选择")
const inputType = ref<"datetime" | "date" | "time">("date")

const disabled = ref(false)
const clearable = ref(true)
const isScrollToTop = ref(true)
const scrollToTop = () => {
  tableRef.value?.scrollTo({ top: 0 })
}
</script>
