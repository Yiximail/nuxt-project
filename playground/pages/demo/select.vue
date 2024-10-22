<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <!-- <div class="whitespace-pre-wrap">
        {{
          `当前选择值: ${selectValue1 ?? ""}    对象: ${JSON.stringify(selectObject1)}`
        }}
      </div> -->
      <v-fieldset
        label="单选"
        :type="type"
        :size="size"
        :always-show="alwaysShow"
      >
        <v-select
          v-model="selectValue1"
          v-model:object="selectObject1"
          :options="options"
          :disabled-option="(item) => item.value === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
        />
      </v-fieldset>
      <!-- <div class="whitespace-pre-wrap">
        {{
          `当前选择值: ${selectValue2 ?? ""}    对象: ${JSON.stringify(selectObject2)}`
        }}
      </div> -->
      <v-fieldset
        label="单选 请求接口"
        :type="type"
        :size="size"
        :always-show="alwaysShow"
      >
        <v-select
          v-model="selectValue2"
          v-model:object="selectObject2"
          :options="remoteOptions"
          :disabled-option="(item) => item.value === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
          remote
          :loading="loading"
          @show="searchHandle('')"
          @search="searchHandle"
        />
      </v-fieldset>
      <div class="mt-5">
        多选
      </div>
      <!-- <div class="whitespace-pre-wrap">
        {{
          `当前选择值: ${selectValue3 ?? ""}    对象: ${JSON.stringify(selectObject3)}`
        }}
      </div> -->
      <v-fieldset
        label="多选"
        :type="type"
        :size="size"
        :always-show="alwaysShow"
      >
        <v-select-multiple
          v-model="selectValue3"
          v-model:object="selectObject3"
          :options="options"
          :disabled-option="(item) => item.value === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
        />
      </v-fieldset>
      <!-- <div class="whitespace-pre-wrap">
        {{
          `当前选择值: ${selectValue4 ?? ""}    对象: ${JSON.stringify(selectObject4)}`
        }}
      </div> -->
      <v-fieldset
        label="多选 请求接口"
        :type="type"
        :size="size"
        :always-show="alwaysShow"
      >
        <v-select-multiple
          v-model="selectValue4"
          v-model:object="selectObject4"
          :options="remoteOptions"
          :disabled-option="(item) => item.value === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
          remote
          :loading="loading"
          @show="searchHandle('')"
          @search="searchHandle"
        />
      </v-fieldset>
    </div>
    <v-form>
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
      <v-form-item label="占位" fieldset="outline">
        <v-input v-model="placeholder" />
      </v-form-item>
      <v-form-item label="禁用的选项" fieldset="outline">
        <v-input v-model="disabledValue" />
      </v-form-item>
      <v-form-item label="选择框标签" fieldset="outline">
        <v-input v-model="label" />
      </v-form-item>
      <v-form-item label="选择框类型">
        <v-radio-button v-model="type" value="outline">
          外边框
        </v-radio-button>
        <v-radio-button v-model="type" value="underline">
          下划线
        </v-radio-button>
        <v-radio-button v-model="type" value="none">
          无
        </v-radio-button>
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="选择后关闭">
          <v-checkbox v-model="closeAfterSelect" />
        </v-form-item>
        <v-form-item label="(单选)点击已选取消选择">
          <v-checkbox v-model="clickToUnselect" />
        </v-form-item>
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
        <v-form-item label="可清除">
          <v-checkbox v-model="clearable" />
        </v-form-item>
        <v-form-item label="一直显示">
          <v-checkbox v-model="alwaysShow" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from "#ui"

definePageMeta({ layout: "demo" })

const selectValue1 = ref()
const selectValue2 = ref()
const selectValue3 = ref()
const selectValue4 = ref()
const selectObject1 = ref()
const selectObject2 = ref()
const selectObject3 = ref()
const selectObject4 = ref()

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
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
const remoteOptions = ref<SelectOption[]>([])
const loading = ref(false)
const searchHandle = async (key: string) => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  remoteOptions.value = options.value.filter((item) => item.label.includes(key))
  loading.value = false
}

const label = ref("选择框")
const placeholder = ref("请选择")

const type = ref<"outline" | "underline" | "none">("outline")

const disabledValue = ref("4")
const clickToUnselect = ref(false)
const closeAfterSelect = ref(true)

const disabled = ref(false)
const clearable = ref(true)
const alwaysShow = ref(false)
</script>
