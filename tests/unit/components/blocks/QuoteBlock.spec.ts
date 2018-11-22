import { mount, config } from '@vue/test-utils'
import QuoteBlock from '@/components/blocks/QuoteBlock.vue'
import * as BlockTypes from '@/types/Blocks'
config.logModifiedComponents = false

describe('QuoteBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.QuoteBlock = {
      id: '123',
      type: BlockTypes.BlockType.Quote,
      payload: {
        body: 'foo'
      }
    }
    const wrapper = mount(QuoteBlock, {
      propsData: {
        block
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders correctly (preview mode)', () => {
    const block: BlockTypes.QuoteBlock = {
      id: '123',
      type: BlockTypes.BlockType.Quote,
      payload: {
        body: 'foo'
      }
    }
    const wrapper = mount(QuoteBlock, {
      propsData: {
        block,
        preview: true
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
