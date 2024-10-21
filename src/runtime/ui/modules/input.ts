import classMerge from "../../utils/class-merge"

export const inputDatePickerItem = {
  container: classMerge(
    "relative flex items-center justify-center select-none w-7 h-7 rounded-full transition",
    "after:absolute after:pointer-events-none after:left-0 after:right-0 after:top-0 after:bottom-0 after:rounded-full",
    "before:absolute before:pointer-events-none before:right-[-3px] before:left-[-3px] before:top-0 before:bottom-0",
    "[--ripple-color:theme(colors.primary.200/0.5)]"
  ),
  clickable: "cursor-pointer hover:bg-natural-200/50 dark:hover:bg-natural-800/50",
  label: "relative z-[1] text-sm font-medium",
  differentMonth: "invisible pointer-events-none",
  today: classMerge(
    "w-3 h-0.5 rounded-full bg-primary-500",
    "absolute left-1/2 -translate-x-1/2 bottom-1"
  ),
  selectedDate: "after:border-2 after:border-primary-500/50",
  startDate: "before:left-0 before:rounded-l-full before:bg-primary-500/25",
  endDate: "before:right-0 before:rounded-r-full before:bg-primary-500/25",
  inRange: "before:bg-primary-500/25",
  disabled: "opacity-40 cursor-not-allowed"
}

export const inputDatePicker = {
  container: "w-fit p-1",
  header: "flex items-center justify-between",
  weeks: "w-fit",
  content: "flex flex-col gap-1.5 w-fit",
  row: "flex gap-1.5 px-[3px]",
  day: classMerge(
    "flex items-center justify-center cursor-default select-none",
    "w-7 h-7 text-sm font-bold text-natural-500 dark:text-natural-400"
  )
}

export const inputDatetimeRange = {
  container:
    "flex items-center gap-1 cursor-text data-[is-disabled=true]:cursor-not-allowed",
  input: classMerge(
    "focus-visible:outline-none bg-transparent",
    "flex-1 min-w-0 min-h-0 disabled:cursor-not-allowed disabled:text-natural-400 dark:disabled:text-natural-500"
  ),
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  separator: "flex items-center justify-center",
  invalid: "line-through",
  clearButton: "",
  icon: "h-5 w-5 flex items-center justify-center text-natural-500 dark:text-natural-400 transition",
  footer: "flex justify-end gap-2 p-1",
  footerButton: "text-sm h-6",
  headerTitle:
    "text-center font-medium text-natural-500 dark:text-natural-400 border-b border-natural-300 dark:border-natural-600"
}

export const inputDatetime = {
  container:
    "flex items-center gap-1 cursor-text data-[is-disabled=true]:cursor-not-allowed",
  input: classMerge(
    "focus-visible:outline-none bg-transparent",
    "flex-1 min-w-0 min-h-0 disabled:cursor-not-allowed disabled:text-natural-400 dark:disabled:text-natural-500"
  ),
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  invalid: "line-through",
  clearButton: "",
  icon: "h-5 w-5 flex items-center justify-center text-natural-500 dark:text-natural-400 transition",
  footer: "flex justify-end gap-2 p-1",
  footerButton: "text-sm h-6"
}

export const inputNumber = {
  container:
    "flex items-center gap-1 cursor-text data-[is-disabled=true]:cursor-not-allowed",
  input: classMerge(
    "focus-visible:outline-none bg-transparent text-[inherit]",
    "flex-1 min-w-0 min-h-0 disabled:cursor-not-allowed disabled:text-natural-400 dark:disabled:text-natural-500"
  ),
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  invalid: "line-through",
  clearButton: ""
}

export const inputTimePickerItem = {
  container: classMerge(
    "relative flex items-center justify-center select-none w-6 h-5 rounded transition",
    "before:absolute before:pointer-events-none before:left-0 before:right-0 before:top-0 before:bottom-0",
    "[--ripple-color:theme(colors.primary.200/0.5)]"
  ),
  clickable: "cursor-pointer hover:bg-natural-200/50 dark:hover:bg-natural-800/50",
  label: "relative z-[1] text-sm font-medium",
  selected:
    "bg-primary-500/25 hover:bg-primary-500/25 dark:hover:bg-primary-500/25",
  disabled: "opacity-40 cursor-not-allowed"
}

export const inputTimePicker = {
  container: "flex items-stretch",
  content: "flex flex-col justify-evenly",
  header: "font-medium text-center text-natural-500 dark:text-natural-400",
  listContainer: "px-1 h-fit flex items-stretch gap-0.5",
  list: "flex flex-col gap-0.5"
}

export const input = {
  container:
    "flex items-center gap-1 cursor-text data-[is-disabled=true]:cursor-not-allowed",
  input: classMerge(
    "focus-visible:outline-none bg-transparent",
    "flex-1 min-w-0 min-h-0 disabled:cursor-not-allowed disabled:text-natural-400 dark:disabled:text-natural-500"
  ),
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  count: "text-[0.8em] font-medium text-natural-400 dark:text-natural-500 select-none",
  clearButton: "",
  password: ""
}
