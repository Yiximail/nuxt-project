import { defineNuxtPlugin } from "#imports"
import classMerge from "../utils/class-merge"

interface VLoadingElement extends HTMLElement {
  defaultPosition?: string
  defaultPointerEvents?: string
  defaultUserSelect?: string
  transitiontimer?: number
  loadingContainer?: HTMLElement
}

const loadingSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><defs><linearGradient id=\"mingcuteLoadingFill0\" x1=\"50%\" x2=\"50%\" y1=\"5.271%\" y2=\"91.793%\"><stop offset=\"0%\" stop-color=\"currentColor\"/><stop offset=\"100%\" stop-color=\"currentColor\" stop-opacity=\"0.55\"/></linearGradient><linearGradient id=\"mingcuteLoadingFill1\" x1=\"50%\" x2=\"50%\" y1=\"15.24%\" y2=\"87.15%\"><stop offset=\"0%\" stop-color=\"currentColor\" stop-opacity=\"0\"/><stop offset=\"100%\" stop-color=\"currentColor\" stop-opacity=\"0.55\"/></linearGradient></defs><g fill=\"none\"><path d=\"M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z\"/><path fill=\"url(#mingcuteLoadingFill0)\" d=\"M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.502 7.502 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021\" transform=\"translate(1.5 1.625)\"/><path fill=\"url(#mingcuteLoadingFill1)\" d=\"M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.475 10.475 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118\" transform=\"translate(1.5 1.625)\"/></g></svg>"

const fadeIn = (el: VLoadingElement) => {
  let container = el.loadingContainer
  if (!container) {
    container = document.createElement("div")
    const containerClass = classMerge(
      "absolute top-0 left-0 right-0 bottom-0 z-[99999]",
      "flex justify-center items-center",
      "bg-white bg-opacity-30 dark:bg-opacity-20 text-natural-500 dark:text-natural-300 text-sm font-medium",
      "transition-all duration-300 rounded-[inherit]",
      el.getAttribute("loading-container-class") || ""
    )
    container.classList.add(
      "v-loading__container",
      ...containerClass.split(" ").filter((item) => item)
    )
    container.style.opacity = "0"
    container.style.backdropFilter = "blur(3px)"

    const content = document.createElement("div")
    const contentClass = classMerge(
      "h-[20px] flex gap-2 justify-center items-center sticky top-0 bottom-0",
      el.getAttribute("loading-content-class") || ""
    )
    content.classList.add(
      "v-loading__content",
      ...contentClass.split(" ").filter((item) => item)
    )
    container.appendChild(content)

    const spinner = document.createElement("div")
    const spinnerClass = classMerge(
      "animate-spin w-[min(100%,20px)] h-[min(100%,20px)] shrink-0 flex items-center justify-center",
      el.getAttribute("loading-spinner-class") || ""
    )
    spinner.classList.add(
      "v-loading__spinner",
      ...spinnerClass.split(" ").filter((item) => item)
    )
    spinner.innerHTML = loadingSvg
    content.appendChild(spinner)

    const text = document.createElement("div")
    const textClass = classMerge(
      "whitespace-nowrap",
      el.getAttribute("loading-text-class") || ""
    )
    text.classList.add(
      "v-loading__text",
      ...textClass.split(" ").filter((item) => item)
    )
    content.appendChild(text)

    el.appendChild(container)
    el.loadingContainer = container
  }
  const text = el.getAttribute("loading-text")
  const textEl = container.querySelector(".v-loading__text") as HTMLElement
  if (text) {
    textEl.style.display = ""
    textEl.textContent = text
  } else {
    textEl.style.display = "none"
    textEl.textContent = ""
  }

  requestAnimationFrame(() => {
    container.style.opacity = "1"
    container.style.pointerEvents = ""
  })
}

const fadeOut = (el: VLoadingElement) => {
  const container = el.loadingContainer
  if (!container) return
  container.style.opacity = "1"
  container.style.pointerEvents = ""
  requestAnimationFrame(() => {
    container.style.opacity = "0"
    container.style.pointerEvents = "none"
  })
}

const mounted = (el: HTMLElement, binding: { value: boolean }) => {
  const parent = el as VLoadingElement
  const computedStyle = window.getComputedStyle(parent)
  if (parent.defaultPosition === undefined) {
    parent.defaultPosition = computedStyle.position
  }
  if (parent.defaultPointerEvents === undefined) {
    parent.defaultPointerEvents = parent.style.pointerEvents || ""
  }
  if (parent.defaultUserSelect === undefined) {
    parent.defaultUserSelect = parent.style.userSelect || ""
  }
  if (binding?.value) {
    if (parent.transitiontimer) {
      window.clearTimeout(parent.transitiontimer)
      parent.transitiontimer = undefined
    }
    if (!["fixed", "absolute", "relative"].includes(computedStyle.position)) {
      parent.style.position = "relative"
    }
    parent.style.pointerEvents = "none"
    parent.style.userSelect = "none"
    fadeIn(parent)
  } else {
    fadeOut(parent)
    parent.transitiontimer = window.setTimeout(() => {
      const container = parent.loadingContainer
      if (container && container instanceof HTMLElement) {
        container.remove()
      }
      parent.loadingContainer = undefined
      parent.transitiontimer = undefined
      parent.style.position = parent.defaultPosition || ""
      parent.style.pointerEvents = parent.defaultPointerEvents || ""
      parent.style.userSelect = parent.defaultUserSelect || ""
    }, 300)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("loading", {
    mounted,
    updated: mounted,
    getSSRProps: () => undefined
  })
})
