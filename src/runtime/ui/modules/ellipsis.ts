import classMerge from "../../utils/class-merge"

export const ellipsis = {
  popper: classMerge(
    "fixed p-2 rounded-md overflow-y-auto max-h-[300px] whitespace-pre-wrap",
    "shadow border border-natural-300 bg-natural-50 dark:border-natural-600 dark:bg-natural-900",
    "v-native-scrollbar"
  )
}
