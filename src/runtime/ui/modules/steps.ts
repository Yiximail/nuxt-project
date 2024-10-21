import classMerge from "../../utils/class-merge"

export const stepsItem = {
  container: "relative flex-1",
  header: "flex items-center group-last/steps-item:after:hidden",
  icon: "flex items-center justify-center w-8 h-8 rounded-full border-2",
  title: "text-lg font-medium truncate ml-2 text-natural-400 dark:text-natural-500",
  content: "text-natural-400 dark:text-natural-500",
  horizontal: {
    container: "",
    header: "after:border-t-2 after:flex-1 after:mx-2",
    icon: "",
    title: "",
    content: "ml-10 mr-2"
  },
  vertical: {
    container: "",
    header: classMerge(
      "after:absolute after:border-l-2 after:-translate-x-1/2",
      "after:top-10 after:left-4 after:h-[calc(100%-3rem)]"
    ),
    icon: "",
    title: "",
    content: "ml-10 min-h-10 mb-4"
  },
  current: {
    container: "",
    header: "after:border-natural-300 dark:after:border-natural-500",
    icon: "",
    title: "text-natural-900 dark:text-natural-100",
    content: "text-natural-900 dark:text-natural-100"
  },
  status: {
    wait: {
      container: "",
      header: "after:border-natural-300 dark:after:border-natural-500",
      icon: "text-natural-300 border-natural-300 dark:text-natural-500 dark:border-natural-500",
      title: "",
      content: ""
    },
    process: {
      container: "",
      header: "after:border-natural-300 dark:after:border-natural-500",
      icon: "text-primary-500 border-primary-500",
      title: "",
      content: ""
    },
    finish: {
      container: "",
      header: "after:border-primary-500",
      icon: "text-primary-500 border-primary-500",
      title: "",
      content: ""
    },
    error: {
      container: "",
      header: "after:border-danger-300",
      icon: "text-danger-500 border-danger-500",
      title: "",
      content: ""
    }
  }
}

export const steps = {
  container: "",
  horizontal: {
    container: "flex items-stretch"
  },
  vertical: {
    container: "flex flex-col items-stretch"
  }
}
