import classMerge from "../../utils/class-merge"

export const popper = {
  popper: "text-base",
  content: classMerge(
    "min-w-6 min-h-6 max-w-[100dvw] max-h-[100dvh] rounded-md shadow-lg border border-[--popper-border] bg-[--popper-bg]",
    "[--popper-bg:theme(colors.natural.50)] dark:[--popper-bg:theme(colors.natural.900)]",
    "[--popper-border:theme(colors.natural.300)] dark:[--popper-border:theme(colors.natural.600)]"
  ),
  arrow: "shadow-[inherit]"
}
