import classMerge from "../../utils/class-merge"

export const _switch = {
  container: "inline-flex items-center flex-row-reverse align-middle",
  switch: classMerge(
    "relative user-select-none h-[1.2em] w-[2.2em] rounded-full transition shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
    "focus-visible:ring-offset-1 focus-visible:ring-offset-natural-50 focus-visible:dark:ring-offset-natural-950"
  ),
  line: "absolute top-1/2 -translate-y-1/2 left-[.3em] right-[.3em] h-[.6em] rounded-full transition",
  outer: "absolute top-[0.1em] left-[0.1em] h-[1em] w-[1em] transition",
  inner:
    "relative z-[1] user-select-none h-full w-full transition rounded-full shadow",
  label: "peer/v-switch text-nowrap pl-[.3em]",
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
    switch: "",
    line: "bg-primary-200 dark:bg-primary-800",
    outer: "translate-x-[1em]",
    inner: "bg-primary-500 dark:bg-primary-400",
    label: ""
  },
  inactived: {
    container:
      "[--ripple-color:theme(colors.natural.900/0.05)] dark:[--ripple-color:theme(colors.natural.100/0.1)]",
    switch: "",
    line: "bg-natural-300 dark:bg-natural-700",
    outer: "translate-x-0",
    inner: "bg-natural-100 dark:bg-natural-600",
    label: ""
  },
  enabled: {
    container: "",
    switch:
      "cursor-pointer hover:[--after-opacity:100] peer-hover/v-switch:[--after-opacity:100]",
    line: "",
    outer: "",
    inner: "",
    label: "cursor-pointer"
  },
  disabled: {
    container: "opacity-60",
    switch: "cursor-not-allowed after:hidden",
    line: "cursor-not-allowed",
    outer: "cursor-not-allowed",
    inner: "cursor-not-allowed",
    label: "cursor-not-allowed"
  },
  ripple: {
    container: "px-[.3em]",
    switch: "[--after-opacity:0]",
    outer: classMerge(
      "after:block after:h-[1.6em] after:w-[1.6em] after:rounded-full after:opacity-[--after-opacity] after:bg-[--ripple-color]",
      "after:absolute after:pointer-events-none after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:transition"
    )
  }
}
