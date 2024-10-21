import classMerge from "../../utils/class-merge"

import type { DeepPartial } from "../../types/build"

export const scrollbarBar = {
  /** 水平的 */
  horizontal: {
    track: classMerge(
      "absolute z-50 bottom-0 left-2 right-2 h-2 pointer-events-none",
      "flex flex-row items-end transition-opacity opacity-[--scrollbar-opacity]"
    ),
    active: "opacity-100",
    thumb: classMerge(
      "h-full rounded bg-natural-300 dark:bg-natural-700 pointer-events-auto select-none transition-[width]",
      "opacity-75 hover:opacity-100 active:opacity-75",
      "cursor-grab active:cursor-grabbing"
    ),
    thumbActive: ""
  },
  /** 垂直的 */
  vertical: {
    track: classMerge(
      "absolute z-50 top-2 bottom-2 right-0 w-2 pointer-events-none",
      "flex flex-col items-end transition-opacity opacity-[--scrollbar-opacity]"
    ),
    active: "opacity-100",
    thumb: classMerge(
      "w-full rounded bg-natural-300 dark:bg-natural-700 pointer-events-auto select-none transition-[height]",
      "opacity-75 hover:opacity-100 active:opacity-75",
      "cursor-grab active:cursor-grabbing"
    ),
    thumbActive: ""
  }
}

export const scrollbarNative = {
  container: "relative v-native-scrollbar",
  scrollXOnly: "overflow-x-auto overflow-y-hidden",
  scrollYOnly: "overflow-y-auto overflow-x-hidden",
  scrollBoth: "overflow-scroll"
}

export const scrollbar = {
  container: classMerge(
    "relative overflow-hidden flex flex-col items-stretch",
    "[--scrollbar-opacity:0] hover:[--scrollbar-opacity:100]"
  ),
  content: "flex-1 v-scrollbar-none",
  view: "",
  scrollXOnly: {
    container: "py-3",
    outset: "box-content -my-3",
    content: "overflow-x-scroll overflow-y-hidden",
    view: "w-fit min-w-full h-full"
  },
  scrollYOnly: {
    container: "px-3",
    outset: "box-content -mx-3",
    content: "overflow-y-scroll overflow-x-hidden",
    view: "h-fit min-h-full w-full"
  },
  scrollBoth: {
    container: "p-3",
    outset: "box-content -m-3",
    content: "overflow-scroll",
    view: "h-fit w-fit min-h-full min-w-full"
  },
  horizontal: {} as DeepPartial<(typeof scrollbarBar)["horizontal"]>,
  vertical: {} as DeepPartial<(typeof scrollbarBar)["vertical"]>
}
