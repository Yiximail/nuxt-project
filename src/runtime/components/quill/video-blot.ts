import { BlockEmbed } from "quill/blots/block"

export default class VideoBlot extends BlockEmbed {
  static override blotName = "video"
  static override tagName = "video"

  static override create (url: string) {
    const node = super.create() as HTMLVideoElement
    node.setAttribute("src", url)
    node.setAttribute("controls", "true")
    return node
  }

  static override formats (node: HTMLElement) {
    const format = {} as Record<string, unknown>
    node.style.margin = "0 auto"
    return format
  }

  static override value (node: HTMLElement) {
    return node.getAttribute("src")
  }

  override format (name: string, value: string) {
    if (name === "height" || name === "width") {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}
