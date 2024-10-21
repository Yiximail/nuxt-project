import classMerge from "../../utils/class-merge"

export const tableBodyCell = {
  base: "",
  drag: classMerge(
    "cursor-grab active:cursor-grabbing flex items-center justify-center select-none",
    "text-natural-500 dark:text-natural-400"
  )
}

export const tableColumnControllerItem = {
  container: "h-9 px-1 flex items-center gap-1",
  drag: "cursor-move",
  label: "font-medium flex-1 truncate px-2",
  dragover: {
    container:
      "relative after:absolute after:left-0 after:right-0 after:z-[calc(var(--table-head-zindex)+1)] after:pointer-events-none",
    before:
      "after:top-[-1px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400",
    inner:
      "after:top-0 after:bottom-0 after:border-2 after:border-primary-500 dark:after:border-primary-400",
    after:
      "after:bottom-[-1px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400"
  }
}

export const tableColumnController = {
  header: classMerge(
    "py-1 px-2 font-medium text-natural-500 dark:text-natural-400",
    "flex items-center justify-between"
  ),
  button: classMerge(
    "absolute z-[--table-head-zindex] -left-4 -translate-y-[calc(50%)]",
    "top-[calc((var(--table-head-height)-1px)/2)]",
    "opacity-0 group-hover/container:opacity-100 transition-opacity [&.show]:opacity-100"
  ),
  popper: "max-h-[350px] max-w-[300px] min-w-[150px] py-1"
}

export const tableEllipsis = {
  popper: classMerge(
    "fixed py-2 px-1.5 rounded-md overflow-y-auto max-h-[300px] break-all pre-wrap",
    "shadow border border-natural-300 bg-natural-50 dark:border-natural-600 dark:bg-natural-900",
    "v-native-scrollbar"
  )
}

export const tableFieldset = {
  base: "flex-1 -translate-y-1.5 min-w-0"
}

export const tableFilter = {
  button: "w-5",
  popper: "p-2 w-[350px] max-h-[300px]"
}

export const tableHeadCell = {
  base: "relative",
  content: "",
  label: "font-medium truncate",
  resize: classMerge(
    "absolute top-0 bottom-0 right-0 pl-1",
    "flex items-center select-none cursor-ew-resize",
    "after:h-5 after:w-0.5 after:rounded-full after:transition",
    "after:bg-natural-200 dark:after:bg-natural-700 hover:after:bg-primary-500/50"
  ),
  selectedInfo:
    "text-sm leading-8 font-medium px-2 text-natural-500 dark:text-natural-400"
}

export const tableSort = {
  button: "w-5"
}

export const table = {
  container: classMerge(
    "relative flex flex-col [--scrollbar-opacity:0] hover:[--scrollbar-opacity:100] m-3"
  ),
  scroller: "relative flex-1 overflow-scroll v-scrollbar-none",
  verticalScrollbar: "top-[--table-head-height] bottom-0 -right-2",
  horizontalScrollbar: "left-0 right-0 -bottom-2",
  table: "border-separate border-spacing-0",
  tableHead: "",
  tableBody: "",
  headRow:
    "sticky top-0 z-[--table-head-zindex] [--row-bg:theme(colors.natural.50)] dark:[--row-bg:theme(colors.natural.950)]",
  headCell: classMerge(
    "font-normal h-[calc(2.5rem+1px)] px-1.5 py-0 bg-[--row-bg] text-natural-600 dark:text-natural-300",
    "text-left border-b border-natural-400"
  ),
  headContent: "flex gap-1 items-center justify-center",
  bodyRow: classMerge(
    "[--row-bg:theme(colors.natural.50)] hover:[--row-bg:theme(colors.natural.200)]",
    "dark:[--row-bg:theme(colors.natural.950)] dark:hover:[--row-bg:theme(colors.natural.800)]"
  ),
  bodyCell: classMerge(
    "py-3 px-1.5 bg-[--row-bg] transition border-b border-natural-300 dark:border-natural-600",
    "text-left truncate"
  ),
  hover: classMerge(
    "fixed px-2 flex items-center gap-1",
    "right-[--reference-right] top-[--reference-bottom] -translate-y-1/2",
    "max-w-[max(var(--table-width)-1rem,0px)]"
  ),
  shadowContainer: classMerge(
    "w-0 p-0 sticky pointer-events-none opacity-0 [&.show]:opacity-100 transition-opacity",
    "[--shadow-color:theme(colors.natural.500/0.3)]",
    "dark:[--shadow-color:theme(colors.natural.500/0.5)]"
  ),
  leftShadow: classMerge(
    "after:absolute after:top-0 after:h-[--table-scroller-height] after:-right-5 after:w-5",
    "after:shadow-[inset_12px_0_8px_-12px_var(--shadow-color)]"
  ),
  rightShadow: classMerge(
    "after:absolute after:top-0 after:h-[--table-scroller-height] after:-left-5 after:w-5",
    "after:shadow-[inset_-12px_0_8px_-12px_var(--shadow-color)]"
  ),
  loading:
    "absolute z-[--table-head-zindex] left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none",
  empty:
    "absolute z-[--table-head-zindex] left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none",
  dragover: {
    container:
      "relative after:absolute after:left-0 after:right-0 after:z-[calc(var(--table-head-zindex)+1)] after:pointer-events-none",
    before:
      "after:top-[-1px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400",
    inner:
      "after:top-0 after:bottom-0 after:border-2 after:border-primary-500 dark:after:border-primary-400",
    after:
      "after:bottom-[-1px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400"
  }
}
