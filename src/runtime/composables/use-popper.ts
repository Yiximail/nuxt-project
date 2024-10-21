import {
  computePosition,
  size,
  arrow,
  offset,
  shift,
  flip,
  autoPlacement,
  autoUpdate
} from "@floating-ui/dom"
import { ref } from "vue"
// import useZIndex from "./use-z-index"

import type { CSSProperties, Ref } from "vue"
import type { Middleware, MiddlewareState } from "@floating-ui/dom"
import type { PopperProps } from "../types"

export default (
  referenceRef: Ref<HTMLElement | SVGElement | undefined>,
  popperRef: Ref<HTMLElement | undefined>,
  arrowRef: Ref<HTMLElement | undefined>,
  props: {
    strategy: PopperProps["strategy"]
    inheritWidth: PopperProps["inheritWidth"]
    placement: PopperProps["placement"]
    placementStrategy: PopperProps["placementStrategy"]
    offset: PopperProps["offset"]
    padding: PopperProps["padding"]
    arrow: PopperProps["arrow"]
    arrowPadding: PopperProps["arrowPadding"]
  }
) => {
  let middlewareState: MiddlewareState | undefined
  const popperStyles = ref<CSSProperties>()
  const arrowStyles = ref<CSSProperties>()

  let status: "show" | "showed" = "show"
  let inited = false
  let showCallback: (() => void) | undefined

  const arrowSize = 8
  const arrowDelta = (arrowSize / 2) * Math.SQRT2

  const listenerMiddleware: () => Middleware = () => ({
    name: "listener",
    fn: async (state: MiddlewareState) => {
      middlewareState = state
      if (status === "show") {
        // 初始化，content的transform origin会判断错误，动画方向错误
        if (!inited) {
          inited = true
          return {}
        }
        status = "showed"
        showCallback?.()
      }
      return {}
    }
  })

  const getArrowOffset = () => {
    if (!middlewareState) return undefined
    const { floating, reference } = middlewareState.rects
    const { x, y, placement } = middlewareState
    const padding = props.arrowPadding ?? 0
    if (/top|bottom/.test(placement)) {
      const min = reference.x + padding
      const max = reference.x + reference.width - padding
      const floatingCenter = x + floating.width / 2
      if (x + floating.width < min || x > max) return undefined
      let delta = 0
      if (floatingCenter < min) delta = min - floatingCenter
      if (floatingCenter > max) delta = max - floatingCenter
      return (floating.width / 2 + delta - arrowDelta).toFixed(3)
    } else {
      const min = reference.y + padding
      const max = reference.y + reference.height - padding
      const floatingCenter = y + floating.height / 2
      if (y + floating.height < min || y > max) return undefined
      let delta = 0
      if (floatingCenter < min) delta = min - floatingCenter
      if (floatingCenter > max) delta = max - floatingCenter
      return (floating.height / 2 + delta - arrowDelta).toFixed(3)
    }
  }

  const updatePosition = () => {
    if (!referenceRef.value || !popperRef.value) return
    const middleware = [
      shift(),
      autoPlacement({
        allowedPlacements: Array.isArray(props.placement)
          ? props.placement
          : props.placement
            ? [props.placement]
            : undefined
      })
    ]
    // 箭头 、 偏移
    if (arrowRef.value && props.arrow) {
      middleware.push(
        arrow({ element: arrowRef.value, padding: props.arrowPadding })
      )
      middleware.unshift(offset((props.offset ?? 0) + arrowDelta + 1))
    } else {
      middleware.unshift(offset((props.offset ?? 0) + 1))
    }
    // 继承宽度
    if (props.inheritWidth) {
      middleware.unshift(
        size({
          apply ({ rects, elements }) {
            const width = `${rects.reference.width}px`
            Object.assign(elements.floating.style, { width })
          }
        })
      )
    }
    // 反转条件
    const placementList = Array.isArray(props.placement)
      ? props.placement
      : props.placement
        ? [props.placement]
        : undefined
    if (props.placementStrategy === "flip") {
      middleware.push(flip({ fallbackPlacements: placementList }))
    } else {
      middleware.push(autoPlacement({ allowedPlacements: placementList }))
    }
    // listener
    middleware.push(listenerMiddleware())

    computePosition(referenceRef.value, popperRef.value, {
      strategy: props.strategy,
      placement: placementList ? placementList[0] : undefined,
      middleware
    }).then((data) => {
      let transformOrigin = "center"
      const offset = getArrowOffset()
      if (offset === undefined) {
        // pass
      } else if (data.placement.includes("top")) {
        transformOrigin = `${offset}px 100%`
      } else if (data.placement.includes("bottom")) {
        transformOrigin = `${offset}px 0%`
      } else if (data.placement.includes("left")) {
        transformOrigin = `100% ${offset}px`
      } else if (data.placement.includes("right")) {
        transformOrigin = `0% ${offset}px`
      }
      popperStyles.value = {
        position: data.strategy,
        top: 0,
        left: 0,
        transform: `translate(${data.x}px, ${data.y}px)`,
        "--popper-transform-origin": transformOrigin
      }
      popperRef.value?.setAttribute("data-popper-placement", data.placement)
      if (data.middlewareData.arrow) {
        const { x, y } = data.middlewareData.arrow
        const styles = {} as CSSProperties
        const offsetX = x ?? 0
        const offsetY = y ?? 0
        switch (true) {
          case offset === undefined:
            styles.opacity = 0
            break
          case data.placement.includes("top"):
            styles.bottom = 0
            styles.left = 0
            styles.transform = `translate(${offset}px, ${offsetY + arrowDelta - 1}px) rotate(-45deg)`
            break
          case data.placement.includes("bottom"):
            styles.top = 0
            styles.left = 0
            styles.transform = `translate(${offset}px, ${offsetY - arrowDelta + 1}px) rotate(135deg)`
            break
          case data.placement.includes("left"):
            styles.top = 0
            styles.right = 0
            styles.transform = `translate(${offsetX + arrowDelta - 1}px, ${offset}px) rotate(-135deg)`
            break
          case data.placement.includes("right"):
            styles.top = 0
            styles.left = 0
            styles.transform = `translate(${offsetX - arrowDelta + 1}px, ${offset}px) rotate(45deg)`
            break
        }
        arrowStyles.value = {
          position: "absolute",
          height: `${arrowSize}px`,
          width: `${arrowSize}px`,
          pointerEvents: "none",
          background:
            "linear-gradient(45deg,var(--popper-border),var(--popper-border) 50%,transparent 51%,transparent)",
          borderRadius: "20%",
          ...styles
        }
      }
    })
  }

  let cleanup: (() => void) | undefined
  const initPopper = (show: () => void) => {
    if (cleanup) cleanup()
    if (!referenceRef.value || !popperRef.value) return
    status = "show"
    showCallback = show
    cleanup = autoUpdate(referenceRef.value, popperRef.value, updatePosition)
  }
  return {
    popperStyles,
    arrowStyles,
    initPopper,
    cleanup,
    updatePosition
  }
}
