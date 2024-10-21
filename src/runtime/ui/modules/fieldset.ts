import classMerge from "../../utils/class-merge"

export const fieldset = {
  size: {
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  },
  outline: {
    container:
      "mt-[0.6em] px-[0.5em] rounded-[0.3em] border border-[--fieldset-border]",
    outset: "mt-0",
    content: "py-[0.3em]",
    label:
      "absolute top-0 left-0 [--label-y:0.3em] [--label-x:0.5em] [--active-label-y:-0.8em] [--active-label-x:0.6em]",
    labelText: "",
    legend: classMerge(
      "px-0 max-w-0 transition-all",
      "fieldset-active-focus:ml-[-0.3em] fieldset-active-focus:px-[0.3em] fieldset-active-focus:max-w-[calc(100%-1.6em)]"
    )
  },
  underline: {
    container: classMerge(
      "mt-[0.8em] rounded-t-md",
      "border-b border-[--fieldset-border] rounded-t-md",
      "after:absolute after:left-0 after:right-0 after:bottom-[-1.5px]",
      "after:origin-center after:scale-x-0 after:transition after:duration-500 is-focus:after:scale-x-100",
      "after:border-b-[2px] after:border-[--fieldset-border]"
    ),
    outset: "mt-0",
    content: "",
    label:
      "absolute top-0 left-0 [--label-y:0] [--label-x:0] [--active-label-y:-1em] [--active-label-x:0]",
    labelText: "",
    legend: ""
  },
  none: {
    container:
      "mt-[0.8em] rounded-md -translate-y-0 is-active-focus:translate-y-0",
    outset: "mt-0 translate-y-0",
    content: "",
    label:
      "absolute top-0 left-0 [--label-y:0] [--label-x:0] [--active-label-y:-1em] [--active-label-x:0]",
    labelText: "",
    legend: ""
  },
  container: classMerge(
    "relative flex items-center gap-1 transition",
    "is-disabled:bg-natural-100 is-disabled:dark:bg-natural-900 is-disabled:cursor-not-allowed",
    "is-disabled:[--fieldset-border:theme(colors.natural.300)] is-disabled:dark:[--fieldset-border:theme(colors.natural.800)]",
    "[&>.v-divider]:[--divider-color:var(--fieldset-border)]"
  ),
  status: {
    default: classMerge(
      "[--fieldset-label:theme(colors.natural.500)] dark:[--fieldset-label:theme(colors.natural.400)]",
      "is-focus:[--fieldset-label:theme(colors.primary.500)] is-focus:dark:[--fieldset-label:theme(colors.primary.400)]",
      "[--fieldset-border:theme(colors.natural.300)] dark:[--fieldset-border:theme(colors.natural.600)]",
      "is-hover:[--fieldset-border:theme(colors.natural.400)] is-hover:dark:[--fieldset-border:theme(colors.natural.400)]",
      "is-focus:[--fieldset-border:theme(colors.primary.500)] is-focus:dark:[--fieldset-border:theme(colors.primary.500)]"
    ),
    error: classMerge(
      "[--fieldset-label:theme(colors.danger.500)] dark:[--fieldset-label:theme(colors.danger.400)]",
      "[--fieldset-border:theme(colors.danger.300)] dark:[--fieldset-border:theme(colors.danger.600)]",
      "is-hover:[--fieldset-border:theme(colors.danger.400)] is-hover:dark:[--fieldset-border:theme(colors.danger.400)]",
      "is-focus:[--fieldset-border:theme(colors.danger.500)] is-focus:dark:[--fieldset-border:theme(colors.danger.500)]"
    ),
    success: classMerge(
      "[--fieldset-label:theme(colors.success.500)] dark:[--fieldset-label:theme(colors.success.400)]",
      "[--fieldset-border:theme(colors.success.300)] dark:[--fieldset-border:theme(colors.success.600)]",
      "is-hover:[--fieldset-border:theme(colors.success.400)] is-hover:dark:[--fieldset-border:theme(colors.success.400)]",
      "is-focus:[--fieldset-border:theme(colors.success.500)] is-focus:dark:[--fieldset-border:theme(colors.success.500)]"
    ),
    warning: classMerge(
      "[--fieldset-label:theme(colors.warning.500)] dark:[--fieldset-label:theme(colors.warning.400)]",
      "[--fieldset-border:theme(colors.warning.300)] dark:[--fieldset-border:theme(colors.warning.600)]",
      "is-hover:[--fieldset-border:theme(colors.warning.400)] is-hover:dark:[--fieldset-border:theme(colors.warning.400)]",
      "is-focus:[--fieldset-border:theme(colors.warning.500)] is-focus:dark:[--fieldset-border:theme(colors.warning.500)]"
    )
  },
  content: classMerge(
    "flex-1 min-w-0 min-h-0 [&>*:not(.always-show)]:opacity-0 [&>*:not(.always-show)]:transition",
    "flex-1 min-w-0 min-h-0 [&>*:not(.always-show)]:transition",
    "fieldset-active-focus:[&>*:not(.always-show)]:opacity-100"
  ),
  label: classMerge(
    "flex items-center transition-all fieldset-active-focus:text-[0.8em]",
    "text-natural-500 dark:text-natural-400 max-w-full whitespace-nowrap pointer-events-none select-none",
    "translate-x-[--label-x] translate-y-[--label-y]",
    "fieldset-active-focus:translate-x-[--active-label-x] fieldset-active-focus:translate-y-[--active-label-y]",
    "fieldset-focus:text-primary-500 fieldset-focus:dark:text-primary-400",
    "fieldset-disabled:text-natural-300 fieldset-disabled:dark:text-natural-600"
  ),
  labelText:
    "flex items-center font-medium fieldset-active-focus:leading-none",
  legend: classMerge(
    "flex items-center text-[.8em] font-medium h-0 leading-[0] pointer-events-none select-none whitespace-nowrap invisible"
  )
}
