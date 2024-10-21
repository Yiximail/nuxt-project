import classMerge from "../../utils/class-merge"

export const notificationContainer = {
  container: classMerge(
    "relative fixed top-6 right-[calc(0.75rem+var(--scrollbar-right-width,0px))]",
    "w-[500px] z-[1000]"
  )
}

export const notification = {
  container: classMerge(
    "[--notification-bg:theme(colors.natural.50)] dark:[--notification-bg:theme(colors.natural.800)]",
    "mb-2 pb-1 min-h-[60px] max-h-[30dvh] w-full",
    "relative flex flex-col rounded-md shadow-md bg-[--notification-bg]"
  ),
  header: "pt-1 px-3 flex gap-2 items-center",
  icon: "h-6 w-6",
  title: "font-medium text-lg flex-1 min-w-0 truncate",
  wrapper: "flex gap-2 py-1 px-3 first:pt-3 last:pb-3 flex-1 min-h-0",
  message: "flex-1 min-w-0 overflow-auto v-native-scrollbar",
  footer: "py-2 px-3 flex gap-2 items-center justify-end",
  divider: "mx-2",
  close: "absolute top-0 right-0 h-5 w-5",
  progress: "absolute h-[3px] left-2 right-2 bottom-[1.5px]",
  progressBar: "bg-{color}-500 dark:bg-{color}-400"
}
