import classMerge from "../../utils/class-merge"

export const pagination = {
  container: "mx-auto flex items-center gap-1 w-fit max-w-[min(100%,600px)]",
  button: "px-1",
  index: "font-medium text-sm px-1 shrink-0",
  content:
    "relative flex-1 overflow-auto v-scrollbar-none flex items-center gap-1",
  total: "font-medium text-sm text-natural-500 dark:text-natural-400",
  pagesize: "font-medium text-sm",
  jumper: "font-medium text-sm w-[60px]",
  jumperInput: classMerge(
    "w-[60px] px-3 h-[32px] rounded bg-natural-400/20",
    "font-medium text-sm text-natural-500 dark:text-natural-400"
  )
}
