import classMerge from "../../utils/class-merge"

export const icon = {
  container: "relative color-[inherit] shrink-0",
  block: "flex items-center justify-center",
  inline: "inline-flex items-center justify-center"
}

export const iconButton = {
  base: classMerge(
    "relative transition max-w-full select-none shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-{color}-400 focus-visible:ring-offset-1 focus-visible:ring-offset-natural-50 focus-visible:dark:ring-offset-natural-950",
    "before:absolute before:border before:border-transparent before:pointer-events-none before:transition before:inset-0 before:rounded-[inherit]"
  ),
  content:
    "relative z-[1] flex justify-center items-center gap-[inherit] max-w-full h-full",
  size: {
    xl: "h-7 w-7 text-[26px] leading-none rounded-lg",
    lg: "h-7 w-7 text-[24px] leading-none rounded-lg",
    md: "h-6 w-6 text-[20px] leading-none rounded-md",
    sm: "h-5 w-5 text-[16px] leading-none rounded-md",
    xs: "h-4 w-4 text-[13px] leading-none rounded-md"
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
    "shadow-md shadow-[theme(colors.natural.500/0.5)] dark:shadow-[theme(colors.{color}.500/0.5)]"
}
