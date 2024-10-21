import classMerge from "../../utils/class-merge"

export const radioButton = {
  base: "rounded-none [&:not(:first-of-type)]:before:border-l-0",
  size: {
    xl: "first-of-type:rounded-l-lg last-of-type:rounded-r-lg",
    lg: "first-of-type:rounded-l-lg last-of-type:rounded-r-lg",
    md: "first-of-type:rounded-l-md last-of-type:rounded-r-md",
    sm: "first-of-type:rounded-l-md last-of-type:rounded-r-md",
    xs: "first-of-type:rounded-l-sm last-of-type:rounded-r-sm"
  },
  rounded: "first-of-type:rounded-l-full last-of-type:rounded-r-full"
}

export const radio = {
  container: "inline-flex items-center flex-row-reverse",
  radio:
    "relative user-select-none h-[1em] w-[1em] flex items-center justify-center shrink-0",
  radioIcon: classMerge(
    "absolute z-[2] h-full w-full pointer-events-none transition-transform",
    "bg-primary-500 dark:bg-primary-400 rounded-full"
  ),
  input: classMerge(
    "relative z-[1] appearance-none h-full w-full rounded-full transition border-2",
    "bg-natural-50 dark:bg-natural-950",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
    "focus-visible:ring-offset-1 focus-visible:ring-offset-natural-50 focus-visible:dark:ring-offset-natural-950"
  ),
  label: "truncate pl-[.3em]",
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  actived: {
    container:
      "[--ripple-color:theme(colors.primary.200/0.5)] dark:[--ripple-color:theme(colors.primary.800/0.5)]",
    radio: "",
    input: "border-primary-500",
    radioIcon: "scale-50",
    label: ""
  },
  inactived: {
    container:
      "[--ripple-color:theme(colors.natural.900/0.05)] dark:[--ripple-color:theme(colors.natural.100/0.1)]",
    radio: "",
    input: "border-natural-300 dark:border-natural-700",
    radioIcon: "scale-0",
    label: ""
  },
  enabled: {
    container: "",
    radio: "hover:after:opacity-100 peer-hover/v-radio:after:opacity-100",
    input: "cursor-pointer",
    radioIcon: "",
    label: "peer/v-radio cursor-pointer"
  },
  disabled: {
    container: "opacity-60",
    radio: "cursor-not-allowed after:hidden",
    input: "cursor-not-allowed",
    radioIcon: "cursor-not-allowed",
    label: "cursor-not-allowed"
  },
  ripple: {
    container: "px-[.3em]",
    radio: classMerge(
      "after:block after:h-[1.6em] after:w-[1.6em] after:rounded-full after:opacity-0 after:bg-[--ripple-color]",
      "after:absolute after:pointer-events-none after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:transition"
    )
  }
}
