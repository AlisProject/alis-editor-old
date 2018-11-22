import { Block } from '../types/Blocks'

interface ElementSubset {
  childNodes: any[]
  children: any[]
}

export function getEndNodeByElement(el: ElementSubset): ChildNode {
  if (!el.children) {
    throw new Error('first argument object must have "children" array property')
  }
  return el.children.length
    ? getEndNodeByElement(el.children[el.children.length - 1])
    : el.childNodes[el.childNodes.length - 1]
}

// 対象の要素が見つからないなどでエラーとなった場合は false を返す
export function selectContentEditableFirstCharFromBlock(block: Block): boolean {
  const el = document.querySelector(`[data-block-id="${block.id}"] .target`)
  if (!el) return false
  try {
    const range = document.createRange()
    const sel = window.getSelection()
    range.setStart(el.childNodes[0], 0)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

// 対象の要素が見つからないなどでエラーとなった場合は false を返す
export function selectContentEditableLastCharFromBlock(block: Block): boolean {
  const el = document.querySelector(`[data-block-id="${block.id}"] .target`)
  if (!el) return false
  try {
    const range = document.createRange()
    const selection = window.getSelection()
    const node = getEndNodeByElement(el as any)
    if (!node) {
      return false
    }
    selection.removeAllRanges()
    range.setStart(node, (node.textContent || '').length)
    range.setEnd(node, (node.textContent || '').length)
    range.collapse(true)
    selection.addRange(range)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
