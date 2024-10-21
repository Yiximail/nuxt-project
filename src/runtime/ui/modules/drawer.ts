import classMerge from "../../utils/class-merge"

export const drawer = {
  mask: "",
  container: classMerge(
    "[--drawer-bg:theme(colors.natural.50)] dark:[--drawer-bg:theme(colors.natural.800)]",
    "fixed z-[600] flex flex-col shadow-md bg-[--drawer-bg]"
  ),
  header: "py-1 px-3 flex gap-2 items-center",
  icon: "h-6 w-6",
  title: "font-medium text-lg flex-1 min-w-0 truncate",
  wrapper: "flex gap-2 py-1 px-3 first:pt-3 last:pb-3 flex-1 min-h-0",
  content: "flex-1 min-w-0 overflow-auto v-native-scrollbar",
  footer: "py-2 px-3 flex gap-2 items-center",
  divider: "mx-2",
  close: "absolute top-0 right-0 h-5 w-5",
  placement: {
    top: "h-[150px] rounded-b-md top-0 left-0 right-0",
    right: "w-[450px] rounded-l-md top-0 right-0 bottom-0",
    bottom: "h-[150px] rounded-t-md left-0 right-0 bottom-0",
    left: "w-[450px] rounded-r-md top-0 left-0 bottom-0"
  }
}
