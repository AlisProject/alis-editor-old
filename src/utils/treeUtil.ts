import { Block, BlockType } from '../types/Blocks'
import { cloneDeep } from 'lodash'
import { isContentEditableBlock } from './createBlock'

export function findBeforeRootContentByRootBlockId(id: string, blocks: Block[]): Block | null {
  return (result => (result.found ? result.block : null))(
    blocks.reduce(
      (before: any, after: Block) => {
        return (before || {}).found
          ? before
          : after.id === id
          ? { found: true, block: before.block }
          : { found: false, block: after }
      },
      { found: false, block: null }
    )
  )
}

export function findRootIdByBlockId(id: string, blocks: Block[]) {
  if (blocks.find((block: Block) => block.id === id)) {
    return blocks.find((block: Block) => block.id === id)!.id
  }

  let foundBlock = false

  const findContent = (parent: Block): boolean => {
    if (foundBlock) return false
    if (parent.id === id) {
      foundBlock = true
      return true
    }
    if (parent.children && parent.children.length) {
      return !!parent.children.find(c => findContent(c))
    }
    return false
  }
  const content = blocks.find(b => findContent(b))
  return content ? content.id : false
}

export function findTreeContentById(id: string, blocks: Block[]) {
  let foundBlock = false
  let content: any = null

  const findContent = (parent: Block) => {
    if (foundBlock) return
    if (parent.id === id) {
      content = { ...parent } as Block
      foundBlock = true
      return
    }
    if (parent.children && parent.children.length) {
      parent.children.forEach(c => findContent(c))
    }
  }
  blocks.forEach(b => findContent(b))
  return content ? (content as Block) : false
}

export function applyTreeById(id: string, newBlock: Block, blocks: Block[]) {
  let foundBlock = false

  const recursion = (parent: Block) => {
    if (foundBlock) return parent
    if (parent.id === id) {
      parent = cloneDeep({ ...newBlock })
      foundBlock = true
      return parent
    }
    if (parent.children && parent.children.length) {
      parent.children = parent.children.map(c => recursion(c))
    }
    return parent
  }

  return blocks.map(block => recursion(block))
}

export function deleteTreeContentById(id: string, blocks: Block[]) {
  const parentBlocks = blocks.filter(b => b.id !== id)
  if (parentBlocks.length !== blocks.length) {
    return parentBlocks
  }

  let foundBlock = false
  const recursion = (parent: Block) => {
    if (foundBlock) return true
    if (parent.id === id) {
      foundBlock = true
      return false
    }
    if (parent.children && parent.children.length) {
      parent.children = parent.children.filter(c => recursion(c))
    }
    return true
  }

  if (!foundBlock) {
    return blocks.map(b => b)
  }

  return blocks
    .map((block: Block) => {
      if (block.children && block.children.length) {
        block.children = block.children.filter(c => recursion(c))
      }
      return block
    })
    .filter((block: Block) => {
      if (isContentEditableBlock(block) && !block.children!.length) {
        return false
      }
      return true
    })
}
