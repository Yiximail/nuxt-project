<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    <v-menu class="h-[500px]">
      <template #header="{ expanded }">
        <div class="h-6">
          <transition name="v-fade">
            <div v-if="expanded" class="text-center truncate">
              头部内容
            </div>
          </transition>
        </div>
      </template>
      <v-menu-item label="一级菜单" />
      <v-menu-item icon="mdi:ab-testing" label="一级菜单带图标" />
      <v-menu-item :actived="true" label="一级菜单激活" />
      <v-menu-item disabled label="一级菜单禁用" />
      <v-menu-item icon="mdi:ab-testing" label="一级菜单很长很长很长">
        <v-menu-item icon="mdi:ab-testing" label="二级菜单很长很长很长">
          <v-menu-item icon="mdi:ab-testing" label="三级菜单很长很长很长" />
        </v-menu-item>
      </v-menu-item>
      <v-menu-group label="分组1">
        <v-menu-item icon="mdi:ab-testing" label="一级菜单">
          <v-menu-item icon="mdi:ab-testing" label="二级菜单">
            <v-menu-item icon="mdi:ab-testing" label="三级菜单" />
            <v-menu-item label="三级菜单" />
          </v-menu-item>
          <v-menu-item label="二级菜单">
            <v-menu-item icon="mdi:ab-testing" label="三级菜单" />
            <v-menu-item label="三级菜单" />
          </v-menu-item>
        </v-menu-item>
        <v-menu-item label="一级菜单">
          <v-menu-item icon="mdi:ab-testing" label="二级菜单">
            <v-menu-item icon="mdi:ab-testing" label="三级菜单" />
            <v-menu-item label="三级菜单" />
          </v-menu-item>
          <v-menu-item label="二级菜单">
            <v-menu-item icon="mdi:ab-testing" label="三级菜单" />
            <v-menu-item label="三级菜单" />
          </v-menu-item>
        </v-menu-item>
      </v-menu-group>
      <template #footer="{ expanded }">
        <div class="h-6">
          <transition name="v-fade">
            <div v-if="expanded" class="text-center truncate">
              底部内容
            </div>
          </transition>
        </div>
      </template>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })
</script>
