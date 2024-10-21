import classMerge from "../../utils/class-merge"

export const selectMultiple = {
  container:
    "flex items-center gap-1 data-[is-disabled=true]:cursor-not-allowed",
  size: {
    xl: "text-xl min-h-7",
    lg: "text-lg min-h-7",
    md: "text-base min-h-6",
    sm: "text-sm min-h-5",
    xs: "text-xs min-h-4"
  },
  content: "flex-1 min-w-0 overflow-y-auto v-native-scrollbar",
  placeholder: "text-natural-400/75 pointer-events-none select-none",
  tagList: "flex flex-wrap gap-1",
  clearButton: "",
  arrow: {
    base: "origin-center rotate-0 disabled:cursor-not-allowed",
    actived: "rotate-180"
  }
}

export const selectPopperItem = {
  container: "relative flex items-center gap-1 p-1 select-none",
  selectabled: "cursor-pointer",
  enabled: "hover:bg-natural-200/50 dark:hover:bg-natural-800/50",
  disabled: "cursor-not-allowed opacity-60",
  prepend:
    "relative z-[1] flex items-center justify-center h-6 min-w-4 text-natural-500 dark:text-natural-300",
  label: "relative z-[1] leading-6 flex-1 truncate",
  highlight: "font-medium text-primary-500 dark:text-primary-400",
  append:
    "relative z-[1] flex items-center justify-center h-6 min-w-4 text-natural-500 dark:text-natural-300",
  selected: {
    container: "",
    prepend: "text-primary-500 dark:text-primary-400",
    label: "font-medium text-primary-500 dark:text-primary-400",
    append: "text-primary-500 dark:text-primary-400"
  }
}

export const selectPopperSearch = {
  container: "flex-1 min-w-0 flex items-center gap-1 px-1",
  icon: "flex items-center justify-center h-6 min-w-4 text-natural-500 dark:text-natural-300",
  input: "flex-1 min-w-0 text-sm py-2 focus-visible:outline-none bg-transparent"
}

export const selectPopper = {
  container: "max-h-[260px] min-w-[200px] flex flex-col items-stretch",
  options: "flex-1"
}

export const select = {
  container:
    "flex items-center gap-1 cursor-pointer data-[is-disabled=true]:cursor-not-allowed",
  size: {
    xl: "text-xl min-h-7",
    lg: "text-lg min-h-7",
    md: "text-base min-h-6",
    sm: "text-sm min-h-5",
    xs: "text-xs min-h-4"
  },
  content: classMerge(
    "focus-visible:outline-none flex-1 min-w-0 text-left",
    "disabled:cursor-not-allowed"
  ),
  placeholder: "text-natural-400/75 pointer-events-none select-none",
  clearButton: "",
  arrow: {
    base: "origin-center rotate-0 disabled:cursor-not-allowed",
    actived: "rotate-180"
  }
}
