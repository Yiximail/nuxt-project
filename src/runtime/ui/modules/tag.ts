import classMerge from "../../utils/class-merge"

export const tag = {
  container: "transition px-2 gap-1 inline-flex justify-center items-center",
  size: {
    xl: "h-7 px-4 gap-2 text-[18px] leading-none rounded-lg",
    lg: "h-7 px-4 gap-2 text-[16px] leading-none rounded-lg",
    md: "h-6 px-3 gap-1 text-[14px] leading-none rounded-md",
    sm: "h-5 px-3 gap-1 text-[13px] leading-none rounded-md",
    xs: "h-4 px-2 gap-1 text-[12px] leading-none rounded-md"
  },
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
  rounded: "rounded-full",
  border: "border-[theme(colors.{color}.500/0.5)]",
  shadow:
    "shadow-md shadow-[theme(colors.natural.500/0.5)] dark:shadow-[theme(colors.{color}.500/0.5)]",
  closeButton: "h-[1em] w-[1em] mr-[-0.5em] cursor-pointer"
}
