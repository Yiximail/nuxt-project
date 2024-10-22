<template>
  <div class="flex">
    <v-menu class="sticky z-10 left-0 top-0 h-[100dvh] border-0 border-r">
      <template #header="{ expanded }">
        <div class="h-6">
          <transition name="v-fade">
            <div v-if="expanded" class="flex items-center justify-center">
              <v-radio-button
                :model-value="preference"
                size="sm"
                value="dark"
                @update:model-value="$colorMode.preference = $event"
              >
                Dark
              </v-radio-button>
              <v-radio-button
                :model-value="preference"
                size="sm"
                value="light"
                @update:model-value="$colorMode.preference = $event"
              >
                Light
              </v-radio-button>
            </div>
          </transition>
        </div>
      </template>
      <template #default>
        <v-menu-group label="基本组件">
          <v-menu-item to="/demo/link" label="链接" />
          <v-menu-item to="/demo/button" label="按钮" />
          <v-menu-item to="/demo/tag" label="文本标签" />
          <v-menu-item to="/demo/carousel" label="轮播组件" />
          <v-menu-item to="/demo/collapse" label="折叠面板" />
        </v-menu-group>

        <v-menu-group label="数据输入组件">
          <v-menu-item to="/demo/checkbox" label="复选框" />
          <v-menu-item to="/demo/radio" label="单选框" />
          <v-menu-item to="/demo/switch" label="开关" />
          <v-menu-item to="/demo/input" label="输入框" />
          <v-menu-item to="/demo/input-number" label="数字输入框" />
          <v-menu-item to="/demo/input-datetime" label="时间、日期输入框" />
          <v-menu-item to="/demo/textarea" label="多行文本" />
          <v-menu-item to="/demo/quill" label="富文本" />
          <v-menu-item to="/demo/select" label="选择框" />
          <v-menu-item to="/demo/cascader" label="级联选择框" />
          <v-menu-item to="/demo/uploader" label="文件上传" />
          <v-menu-item to="/demo/uploader-image" label="图片上传" />
          <v-menu-item to="/demo/form" label="表单" />
        </v-menu-group>

        <v-menu-group label="数据展示组件">
          <v-menu-item to="/demo/icon" label="图标" />
          <v-menu-item to="/demo/image" icon="mdi:image" label="图片" />
          <v-menu-item to="/demo/countdown" label="倒计时" />
          <v-menu-item to="/demo/progress" label="进度条" />
          <v-menu-item to="/demo/badge" label="徽标数" />
          <v-menu-item to="/demo/empty" label="空内容" />
          <v-menu-item to="/demo/loading" label="加载中" />
          <v-menu-item to="/demo/description" label="描述列表" />
          <v-menu-item to="/demo/table" label="表格" />
          <v-menu-item to="/demo/pagination" label="分页" />
          <v-menu-item to="/demo/tree" label="树" />
          <v-menu-item to="/demo/steps" label="步骤条" />
          <v-menu-item to="/demo/timeline" label="时间轴" />
        </v-menu-group>

        <v-menu-group label="布局">
          <v-menu-item to="/demo/menu" label="菜单" />
          <v-menu-item to="/demo/tabs" label="标签页" />
          <v-menu-item to="/demo/divider" label="分割线" />
          <v-menu-item to="/demo/scrollbar" label="滚动条" />
        </v-menu-group>

        <v-menu-group label="弹窗组件">
          <v-menu-item to="/demo/tooltip" label="文字气泡" />
          <v-menu-item
            to="/demo/dropdown"
            icon="mdi:form-dropdown"
            label="下拉菜单"
          />
          <v-menu-item to="/demo/ellipsis" label="文本省略" />
          <v-menu-item to="/demo/message" label="消息" />
          <v-menu-item to="/demo/dialog" label="对话框" />
          <v-menu-item to="/demo/notification" label="通知" />
          <v-menu-item to="/demo/popconfirm" label="气泡确认框" />
          <v-menu-item to="/demo/drawer" label="抽屉" />
          <v-menu-item to="/demo/modal" label="模态框" />
        </v-menu-group>
      </template>
    </v-menu>
    <div class="flex-1 min-w-0 p-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const preference = computed(() => {
  if (!mounted.value) return undefined
  return colorMode.value
})
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>
