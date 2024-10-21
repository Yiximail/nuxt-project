import { Fragment, createTextVNode, Comment } from "vue"
import type { VNodeChild, VNode } from "vue"

export const getNodes = (
  nodes: VNodeChild[]
): VNode[] => {
  const results: VNode[] = []
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]
    if (!node) continue
    if (typeof node === "string" || typeof node === "number") {
      results.push(createTextVNode(String(node)))
      continue
    }
    if (typeof node !== "object") continue
    if (Array.isArray(node)) {
      results.push(...getNodes(node))
      continue
    }
    if (node.type === Comment) continue
    if (node.type === Fragment) {
      if (!node.children) continue
      if (Array.isArray(node.children)) {
        results.push(...getNodes(node.children))
      }
    } else {
      results.push(node)
    }
  }
  return results
}
