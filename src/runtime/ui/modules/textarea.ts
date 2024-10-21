import classMerge from "../../utils/class-merge"

export const textarea = {
  container: classMerge(
    "transition cursor-text",
    "data-[is-disabled=true]:cursor-not-allowed"
  ),
  reference:
    "absolute invisible pointer-events-none whitespace-pre-wrap break-words break-all",
  textarea: classMerge(
    "v-native-scrollbar overflow-y-auto",
    "focus-visible:outline-none bg-transparent",
    "block w-full disabled:cursor-not-allowed disabled:text-natural-400 dark:disabled:text-natural-500"
  ),
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  unresizeable: "resize-none",
  count: classMerge(
    "text-[0.8em] font-medium text-right pointer-events-none",
    "text-natural-400 dark:text-natural-500"
  )
}
