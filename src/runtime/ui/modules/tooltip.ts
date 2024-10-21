import classMerge from "../../utils/class-merge"

export const tooltip = {
  reference: "",
  popper: classMerge(
    "text-natural-100 [--popper-bg:theme(colors.natural.700)] dark:[--popper-bg:theme(colors.natural.800)]",
    "[--popper-border:theme(colors.natural.500)] dark:[--popper-border:theme(colors.natural.600)]"
  ),
  content: "px-2 overflow-y-auto max-h-[100px] max-w-[300px] break-all pre-wrap"
}
