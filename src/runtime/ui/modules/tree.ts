import classMerge from "../../utils/class-merge"

export const tree = {
  container: classMerge(
    "relative flex flex-col [--scrollbar-opacity:0] hover:[--scrollbar-opacity:100]"
  ),
  scroller: "flex-1 overflow-scroll v-scrollbar-none",
  verticalScrollbar: "top-0 bottom-0 -right-2",
  horizontalScrollbar: "left-0 right-0 -bottom-2",
  view: "min-h-full min-w-full w-max",
  item: classMerge(
    "relative py-0.5 flex items-center",
    "ml-[calc(var(--indent)*20px)]"
  ),
  block: "h-6 w-5 flex items-center justify-center",
  button: "",
  drag: classMerge(
    "h-5 w-5 flex items-center justify-center cursor-grab active:cursor-grabbing select-none",
    "text-natural-500 dark:text-natural-400"
  ),
  checkbox: "mx-1",
  arrow: "transition duration-300",
  arrowActive: "rotate-90",
  label: "",
  empty:
    "absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none",
  dragover: {
    item: "relative after:absolute after:left-0 after:right-0 after:rounded after:pointer-events-none",
    before:
      "after:top-[-1px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400",
    inner:
      "after:top-0 after:bottom-0 after:border-2 after:border-primary-500 dark:after:border-primary-400",
    after:
      "after:bottom-[-1px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400"
  }
}
