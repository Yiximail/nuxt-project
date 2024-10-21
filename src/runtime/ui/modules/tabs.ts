import classMerge from "../../utils/class-merge"

export const tabsItem = {
  container: classMerge(
    "min-w-[100px] h-10 px-2 text-center leading-10 cursor-pointer select-none",
    "transition hover:bg-natural-200/35 dark:hover:bg-natural-800/35 cursor-pointer",
    "[--ripple-color:theme(colors.natural.200/0.5)] dark:[--ripple-color:theme(colors.natural.800/0.5)]"
  ),
  label: "relative z-[1] font-medium text-natural-600 dark:text-natural-300",
  outline: "border ml-[-1px] first-of-type:ml-0",
  disabled: {
    container: "cursor-not-allowed opacity-60",
    label: "cursor-not-allowed"
  },
  actived: {
    container:
      "[--ripple-color:theme(colors.primary.200/0.5)] dark:[--ripple-color:theme(colors.primary.800/0.5)]",
    label: "text-primary-500 dark:text-primary-400"
  }
}

export const tabs = {
  container: "relative",
  tabs: "flex gap-1 mb-2",
  button: classMerge(
    "h-10 w-8 rounded flex items-center justify-center text-primary-500 dark:text-primary-400",
    "transition hover:bg-natural-200/35 dark:hover:bg-natural-800/35 cursor-pointer"
  ),
  buttonIcon: "relative z-[1] h-5 w-5",
  content: "relative flex-1 flex v-scrollbar-none overflow-scroll",
  wrapper: "flex width-fit",
  floatingLine: classMerge(
    "absolute bottom-0 h-[2px] w-[100px] transition duration-300 rounded-full",
    "bg-primary-500 dark:bg-primary-400"
  )
}
