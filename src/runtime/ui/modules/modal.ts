import classMerge from "../../utils/class-merge"

export const modal = {
  mask: "flex items-center justify-center",
  container: classMerge(
    "[--modal-bg:theme(colors.natural.50)] dark:[--modal-bg:theme(colors.natural.800)]",
    "min-h-[250px] min-w-[450px] max-h-[90dvh] max-w-[90dvw]",
    "relative flex flex-col rounded-md shadow-md bg-[--modal-bg]"
  ),
  header: "py-1 px-3 flex gap-2 items-center",
  icon: "h-6 w-6",
  title: "font-medium text-lg flex-1 min-w-0 truncate",
  wrapper: "flex gap-2 py-1 px-3 first:pt-3 last:pb-3 flex-1 min-h-0",
  content: "flex-1 min-w-0 overflow-auto v-native-scrollbar",
  footer: "py-2 px-3 flex gap-2 items-center justify-end",
  divider: "mx-2",
  close: "absolute top-0 right-0 h-5 w-5"
}
