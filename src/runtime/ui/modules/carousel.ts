import classMerge from "../../utils/class-merge"

export const carousel = {
  container: "overflow-hidden relative mx-auto",
  item: "flex-shrink-0 select-none",
  dot: "absolute",
  dotItem:
    "shadow bg-natural-100/50 dark:bg-natural-500/25 rounded-full w-3 h-3 cursor-pointer hover:bg-natural-100/80 dark:hover:bg-natural-500/60",
  dotItemActived:
    "bg-natural-100 dark:bg-natural-500 cursor-default hover:bg-natural-100 dark:hover:bg-natural-500",
  progress: "h-full w-full rounded-full",
  progressBar: "bg-natural-100 dark:bg-natural-700",
  buttonList: "absolute gap-1",
  button: classMerge(
    "text-natural-100/50 dark:text-natural-700/50 transition select-none cursor-pointer",
    "h-8 w-8 rounded-full shadow hover:text-natural-100 dark:hover:text-natural-500"
  ),
  horizontal: {
    container: "h-fit flex flex-row items-stretch",
    item: "w-full",
    dot: "left-2 bottom-2 flex gap-1",
    dotItem: "transition-[background,width] duration-300",
    dotItemActived: "w-10",
    progress: "",
    progressBar: "",
    buttonList: "flex flex-row bottom-1 right-2",
    button: ""
  },
  vertical: {
    container: "flex flex-col items-stretch",
    item: "h-full",
    dot: "top-2 right-2 flex flex-col gap-1",
    dotItem: "transition-[background,height] duration-300",
    dotItemActived: "h-10",
    progress: "",
    progressBar: "",
    buttonList: "flex flex-col bottom-2 right-1",
    button: ""
  }
}
