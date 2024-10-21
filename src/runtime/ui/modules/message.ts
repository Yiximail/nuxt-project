import classMerge from "../../utils/class-merge"

import type { IconComponent } from "../../types/build"

export const messageContainer = {
  container: classMerge(
    "relative fixed top-6 left-[calc(50%-var(--scrollbar-right-width,0px)/2)]",
    "-translate-x-1/2 w-[500px] z-[1000]"
  )
}

export const message = {
  container: classMerge(
    "relative mb-2 flex items-center gap-2 py-1 px-2 min-h-8 rounded-md w-full",
    "bg-{color}-500 dark:bg-{color}-600 text-white shadow-md",
    "[--ripple-color:theme(colors.{color}.700/0.5)]"
  ),
  loading: {
    name: "mingcute:loading-fill",
    class: "animate-spin"
  } as IconComponent,
  icon: "h-5 w-5",
  wrapper: "flex-1 min-w-0 min-h-0 flex flex-col",
  title: "font-medium truncate",
  message: "text-sm font-medium",
  close: "shrink-0 inline-flex self-center cursor-pointer",
  progress: "absolute h-[2px] left-2 right-2 bottom-[1.5px]",
  progressBar: "bg-natural-100/60"
}
