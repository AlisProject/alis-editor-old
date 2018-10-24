import { mount, config } from '@vue/test-utils'
import EditorBlock from './EditorBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('EditorBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.Block = {
      id: '123',
      type: BlockTypes.BlockType.Paragraph,
      payload: {
        body: '<p>foo</p>'
      }
    }
    const wrapper = mount(EditorBlock, {
      propsData: {
        block
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
