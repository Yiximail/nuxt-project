<template>
  <div>
    <v-form v-loading="loading" :size="size" loading-text="加载中...">
      <v-form-item label="表单头部" :rule="successRule" :required="required">
        <template #info>
          表单头部信息
        </template>
        <v-uploader-image
          v-model="uploadList"
          :upload="upload"
          :maxlength="3"
        />
      </v-form-item>
      <v-form-item label="form uploader" :rule="warningRule" :required="required">
        <v-uploader v-model="uploadList" :upload="upload" :maxlength="3" />
      </v-form-item>
      <v-form-item label="form switch" :required="required" :value="switchValue">
        <v-switch v-model="switchValue">
          switchValue
        </v-switch>
      </v-form-item>
      <v-form-item label="form checkbox" :required="required" :value="checkboxValue">
        <v-checkbox v-model="checkboxValue">
          checkboxValue
        </v-checkbox>
      </v-form-item>
      <v-form-item label="form checkbox group" :required="required">
        <v-checkbox-group v-model="checkboxGroupValue" value="a">
          a
        </v-checkbox-group>
        <v-checkbox-group v-model="checkboxGroupValue" value="b">
          b
        </v-checkbox-group>
        <v-checkbox-group v-model="checkboxGroupValue" value="c">
          c
        </v-checkbox-group>
      </v-form-item>
      <v-form-item label="form radio" :required="required" :value="radioValue">
        <v-radio v-model="radioValue" value="a">
          a
        </v-radio>
        <v-radio v-model="radioValue" value="b">
          b
        </v-radio>
        <v-radio v-model="radioValue" value="c">
          c
        </v-radio>
      </v-form-item>
      <v-form-item label="form radio button" :required="required" :value="radioValue">
        <v-radio-button v-model="radioValue" value="a">
          a
        </v-radio-button>
        <v-radio-button v-model="radioValue" value="b">
          b
        </v-radio-button>
        <v-radio-button v-model="radioValue" value="c">
          c
        </v-radio-button>
      </v-form-item>
      <v-form-item
        label="form input"
        :fieldset="fieldsetType"
        :required="required"
        :regexp="/^\d+$/"
      >
        <template #info>
          {{ testLongText }}
        </template>
        <v-input v-model="inputValue" placeholder="input" :maxlength="200" />
      </v-form-item>
      <v-form-item label="form number" :fieldset="fieldsetType" :required="required">
        <v-input-number v-model="numberValue" placeholder="number" :max="500" />
      </v-form-item>
      <v-form-item
        label="form textarea"
        :fieldset="fieldsetType"
        :required="required"
        :rule="textareaRule"
      >
        <v-textarea v-model="textareaValue" :maxlength="200" />
      </v-form-item>
      <v-form-item label="form quill viewer" :fieldset="fieldsetType">
        <v-quill-viewer :html="quillText" />
      </v-form-item>
      {{ quillText }}
      <v-form-item
        label="form quill"
        :fieldset="fieldsetType"
        :required="required"
        :regexp="/^\D+$/"
      >
        <v-quill
          v-model="quillText"
          :image-process="imageProcess"
          :maxlength="200"
        />
      </v-form-item>
      <v-form-item label="form select" :fieldset="fieldsetType" :required="required">
        <v-select
          v-model="selectValue"
          :options="options"
          :style="{ width: '120px', flex: 'unset' }"
          :disabled-option="(item) => item.value === '4'"
        />
        <v-divider type="vertical" />
        <v-select
          v-model:object="selectObjValue"
          :options="options"
          :disabled-option="(item) => item.value === '4'"
        />
      </v-form-item>
      <v-form-item
        label="form select multiple"
        :fieldset="fieldsetType"
        :required="required"
      >
        <v-select-multiple
          v-model="multipleSelectValue"
          :options="options"
          :disabled-option="(item) => item.value === '4'"
        />
        <v-divider type="vertical" />
        <v-select-multiple
          v-model:object="multipleSelectObjValue"
          :options="options"
          :disabled-option="(item) => item.value === '4'"
        />
      </v-form-item>
      <v-form-item label="form cascader" :fieldset="fieldsetType" :required="required">
        <v-cascader
          v-model="cascaderValue"
          :options="regionOptions"
          label-name="name"
          key-name="id"
          check-strictly
          :maxlevel="2"
        />
        <v-divider type="vertical" />
        <v-cascader
          v-model:object="cascaderObjValue"
          :options="regionOptions"
          label-name="name"
          key-name="id"
          :maxlevel="2"
        />
        <v-divider type="vertical" />
        <v-cascader
          v-model:object="cascaderObjValue"
          :options="remoteRegionOptions"
          label-name="name"
          key-name="id"
          :loading="cascaderLoading"
          remote
          @show="searchHandle('')"
          @search="searchHandle"
        />
      </v-form-item>
      <v-form-item
        label="form cascader multiple"
        :fieldset="fieldsetType"
        :required="required"
      >
        <v-cascader-multiple
          v-model="multipleCascaderValue"
          :options="regionOptions"
          label-name="name"
          key-name="id"
          check-strictly
        />
        <v-divider type="vertical" />
        <v-cascader-multiple
          v-model:object="multipleCascaderObjValue"
          :options="regionOptions"
          label-name="name"
          key-name="id"
        />
      </v-form-item>
      <v-form-item label="form date" :fieldset="fieldsetType" :required="required">
        <div class="pl-2">
          test
        </div>
        <v-input-datetime v-model="dateValue" type="date" />
      </v-form-item>
      <v-form-item label="form time" :fieldset="fieldsetType" :required="required">
        <v-input-datetime v-model="timeValue" type="time" />
      </v-form-item>
      <v-form-item label="form datetime" :fieldset="fieldsetType" :required="required">
        <v-input-datetime v-model="dateTime" type="datetime" />
      </v-form-item>
      <v-form-item
        label="form datetime range"
        :fieldset="fieldsetType"
        :required="required"
      >
        <v-input-datetime-range
          v-model:start="startDateTime"
          v-model:end="endDateTime"
        />
      </v-form-item>
      <v-sticky class="bottom-2 mt-3">
        <v-form-footer #default="{ validate, clearValidate }">
          <v-button @click="validate">
            确定
          </v-button>
          <v-button @click="clearValidate">
            清除校验
          </v-button>
          <v-checkbox v-model="required">
            全部必填
          </v-checkbox>
          <div class="flex">
            <v-radio-button
              v-for="value in ['xl', 'lg', 'md', 'sm', 'xs']"
              :key="value"
              v-model="size"
              :value="value"
            >
              {{ value }}
            </v-radio-button>
          </div>
        </v-form-footer>
      </v-sticky>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import region from "../region"
import type { UploaderItem, UploadFunction, SelectOption } from "#ui"

definePageMeta({ layout: "demo" })

const loading = ref(false)
const testLongText = `<div>
  When controlling the flow of text, using the CSS property
  <span class="inline">display: inline</span>
  will cause the text inside the element to wrap normally.

  While using the property <span class="inline-block">display: inline-block</span>
  will wrap the element to prevent the text inside from extending beyond its parent.

  Lastly, using the property <span class="block">display: block</span>
  will put the element on its own line and fill its parent.
</div>`

const uploadList = ref<UploaderItem[]>([])
const upload: UploadFunction = async (file, cb) => {
  let percentage = 0
  for (let i = 0; i < 50; i++) {
    await new Promise((resolve) => window.setTimeout(resolve, 50))
    percentage += 2
    cb(percentage)
  }
  return { status: "success", data: guid() }
}

interface RegionItem {
  id: string
  name: string
  children: RegionItem[] | null
}

const successRule = () => {
  return { status: "success", message: "这个一直是成功" }
}
const warningRule = () => {
  return { status: "warning", message: "这个一直是警告" }
}

const regionOptions = region as RegionItem[]
const remoteRegionOptions = ref<RegionItem[]>([])
const cascaderLoading = ref(false)
const searchHandle = async (keyword: string) => {
  cascaderLoading.value = true
  $message(`假设搜索: ${keyword}`)
  await new Promise((resolve) => window.setTimeout(resolve, 1000))
  remoteRegionOptions.value = [...regionOptions]
  cascaderLoading.value = false
}

const textareaRule = () => {
  const lines = textareaValue.value.split("\n").length
  if (lines > 5) return "最多5行"
  if (lines > 4) return { status: "error", message: "不能超过4行" } as const
}
const quillText = ref(
  "<p>121231232133123123213213213213213213213233<strong>4</strong>5</p>"
)
const imageProcess = async (file: File) => {
  console.log("upload:", file)
  await new Promise((resolve) => window.setTimeout(resolve, 2000))
  return "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
}

const switchValue = ref(false)
const radioValue = ref()
const checkboxValue = ref(false)
const checkboxGroupValue = ref([])

const inputValue = ref<string>("abcd")
const textareaValue = ref("1\n2\n3\n4\n5\n6")

const fieldsetType = ref<"underline" | "outline">("outline")

const numberValue = ref(2.6)

const dateTime = ref<string>()
const startDateTime = ref<string>()
const endDateTime = ref<string>()

const selectValue = ref<string>()
const selectObjValue = ref<SelectOption>()
const multipleSelectValue = ref<string[]>()
const multipleSelectObjValue = ref<SelectOption[]>()

const cascaderValue = ref<string>()
const cascaderObjValue = ref<RegionItem | undefined>()
const multipleCascaderValue = ref<string[]>()
const multipleCascaderObjValue = ref<RegionItem[]>()

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

const dateValue = ref<string>("")
const timeValue = ref<string>("")

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const required = ref(false)
</script>
