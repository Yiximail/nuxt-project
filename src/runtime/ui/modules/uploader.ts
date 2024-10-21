import classMerge from "../../utils/class-merge"

export const uploaderImageInsert = {
  container: classMerge(
    "relative flex items-center justify-center h-[5em] w-[5em] rounded-[0.5em] transition border-4 border-natural-400/15 text-natural-500",
    "cursor-pointer transition hover:border-primary-500/60 hover:text-primary-500"
  ),
  icon: "h-[1.25em] w-[1.25em]",
  label: "font-medium",
  count:
    "absolute right-0.5 bottom-0.5 text-[0.8em] leading-tight font-medium text-natural-400 dark:text-natural-500"
}

export const uploaderImageItem = {
  container: classMerge(
    "relative h-[5em] w-[5em] rounded-[0.5em] transition",
    "border-4 border-natural-400/15 text-natural-500 [--status-color:theme(colors.natural.500)]"
  ),
  error:
    "bg-danger-400/15 text-danger-500 [--status-color:theme(colors.danger.500)]",
  success:
    "bg-primary-400/15 text-primary-600 dark:text-primary-400 [--status-color:theme(colors.primary.500)]",
  image: "h-full w-full rounded select-none",
  status: classMerge(
    "absolute top-0 right-0 z-[1] h-[1em] w-[1em] translate-x-1/4 -translate-y-1/4",
    "flex items-center justify-center text-white rounded-full bg-[--status-color]",
    "transition-opacity duration-300 group-hover/item:opacity-0 opacity-100"
  ),
  button: "w-2/5 h-2/5",
  buttonList: classMerge(
    "absolute top-0 bottom-0 left-0 right-0 bottom-0 z-[1] bg-natural-800/75 rounded",
    "flex flex-wrap items-center content-evenly justify-evenly",
    "transition-opacity duration-300 group-hover/item:opacity-100 opacity-0"
  ),
  drag: classMerge(
    "w-2/5 h-2/5 flex items-center justify-center rounded cursor-grab active:cursor-grabbing select-none",
    "bg-natural-800/50 text-white"
  ),
  loading:
    "w-2/5 h-2/5 flex items-center justify-center bg-natural-800/50 text-white rounded",
  progress: "absolute h-1 left-1 right-1 -bottom-1.5 z-[2]",
  progressBar: "",
  dragover: {
    container:
      "after:absolute after:-top-1 after:-bottom-1 after:rounded after:pointer-events-none",
    before:
      "after:left-[-9px] after:w-[2px] after:bg-primary-500 dark:after:bg-primary-400",
    inner:
      "after:-left-1 after:-right-1 after:border-2 after:border-primary-500 dark:after:border-primary-400",
    after:
      "after:right-[-9px] after:w-[2px] after:bg-primary-500 dark:after:bg-primary-400"
  }
}

export const uploaderImage = {
  container: "relative flex flex-wrap gap-2 rounded transition mx-1 px-1",
  dragover:
    "ring-2 ring-primary-400 ring-offset-1 ring-offset-natural-50 dark:ring-offset-natural-950",
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  }
}

export const uploaderItem = {
  container: classMerge(
    "relative px-[0.5em] mb-1.5 h-[2.5em] flex items-center gap-[0.25em] rounded-[0.3em] transition",
    "bg-natural-400/15 text-natural-500"
  ),
  error: "bg-danger-400/15 text-danger-500",
  success: "bg-primary-400/15 text-primary-600 dark:text-primary-400",
  preview: "size-[2em] flex items-center justify-center",
  image: "size-[2em] cursor-pointer",
  icon: "",
  name: "px-[0.25em] flex-1 truncate font-medium transition",
  label: "px-[0.25em] relative font-medium w-fit shrink-0",
  button: "",
  drag: "size-[1.5em] flex items-center justify-center cursor-grab active:cursor-grabbing select-none",
  loading: "size-[1.5em] flex items-center justify-center",
  progress: "absolute h-[2px] left-20 right-4 bottom-1",
  progressBar: "bg-primary-500/50 dark:bg-primary-400/50",
  dragover: {
    container:
      "after:absolute after:left-0 after:right-0 after:rounded after:pointer-events-none",
    before:
      "after:top-[-4px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400",
    inner:
      "after:top-0 after:bottom-0 after:border-2 after:border-primary-500 dark:after:border-primary-400",
    after:
      "after:bottom-[-4px] after:h-[2px] after:bg-primary-500 dark:after:bg-primary-400"
  }
}

export const uploader = {
  container: "relative rounded transition mx-1",
  dragover:
    "ring-2 ring-primary-400 ring-offset-1 ring-offset-natural-50 dark:ring-offset-natural-950",
  button: "self-start",
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  }
}
