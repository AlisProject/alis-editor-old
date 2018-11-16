import { Block } from '../types/Blocks'

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
    const node = el.childNodes[el.childNodes.length - 1]
    const textNode = node.childNodes[node.childNodes.length - 1]
    if (!node || !textNode) {
      return false
    }
    selection.removeAllRanges()
    range.setStart(textNode, (textNode.textContent || '').length)
    range.setEnd(textNode, (textNode.textContent || '').length)
    range.collapse(true)
    selection.addRange(range)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
