<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <!-- <div class="break-all whitespace-pre-wrap">
        {{ `当前选择值: ${selectValue1 ?? ""}` }}
      </div> -->
      <v-fieldset label="单选" :type="type" :always-show="alwaysShow">
        <v-cascader
          v-model="selectValue1"
          v-model:object="selectObject1"
          :options="options"
          :disabled-option="(item) => item.item.id === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
          label-name="name"
          key-name="id"
          :check-strategy="checkStrategy"
          :check-strictly="checkStrictly"
        />
      </v-fieldset>
      <!-- <div class="break-all whitespace-pre-wrap">
        {{ `当前选择值: ${selectValue2 ?? ""}` }}
      </div> -->
      <v-fieldset label="单选 请求接口" :type="type" :always-show="alwaysShow">
        <v-cascader
          v-model="selectValue2"
          v-model:object="selectObject2"
          :options="remoteOptions"
          :disabled-option="(item) => item.item.id === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
          remote
          :loading="loading"
          label-name="name"
          key-name="id"
          :check-strategy="checkStrategy"
          :check-strictly="checkStrictly"
          @show="searchHandle('')"
          @search="searchHandle"
        />
      </v-fieldset>
      <div class="mt-5">
        多选
      </div>
      <!-- <div class="break-all whitespace-pre-wrap">
        {{ `当前选择值: ${selectValue3 ?? ""}` }}
      </div> -->
      <v-fieldset label="多选" :type="type" :always-show="alwaysShow">
        <v-cascader-multiple
          v-model="selectValue3"
          v-model:object="selectObject3"
          :options="options"
          :disabled-option="(item) => item.item.id === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
          label-name="name"
          key-name="id"
          :check-strategy="checkStrategy"
          :check-strictly="checkStrictly"
        />
      </v-fieldset>
      <!-- <div class="break-all whitespace-pre-wrap">
        {{ `当前选择值: ${selectValue4 ?? ""}` }}
      </div> -->
      <v-fieldset label="多选 请求接口" :type="type" :always-show="alwaysShow">
        <v-cascader-multiple
          v-model="selectValue4"
          v-model:object="selectObject4"
          :options="remoteOptions"
          :disabled-option="(item) => item.item.id === disabledValue"
          :clearable="clearable"
          :click-to-unselect="clickToUnselect"
          :close-after-select="closeAfterSelect"
          label-name="name"
          key-name="id"
          :check-strategy="checkStrategy"
          :check-strictly="checkStrictly"
          remote
          :loading="loading"
          @show="searchHandle('')"
          @search="searchHandle"
        />
      </v-fieldset>
    </div>
    <v-form>
      <v-form-item label="占位" fieldset="outline">
        <v-input v-model="placeholder" />
      </v-form-item>
      <v-form-item label="禁用的选项" fieldset="outline">
        <v-input v-model="disabledValue" />
      </v-form-item>
      <v-form-item label="选择策略">
        <v-radio-button v-model="checkStrategy" value="all">
          所有节点
        </v-radio-button>
        <v-radio-button v-model="checkStrategy" value="parent">
          优先父节点
        </v-radio-button>
        <v-radio-button v-model="checkStrategy" value="child">
          仅子节点
        </v-radio-button>
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
        <v-form-item label="能否选择父级">
          <v-checkbox v-model="checkStrictly" />
        </v-form-item>
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
import region from "../region"

definePageMeta({ layout: "demo" })

interface RegionItem {
  id: string
  name: string
  children: RegionItem[] | null
}

const selectValue1 = ref()
const selectValue2 = ref()
const selectValue3 = ref()
const selectValue4 = ref()
const selectObject1 = ref()
const selectObject2 = ref()
const selectObject3 = ref()
const selectObject4 = ref()

const options = region as RegionItem[]
const remoteOptions = ref<RegionItem[]>([])
const loading = ref(false)
const searchHandle = async (keyword: string) => {
  loading.value = true
  $message(`假设搜索: ${keyword}`)
  await new Promise((resolve) => window.setTimeout(resolve, 1000))
  remoteOptions.value = [...options]
  loading.value = false
}

const label = ref("选择框")
const placeholder = ref("请选择")

const type = ref<"outline" | "underline" | "none">("outline")

const disabledValue = ref("4")
const clickToUnselect = ref(false)
const closeAfterSelect = ref(true)

const checkStrategy = ref<"all" | "parent" | "child">("all")
const checkStrictly = ref(true)

const disabled = ref(false)
const clearable = ref(true)
const alwaysShow = ref(false)
</script>
