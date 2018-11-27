import { ParagraphBlock } from '@/types/Blocks'

// Display offset
export function getEditorAreaOffset(viewportW: number, editorW: number, boundingX: number) {
  console.log(`${boundingX} - ((${viewportW} - ${editorW}) * 0.5)`)
  return boundingX - (viewportW - editorW) * 0.5
}

// Element offset
export function getChildrenOffset(el: Node) {
  let i = 0
  const r = (el: Node) => {
    if (el.previousSibling) {
      i++
      r(el.previousSibling)
    }
    return
  }
  r(el)
  return i
}

export function splitBlockContentByOffset(el: HTMLElement, offset: number) {
  let before = ''
  let after = ''
  let i = 0
  const childNodes = el.childNodes
  console.log(childNodes)
  Array.prototype.forEach.call(childNodes, (childNode: any) => {
    console.log(i, offset)
    if (i < offset) {
      before += childNode.outerHTML || childNode.textContent || ''
    } else {
      after += childNode.outerHTML || childNode.textContent || ''
    }
    i++
  })
  return [before, after]
}
