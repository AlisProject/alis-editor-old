import { mount, config } from '@vue/test-utils'
import QuoteBlock from './QuoteBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('QuoteBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.QuoteBlock = {
      id: '123',
      type: BlockTypes.BlockType.Quote,
      children: []
    }
    const wrapper = mount(QuoteBlock, {
      propsData: {
        block
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
