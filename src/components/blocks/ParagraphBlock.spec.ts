import { mount, config } from '@vue/test-utils'
import ParagraphBlock from './ParagraphBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('ParagraphBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.ParagraphBlock = {
      id: '123',
      type: BlockTypes.BlockType.Paragraph,
      payload: {
        body: 'foo'
      }
    }
    const wrapper = mount(ParagraphBlock, {
      propsData: {
        block
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders correctly (preview mode)', () => {
    const block: BlockTypes.ParagraphBlock = {
      id: '123',
      type: BlockTypes.BlockType.Paragraph,
      payload: {
        body: 'foo'
      }
    }
    const wrapper = mount(ParagraphBlock, {
      propsData: {
        block,
        preview: true
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
