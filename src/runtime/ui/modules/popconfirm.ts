import classMerge from "../../utils/class-merge"

export const popconfirm = {
  reference: "",
  popper: classMerge(
    "[--dialog-bg:theme(colors.natural.50)] dark:[--dialog-bg:theme(colors.natural.800)]",
    "flex flex-col min-w-[300px]"
  ),
  header: "pt-1 px-3 flex gap-1 items-center",
  icon: "h-5 w-5 my-0.5",
  title: "font-medium flex-1 min-w-0 truncate",
  wrapper: "flex gap-2 py-1 px-3 first:pt-3 last:pb-3 flex-1 min-h-0",
  content: "flex-1 min-w-0 overflow-auto v-native-scrollbar",
  footer: "py-2 px-3 flex gap-2 items-center justify-end"
}
