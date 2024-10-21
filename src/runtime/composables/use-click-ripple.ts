import { unref, watch } from "vue"
import type { Ref, MaybeRef } from "vue"

export default (
  element: Ref<HTMLElement | undefined>,
  config?: {
    type?: MaybeRef<"center" | "click-position">
    size?: MaybeRef<string>
    disabled?: MaybeRef<boolean | undefined>
  }
) => {
  let beforePosition: string | null = null
  let beforeOverflow: string | null = null
  const rippleList: HTMLElement[] = []

  const mousedownHandle = (event: MouseEvent) => {
    if (event.button !== 0) return
    if (unref(config?.disabled)) return
    const el = element.value
    const target = event.target
    if (!el || !target) return
    let type = unref(config?.type)
    if (type !== "center") type = "click-position"

    const computedStyle = window.getComputedStyle(el)
    if (beforePosition === null) beforePosition = el.style.position
    if (beforeOverflow === null) beforeOverflow = el.style.overflow
    if (computedStyle.position === "static") {
      el.style.position = "relative"
    }
    if (computedStyle.overflow !== "hidden" && type !== "center") {
      el.style.overflow = "hidden"
    }

    const elRect = el.getBoundingClientRect()
    let offsetY = 0
    let offsetX = 0
    if (type === "center") {
      offsetY = elRect.height / 2
      offsetX = elRect.width / 2
    } else {
      offsetY = event.clientY - elRect.y
      offsetX = event.clientX - elRect.x
    }

    const sizeStr = unref(config?.size)
    let size = 0
    if (sizeStr) {
      if (sizeStr.endsWith("px")) {
        size = parseFloat(sizeStr.replace(/px$/, ""))
      } else if (sizeStr.endsWith("%")) {
        const parentSize = Math.max(elRect.width, elRect.height)
        size = (parseFloat(sizeStr.replace(/%$/, "")) / 100) * parentSize
      } else if (sizeStr.endsWith("em")) {
        const parentSize = parseFloat(computedStyle.fontSize)
        size = parseFloat(sizeStr.replace(/r?em$/, "")) * parentSize
      } else {
        size = parseFloat(sizeStr)
      }
      if (isNaN(size)) size = 0
    }
    if (!size && type === "center") {
      size = Math.max(elRect.width, elRect.height) + 5
    } else if (!size) {
      const x1 = offsetX ** 2
      const x2 = (elRect.width - offsetX) ** 2
      const y1 = offsetY ** 2
      const y2 = (elRect.height - offsetY) ** 2
      size = Math.sqrt(Math.max(x1 + y1, x2 + y1, x1 + y2, x2 + y2) + 5) * 2
    }

    const ripple = document.createElement("div")

    ripple.style.position = "absolute"
    ripple.style.top = "0"
    ripple.style.left = "0"
    ripple.style.pointerEvents = "none"
    ripple.style.height = `${size}px`
    ripple.style.width = `${size}px`
    ripple.style.borderRadius = "50%"
    const transform = `calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`
    ripple.style.transform = `translate(${transform} scale(0)`
    const duration = Math.min(1500, Math.max((size / 5) * 50, 500))
    const fadeout = 1000
    ripple.style.transition = `transform ${duration}ms ease-out, opacity ${fadeout}ms ease-out, background-color ${duration}ms ease-out`
    ripple.style.backgroundColor = "var(--ripple-color, rgba(0, 0, 0, 0.1))"

    const activeTime = Date.now()
    const done = async () => {
      target.removeEventListener("mouseup", done)
      target.removeEventListener("mouseleave", done)
      const deltaTime = Date.now() - activeTime
      const waitToShow = Math.max(200 - deltaTime, 0)
      if (waitToShow) {
        await new Promise((resolve) => setTimeout(resolve, waitToShow))
      }
      ripple.style.opacity = "0"
      await new Promise((resolve) => setTimeout(resolve, fadeout))
      const index = rippleList.indexOf(ripple)
      ripple?.remove?.()
      if (index !== -1) rippleList.splice(index, 1)
      if (!rippleList.length) {
        el.style.position = beforePosition || ""
        el.style.overflow = beforeOverflow || ""
        beforePosition = null
        beforeOverflow = null
      }
    }

    target.addEventListener("mouseup", done)
    target.addEventListener("mouseleave", done)

    el.appendChild(ripple)
    rippleList.push(ripple)
    requestAnimationFrame(() => {
      if (!ripple) return
      ripple.style.transform = `translate(${transform} scale(1)`
    })
  }

  watch(element, (newVal, oldVal) => {
    if (oldVal) {
      oldVal?.removeEventListener?.("mousedown", mousedownHandle)
    }
    if (newVal) {
      newVal.addEventListener("mousedown", mousedownHandle)
    }
  })

  return { mousedownHandle }
}
