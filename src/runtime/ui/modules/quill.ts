import classMerge from "../../utils/class-merge"

export const quillViewer = {
  container: "relative w-full",
  border: "border border-gray-200",
  editor:
    "min-h-[calc(1.42*16px+24px)] max-h-[500px] overflow-auto v-native-scrollbar"
}

export const quill = {
  container: "relative w-full",
  toolbar: "flex flex-wrap text-natural-500 dark:text-natural-300",
  toolbarDisabled: "pointer-events-none",
  editor:
    "min-h-[calc(1.42*16px*3+24px)] max-h-[500px] overflow-auto v-native-scrollbar",
  editorDisabled: "cursor-not-allowed",
  processMask: classMerge(
    "absolute top-0 left-0 right-0 bottom-0 z-[1]",
    "flex justify-center items-center gap-2",
    "bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-30 text-natural-500 dark:text-natural-100 font-medium",
    "transition-all duration-300 rounded-md"
  ),
  count: classMerge(
    "text-xs font-medium text-right pointer-events-none",
    "text-natural-400 dark:text-natural-500"
  ),
  countError: "text-danger-400 dark:text-danger-500"
}
