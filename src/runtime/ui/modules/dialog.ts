import classMerge from "../../utils/class-merge"

export const dialog = {
  mask: "flex items-center justify-center",
  container: classMerge(
    "[--dialog-bg:theme(colors.natural.50)] dark:[--dialog-bg:theme(colors.natural.800)]",
    "min-h-[150px] min-w-[450px] max-h-[60dvh] max-w-[600px]",
    "relative flex flex-col rounded-md shadow-md bg-[--dialog-bg]"
  ),
  header: "py-1 px-3 flex gap-2 items-center",
  icon: "h-6 w-6",
  title: "font-medium text-lg flex-1 min-w-0 truncate",
  wrapper: "flex gap-2 py-1 px-3 first:pt-3 last:pb-3 flex-1 min-h-0",
  message: "flex-1 min-w-0 overflow-auto v-native-scrollbar",
  footer: "py-2 px-3 flex gap-2 items-center justify-end",
  divider: "mx-2",
  close: "absolute top-0 right-0 h-5 w-5"
}
