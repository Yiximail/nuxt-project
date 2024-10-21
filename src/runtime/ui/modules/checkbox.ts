import classMerge from "../../utils/class-merge"

import type { IconComponent } from "../../types/build"

export const checkboxGroup = {
  container: "inline-flex items-center flex-row-reverse",
  checkbox:
    "relative user-select-none h-[1em] w-[1em] flex items-center justify-center shrink-0",
  input: classMerge(
    "relative z-[1] appearance-none h-full w-full rounded-md transition border-2",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
    "focus-visible:ring-offset-1 focus-visible:ring-offset-natural-50 focus-visible:dark:ring-offset-natural-950"
  ),
  label: "truncate pl-[.3em]",
  checkIcon: {
    name: "mdi:check",
    class: "absolute z-[2] text-white pointer-events-none"
  } as IconComponent,
  indeterminateIcon: {
    name: "mdi:minus",
    class: "absolute z-[2] text-white pointer-events-none"
  } as IconComponent,
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
    checkbox: "",
    input: "bg-primary-500 border-primary-500",
    label: ""
  },
  inactived: {
    container:
      "[--ripple-color:theme(colors.natural.900/0.05)] dark:[--ripple-color:theme(colors.natural.100/0.1)]",
    checkbox: "",
    input:
      "bg-natural-50 dark:bg-natural-950 border-natural-300 dark:border-natural-700",
    label: ""
  },
  enabled: {
    container: "",
    checkbox:
      "hover:after:opacity-100 peer-hover/v-checkbox-group:after:opacity-100",
    input: "cursor-pointer",
    label: "peer/v-checkbox-group cursor-pointer"
  },
  disabled: {
    container: "opacity-60",
    checkbox: "cursor-not-allowed after:hidden",
    input: "cursor-not-allowed",
    label: "cursor-not-allowed"
  },
  ripple: {
    container: "px-[.3em]",
    checkbox: classMerge(
      "after:block after:h-[1.6em] after:w-[1.6em] after:rounded-full after:opacity-0 after:bg-[--ripple-color]",
      "after:absolute after:pointer-events-none after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:transition"
    )
  }
}

export const checkbox = {
  container: "inline-flex items-center flex-row-reverse",
  checkbox:
    "relative user-select-none h-[1em] w-[1em] flex items-center justify-center shrink-0",
  input: classMerge(
    "relative z-[1] appearance-none h-full w-full rounded-md transition border-2",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
    "focus-visible:ring-offset-1 focus-visible:ring-offset-natural-50 focus-visible:dark:ring-offset-natural-950"
  ),
  label: "truncate pl-[.3em]",
  checkIcon: {
    name: "mdi:check",
    class: "absolute z-[2] text-white pointer-events-none"
  } as IconComponent,
  indeterminateIcon: {
    name: "mdi:minus",
    class: "absolute z-[2] text-white pointer-events-none"
  } as IconComponent,
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
    checkbox: "",
    input: "bg-primary-500 border-primary-500",
    label: ""
  },
  inactived: {
    container:
      "[--ripple-color:theme(colors.natural.900/0.05)] dark:[--ripple-color:theme(colors.natural.100/0.1)]",
    checkbox: "",
    input:
      "bg-natural-50 dark:bg-natural-950 border-natural-300 dark:border-natural-700",
    label: ""
  },
  enabled: {
    container: "",
    checkbox: "hover:after:opacity-100 peer-hover/v-checkbox:after:opacity-100",
    input: "cursor-pointer",
    label: "peer/v-checkbox cursor-pointer"
  },
  disabled: {
    container: "opacity-60",
    checkbox: "cursor-not-allowed after:hidden",
    input: "cursor-not-allowed",
    label: "cursor-not-allowed"
  },
  ripple: {
    container: "px-[.3em]",
    checkbox: classMerge(
      "after:block after:h-[1.6em] after:w-[1.6em] after:rounded-full after:opacity-0 after:bg-[--ripple-color]",
      "after:absolute after:pointer-events-none after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:transition"
    )
  }
}
