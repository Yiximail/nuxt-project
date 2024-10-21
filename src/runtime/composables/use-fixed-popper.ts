export default () => {
  const preventScroll = (event: Event) => {
    event.preventDefault()
  }

  const register = () => {
    window.addEventListener("scroll", preventScroll, {
      passive: false
    })
  }

  const unregister = () => {
    window.removeEventListener("scroll", preventScroll)
  }

  return { register, unregister }
}
