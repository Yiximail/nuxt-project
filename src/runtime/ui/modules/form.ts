import classMerge from "../../utils/class-merge"

export const formFooter = {
  container: "flex gap-4 p-2"
}

export const formInfo = {
  container: "text-[0.8em] text-natural-500 dark:text-natural-400"
}

export const formItem = {
  container: "pb-3 last:pb-0",
  label: classMerge(
    "w-fit font-medium text-natural-500 dark:text-natural-400 transition",
    "fieldset-active:-top-0.5 fieldset-active:left-1",
    "fieldset-focus:-top-0.5 fieldset-focus:left-1",
    "fieldset-error:text-danger-500 fieldset-error:dark:text-danger-400"
  ),
  required:
    "after:text-danger-500 dark:after:text-danger-400 after:content-['*'] after:select-none after:ml-0.5"
}

export const formValidate = {
  container: "text-[0.8em] text-natural-500 dark:text-natural-400",
  error: "text-danger-500 dark:text-danger-400",
  success: "text-success-500 dark:text-success-400",
  warning: "text-warning-500 dark:text-warning-400"
}

export const form = {
  container: "relative",
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  }
}
