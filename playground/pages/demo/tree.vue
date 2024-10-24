<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 gap-1"
    >
      {{ `已选: ${treeSelectedList.length}` }}
      <v-tree
        v-loading="loading"
        :selected-list="selectedAble ? treeSelectedList : undefined"
        loading-text="加载中..."
        class="h-[500px]"
        :data="treeData"
        key-name="id"
        label-name="name"
        children-name="children"
        :draggable="draggable"
        :check-strategy="checkStrategy"
        :maxlevel="maxlevel"
        @drop="TreeDragObjectHandle"
        @update:selected-list="($event) => (treeSelectedList = $event)"
      >
        <template v-if="true" #default="{ object }">
          {{ object.item.name }}
          <v-button v-if="showButton1" size="sm" class="ml-2">
            {{ object.item.shortName }}
          </v-button>
        </template>
        <template v-if="showButton2" #append>
          <v-button
            size="sm"
            class="ml-auto sticky z-5 right-0"
            type="plain"
            :shadow="false"
            icon="mdi:dots-horizontal"
          />
        </template>
      </v-tree>
    </div>
    <v-form>
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
      <v-form-item label="最高级" fieldset="outline">
        <v-input-number
          v-model="maxlevel"
          :min="0"
          :max="3"
          :precision="0"
        />
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="是否可以选择">
          <v-checkbox v-model="selectedAble" />
        </v-form-item>
        <v-form-item label="能否拖拽">
          <v-checkbox v-model="draggable" />
        </v-form-item>
        <v-form-item label="显示按钮1">
          <v-checkbox v-model="showButton1" />
        </v-form-item>
        <v-form-item label="显示按钮2">
          <v-checkbox v-model="showButton2" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import region from "../region"
import type { TreeItem, TreeDragObject, DragPosition } from "#ui"

definePageMeta({ layout: "demo" })

const treeData = ref<TreeItem[]>([...region])
const treeSelectedList = ref<TreeItem[]>([])

const checkStrategy = ref<"all" | "parent" | "child">("parent")
const maxlevel = ref(0)

// const droppable = (
//   dragging: TreeDragObject<TreeItem>,
//   target: TreeDragObject<TreeItem>,
//   position: DragPosition
// ) => {
//   if (position === "inner") return false
//   return dragging.siblings === target.siblings
// }
const TreeDragObjectHandle = (
  dragging: TreeDragObject<TreeItem>,
  target: TreeDragObject<TreeItem>,
  position: DragPosition
) => {
  // 不给将父级放进子级
  if (target.path.includes(dragging.item)) return
  if (position === "before") {
    dragging.siblings.splice(dragging.index, 1)
    target.siblings.splice(target.index, 0, dragging.item)
  } else if (position === "inner") {
    dragging.siblings.splice(dragging.index, 1)
    if (target.item.children) {
      target.item.children.push(dragging.item)
    } else {
      target.item.children = [dragging.item]
    }
  } else {
    dragging.siblings.splice(dragging.index, 1)
    target.siblings.splice(target.index + 1, 0, dragging.item)
  }
}

const selectedAble = ref(true)
const draggable = ref(false)
const loading = ref(false)
const showButton1 = ref(false)
const showButton2 = ref(false)
</script>
