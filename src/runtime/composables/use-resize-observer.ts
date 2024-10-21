import { watch, onMounted, onBeforeUnmount } from "vue"
import type { Ref } from "vue"

export default (el: Ref<HTMLElement|undefined>, cb: ResizeObserverCallback, immediate = true) => {
  let observerInstance: ResizeObserver | undefined
  let observeElement: HTMLElement | undefined

  const observe = (element: HTMLElement) => {
    if (!observerInstance) {
      observerInstance = new ResizeObserver(cb)
    } else if (observeElement) {
      if (observeElement === element) return
      observerInstance.unobserve(observeElement)
    }
    observerInstance.observe(element)
    observeElement = element
  }

  const unobserve = () => {
    observerInstance?.disconnect()
    observeElement = undefined
  }

  const start = () => {
    if (el.value) observe(el.value)
  }
  const stop = () => {
    unobserve()
  }

  onMounted(() => {
    watch(el, (val) => {
      if (val) {
        observe(val)
      } else {
        unobserve()
      }
    }, { immediate })
  })
  onBeforeUnmount(() => {
    observerInstance?.disconnect()
  })

  return {
    start,
    stop
  }
}
