import classMerge from "../../utils/class-merge"

export const menuGroup = {
  container: "h-6 flex items-center",
  content:
    "text-sm font-medium text-natural-400 dark:text-natural-500 flex-1 min-w-0 truncate"
}

export const menuItem = {
  container: "",
  label: "",
  arrow: "",
  actived: {
    container: "",
    label: "",
    arrow: ""
  },
  expanded: {
    container: "",
    label: "",
    arrow: ""
  },
  disabled: {
    container: "",
    label: "",
    arrow: ""
  }
}

export const menu = {
  container: classMerge(
    "[--menu-bg:theme(colors.natural.50)] dark:[--menu-bg:theme(colors.natural.900)]",
    "[--menu-border:theme(colors.natural.300)] dark:[--menu-border:theme(colors.natural.600)]",
    "relative w-[--collapsed-width] flex flex-col items-stretch transition-[width]",
    "py-3 bg-[--menu-bg] border border-[--menu-border]"
  ),
  header: "h-fit",
  scroller: "flex-1 min-h-0 px-2",
  content: "",
  scrollbar: "bottom-10",
  view: "flex flex-col",
  footer: "h-fit",
  button: "absolute z-[1] bottom-0.5 right-0 -translate-y-1/2 translate-x-1/2",
  shadow: "shadow",
  expanded: {
    container: "w-[--expanded-width]",
    header: "",
    scroller: "",
    content: "",
    view: "",
    footer: "",
    button: ""
  },
  item: {
    container: classMerge(
      "h-8 pr-2 pl-[calc(0.5rem+var(--menu-level)*1.25rem)] rounded transition",
      "flex items-center gap-1",
      "font-medium text-natural-600 dark:text-natural-300",
      "[--ripple-color:theme(colors.natural.200/0.5)] dark:[--ripple-color:theme(colors.natural.900/0.5)]",
      "hover:bg-natural-400/10 dark:hover:bg-natural-500/10",
      "cursor-pointer"
    ),
    label: "relative z-[1] flex-1 min-w-0 truncate",
    arrow: "relative z-[1] h-5 w-5 transition",
    actived: {
      container: "text-primary-500 dark:text-primary-400",
      label: "",
      arrow: ""
    },
    expanded: {
      container: "",
      label: "",
      arrow: "rotate-90"
    },
    disabled: {
      container: "opacity-60 cursor-not-allowed",
      label: "",
      arrow: ""
    }
  }
}
