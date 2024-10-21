import { defineNuxtPlugin } from "#imports"

// interface VClickRippleElement extends HTMLElement {
//   rippleMousedown?: (event: MouseEvent) => void
// }

// const mousedownHandle = (event: MouseEvent, el: HTMLElement) => {
//   if (event.button !== 0) return
//   let type = el.getAttribute("ripple-type")
//   if (type !== "center") type = "click-position"
//   let rippleClass = el.getAttribute("ripple-class")
//   if (!rippleClass) rippleClass = "bg-natural-900/[.1] dark:bg-natural-100/[.1]"

//   const rippleSize = el.getAttribute("ripple-size")
//   let size = rippleSize ? parseInt(rippleSize) : undefined

//   const computedStyle = window.getComputedStyle(el)
//   const position = el.style.position
//   const overflow = el.style.overflow
//   if (computedStyle.position === "static") {
//     el.style.position = "relative"
//   }
//   if (computedStyle.overflow !== "hidden" && type !== "center") {
//     el.style.overflow = "hidden"
//   }

//   const elRect = el.getBoundingClientRect()
//   let offsetY = event.clientY - elRect.y
//   let offsetX = event.clientX - elRect.x
//   if (type === "center") {
//     offsetY = elRect.height / 2
//     offsetX = elRect.width / 2
//   }

//   if (!size && type === "center") {
//     size = Math.max(elRect.width, elRect.height) + 5
//   } else if (!size) {
//     const x1 = offsetX ** 2
//     const x2 = (elRect.width - offsetX) ** 2
//     const y1 = offsetY ** 2
//     const y2 = (elRect.height - offsetY) ** 2
//     size = Math.sqrt(Math.max(x1 + y1, x2 + y1, x1 + y2, x2 + y2) + 5)
//   }

//   const ripple = document.createElement("div")
//   ripple.classList.add("v-click-ripple")
//   ripple.classList.add(...rippleClass.split(" "))

//   ripple.style.position = "absolute"
//   ripple.style.top = "0"
//   ripple.style.left = "0"
//   ripple.style.pointerEvents = "none"
//   ripple.style.height = `${size * 2}px`
//   ripple.style.width = `${size * 2}px`
//   ripple.style.borderRadius = "50%"
//   ripple.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0)`
//   const duration = Math.min(1500, Math.max((size / 5) * 50, 500))
//   ripple.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease, background-color ${duration}ms ease`

//   const done = () => {
//     ripple.style.opacity = "0"
//     el.removeEventListener("mouseup", done)
//     el.removeEventListener("mouseleave", done)
//     setTimeout(() => {
//       ripple?.remove?.()
//       if (el.querySelector(".v-click-ripple") === null) {
//         el.style.position = position
//         el.style.overflow = overflow
//       }
//     }, duration + 50)
//   }
//   el.addEventListener("mouseup", done)
//   el.addEventListener("mouseleave", done)

//   el.appendChild(ripple)
//   requestAnimationFrame(() => {
//     ripple.style.transform = `translate(${offsetX - size}px, ${offsetY - size}px) scale(1)`
//   })
// }

// const mounted = (el: HTMLElement, binding: { value: boolean }) => {
//   const element = el as VClickRippleElement
//   if (element.rippleMousedown) {
//     el.removeEventListener("mousedown", element.rippleMousedown)
//     delete element.rippleMousedown
//   }
//   if (binding?.value === false) return
//   element.rippleMousedown = (event: MouseEvent) => mousedownHandle(event, el)
//   el.addEventListener("mousedown", element.rippleMousedown)
// }

// const beforeUnmount = (el: HTMLElement) => {
//   const element = el as VClickRippleElement
//   if (element.rippleMousedown) {
//     el.removeEventListener("mousedown", element.rippleMousedown)
//     delete element.rippleMousedown
//   }
// }

export default defineNuxtPlugin(() => {
  // nuxtApp.vueApp.directive("ripple", {
  //   mounted,
  //   updated: mounted,
  //   beforeUnmount
  // })
})
