import classMerge from "../../utils/class-merge"

import type { IconComponent } from "../../types/build"

export const imagePreview = {
  mask: "flex items-center justify-center",
  image: "cursor-grab active:cursor-grabbing",
  error: "h-fit w-fit p-1 flex items-center justify-center",
  errorIcon: {
    name: "mdi:image-remove-outline",
    class: "h-12 w-12 text-white"
  } as IconComponent,
  loading:
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white",
  loadingIcon: {
    name: "mingcute:loading-fill",
    class: "animate-spin h-10 w-10"
  } as IconComponent,
  controller: classMerge(
    "dark absolute bottom-10 z-[1] rounded-full text-white bg-natural-900",
    "px-3 flex gap-1"
  )
}

export const image = {
  base: "",
  block: {
    image: "block",
    error: "h-fit w-fit flex items-center justify-center",
    empty: "h-fit w-fit flex items-center justify-center"
  },
  inline: {
    image: "inline",
    error: "h-fit w-fit inline-flex items-center justify-center",
    empty: "h-fit w-fit inline-flex items-center justify-center"
  },
  previewable: "cursor-pointer",
  error: "p-1",
  errorIcon: {
    name: "mdi:image-remove-outline",
    class: "h-[2em] w-[2em] text-natural-500 dark:text-natural-300"
  } as IconComponent,
  empty: "p-1",
  emptyIcon: {
    name: "mdi:image-outline",
    class: "h-[2em] w-[2em] text-natural-500 dark:text-natural-300"
  } as IconComponent
}
