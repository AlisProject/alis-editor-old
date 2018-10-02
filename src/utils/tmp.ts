// PC処理の名残の一時置き場

// handleKeydownEnter(id: string, event: KeyboardEvent) {
//   const target = event.target as HTMLInputElement
//   if (event.keyCode === 229 || event.shiftKey || (!target.classList.contains('shadow-input') && isMobile())) {
//     return
//   }

//   event.preventDefault()
//   let body = ''
//   if (target.tagName === 'TEXTAREA' && id) {
//     const block = findTreeContentById(id, this.store.state.blocks)
//     if (block) {
//       body = block.payload.body.slice(target.selectionStart, block.payload.body.length)
//       block.payload.body = block.payload.body.slice(0, target.selectionStart)
//       this.updateBlock(block)
//     }
//   }
// }

// injectTextArea(event: KeyboardEvent, idx: number) {
//   const targetDOM = this.$el.querySelector(':focus')! as HTMLInputElement
//   const { selectionStart: beforeSelectionStart, selectionEnd: beforeSelectionEnd } = targetDOM
//   setTimeout(() => {
//     const isDeleteOrLeftByTextStart = event.keyCode === 8 || event.keyCode === 37
//     const isTopByFirstLine = event.keyCode === 38 && beforeSelectionStart !== 0

//     const isRightByTextEnd = event.keyCode === 39 && beforeSelectionEnd === targetDOM.value.length
//     const isBottomByLastLine =
//       event.keyCode === 40 &&
//       (beforeSelectionEnd !== targetDOM.value.length ||
//         (beforeSelectionEnd === targetDOM.value.length && targetDOM.selectionEnd === targetDOM.value.length))

//     // 前のブロックにフォーカスを動かす処理
//     if (isDeleteOrLeftByTextStart || isTopByFirstLine) {
//       if (targetDOM.selectionStart === 0 && idx != 0) {
//         this.setFocus(idx - 1)
//         const ta = this.getTargetTextArea(idx - 1)
//         ta.setSelectionRange(ta.value.length, ta.value.length)
//       }
//       return
//     }

//     // 次のブロックにフォーカスを動かす処理
//     if (isRightByTextEnd || isBottomByLastLine) {
//       if (targetDOM.selectionEnd === targetDOM.value.length && idx + 1 < this.store.state.blocks.length) {
//         this.setFocus(idx + 1)
//         const ta = this.getTargetTextArea(idx + 1)
//         ta.setSelectionRange(0, 0)
//       }
//     }
//   }, 20)
// },
