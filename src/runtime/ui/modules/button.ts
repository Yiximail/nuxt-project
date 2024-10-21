import classMerge from "../../utils/class-merge"

import type { IconComponent } from "../../types/build"

export const button = {
  base: classMerge(
    "relative transition max-w-full select-none shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-{color}-400 focus-visible:ring-offset-1 focus-visible:ring-offset-natural-50 focus-visible:dark:ring-offset-natural-950",
    "before:absolute before:border before:border-transparent before:pointer-events-none before:transition before:inset-0 before:rounded-[inherit]"
  ),
  content:
    "relative z-[1] flex justify-center items-center gap-[inherit] max-w-full h-full whitespace-nowrap",
  size: {
    xl: "h-10 px-4 gap-2 text-xl leading-none rounded-lg",
    lg: "h-8 px-4 gap-2 text-lg leading-none rounded-lg",
    md: "h-7 px-3 gap-1 text-base leading-none rounded-md",
    sm: "h-6 px-3 gap-1 text-sm leading-none rounded-md",
    xs: "h-5 px-2 gap-1 text-xs leading-none rounded-md"
  },
  icon: {
    xl: "h-10 w-10 px-0 text-[26px]",
    lg: "h-8 w-8 px-0 text-[22px]",
    md: "h-7 w-7 px-0 text-[18px]",
    sm: "h-6 w-6 px-0 text-[16px]",
    xs: "h-5 w-5 px-0 text-[14px]"
  },
  rounded: "rounded-full",
  enabled: {
    base: "hover:before:bg-white/15",
    plain: "hover:before:bg-[theme(colors.{color}.500/0.1)]",
    text: "hover:before:bg-[theme(colors.{color}.500/0.1)]",
    border:
      "hover:before:bg-[theme(colors.{color}.500/0.1)] hover:before:border-[theme(colors.{color}.500/0.6)]"
  },
  disabled: "cursor-not-allowed opacity-60",
  loading: {
    name: "mingcute:loading-fill",
    class: "self-center animate-spin"
  } as IconComponent,
  type: {
    base: classMerge(
      "text-white bg-[theme(colors.{color}.500)] dark:bg-[theme(colors.{color}.600)]",
      "[--ripple-color:theme(colors.{color}.900/0.1)] dark:[--ripple-color:theme(colors.{color}.900/0.2)]"
    ),
    plain: classMerge(
      "text-[theme(colors.{color}.500)] bg-[theme(colors.{color}.100)]",
      "dark:text-[theme(colors.{color}.400)] dark:bg-[theme(colors.{color}.900)]",
      "[--ripple-color:theme(colors.{color}.500/0.1)]"
    ),
    text: classMerge(
      "text-[theme(colors.{color}.500)] dark:text-[theme(colors.{color}.400)]",
      "[--ripple-color:theme(colors.{color}.500/0.1)]"
    )
  },
  border: "before:border-[theme(colors.{color}.500/0.5)]",
  shadow:
    "shadow shadow-[theme(colors.natural.500/0.5)] dark:shadow-[theme(colors.{color}.500/0.5)]"
}
