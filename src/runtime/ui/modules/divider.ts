export const divider = {
  horizontal: {
    container: "h-[1px] flex items-center self-stretch gap-3",
    line: "border-b flex-1"
  },
  vertical: {
    container: "w-[1px] flex flex-col items-center self-stretch gap-3",
    line: "border-r flex-1"
  },
  container:
    "transition text-[var(--divider-color,theme(colors.natural.700))] dark:text-[var(--divider-color,theme(colors.natural.200))]",
  line: "transition border-[var(--divider-color,theme(colors.natural.300))] dark:border-[var(--divider-color,theme(colors.natural.600))]",
  startLine: "",
  endLine: ""
}
