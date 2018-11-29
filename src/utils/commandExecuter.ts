export function execBold(targetBlock: any) {
  document.execCommand('bold')
}

export function execItalic(targetBlock: any) {
  document.execCommand('italic')
}

export function execQuote(targetBlock: any) {
  toggleFormatBlock('blockquote', targetBlock)
}

export function execHeading(targetBlock: any) {
  toggleFormatBlock('h2', targetBlock)
}

export function execSubHeading(targetBlock: any) {
  toggleFormatBlock('h3', targetBlock)
}

export function execLink(targetBlock: any) {
  document.execCommand('unlink')
  document.execCommand('createLink', true, 'https://example.com')
}

export function toggleFormatBlock(tagName: 'h2' | 'h3' | 'blockquote', targetBlock: any) {
  const target = document.querySelector(`[data-block-id="${(targetBlock || {}).id}"]`)
  if (!target) {
    return
  }
  const h = target.innerHTML
  document.execCommand('formatBlock', true, tagName)
  const executedTarget = document.querySelector(`[data-block-id="${(targetBlock || {}).id}"]`)
  if (!executedTarget) {
    return
  }
  if (h == executedTarget.innerHTML) {
    document.execCommand('formatBlock', true, 'p')
  }
}
