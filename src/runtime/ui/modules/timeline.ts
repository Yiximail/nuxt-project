import classMerge from "../../utils/class-merge"

export const timelineItem = {
  container: "relative flex-1",
  header: "group-last/timeline-item:after:hidden",
  icon: "flex items-center justify-center w-3 h-3 rounded-full border-2 border-{color}-500",
  wrapper: "",
  title: "text-lg font-medium truncate",
  content: "",
  time: "text-sm text-natural-400 dark:text-natural-500",
  dashed: "after:border-dashed",
  horizontal: {
    container: "",
    header:
      "flex items-center after:border-t-2 after:flex-1 after:border-natural-500/50",
    icon: "",
    wrapper: "mr-4",
    title: "",
    content: "",
    time: ""
  },
  vertical: {
    container: "flex",
    header: classMerge(
      "mt-2",
      "after:absolute after:border-l-2 after:-translate-x-1/2 after:border-natural-500/50",
      "after:top-5 after:left-1.5 after:h-[calc(100%-0.75rem)]"
    ),
    icon: "",
    wrapper: "flex-1 min-w-0 ml-2 mb-4",
    title: "",
    content: "min-h-10",
    time: ""
  }
}

export const timeline = {
  container: "",
  horizontal: {
    container: "flex items-stretch"
  },
  vertical: {
    container: "flex flex-col items-stretch"
  }
}
