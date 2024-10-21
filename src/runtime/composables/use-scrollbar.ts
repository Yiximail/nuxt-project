import { onBeforeUnmount, onMounted, unref, watch } from "vue"

import type { Ref, MaybeRef } from "vue"
import type VScrollbarBar from "../components/scrollbar/scrollbar-bar.vue"

export default (
  contentRef: Ref<HTMLElement | undefined>,
  viewRef: Ref<HTMLElement | undefined>,
  scrollbars: {
    verticalRef?: Ref<InstanceType<typeof VScrollbarBar> | undefined>
    horizontalRef?: Ref<InstanceType<typeof VScrollbarBar> | undefined>
  },
  threshold: MaybeRef<number> = 20,
  events?: {
    resize?: () => void
    scrollToTop?: () => void
    scrollToBottom?: () => void
  }
) => {
  const checkTopAndBottom = (target: HTMLElement) => {
    const top = target.scrollTop
    const bottom = target.scrollTop + target.clientHeight
    const thresholdVal = unref(threshold)
    if (top <= thresholdVal) {
      events?.scrollToTop?.()
    } else if (bottom >= target.scrollHeight - thresholdVal) {
      events?.scrollToBottom?.()
    }
  }
  const scrollHandle = (ev: Event) => {
    const target = ev.target as HTMLElement | null
    if (!target) return
    const { scrollLeft, scrollTop } = target
    scrollbars.verticalRef?.value?.updateScroll(scrollTop)
    scrollbars.horizontalRef?.value?.updateScroll(scrollLeft)
    if (events) checkTopAndBottom(target)
  }

  let pending = false
  let lastScrollTo: ScrollToOptions
  const scrollTo = (value: ScrollToOptions) => {
    lastScrollTo = value
    if (pending) return
    pending = true
    requestAnimationFrame(() => {
      if (!contentRef.value) return
      contentRef.value.scrollTo(lastScrollTo)
      if (events) checkTopAndBottom(contentRef.value)
      pending = false
    })
  }
  onMounted(() => {
    watch(
      contentRef,
      (newVal, oldVal) => {
        if (oldVal) {
          oldVal.removeEventListener("scroll", scrollHandle)
        }
        if (newVal) {
          newVal.addEventListener("scroll", scrollHandle)
        }
      },
      { immediate: true }
    )
  })

  const resizeCallback = () => {
    if (!contentRef.value) return
    const { clientWidth, clientHeight, scrollWidth, scrollHeight } =
      contentRef.value
    scrollbars.verticalRef?.value?.updateContainer(clientHeight, scrollHeight)
    scrollbars.horizontalRef?.value?.updateContainer(clientWidth, scrollWidth)
    events?.resize?.()
  }

  let observerInstance: ResizeObserver | undefined
  const startObserver = () => {
    if (!observerInstance) {
      observerInstance = new ResizeObserver(resizeCallback)
    }
    if (!contentRef.value || !viewRef.value) return
    observerInstance.observe(contentRef.value)
    observerInstance.observe(viewRef.value)
    resizeCallback()
  }
  const stopObserver = () => {
    observerInstance?.disconnect()
  }

  onMounted(() => {
    startObserver()
  })
  onBeforeUnmount(() => {
    stopObserver()
  })

  return { scrollTo, startObserver, stopObserver }
}
