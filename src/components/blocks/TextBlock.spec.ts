import { mount, config } from '@vue/test-utils'
import TextBlock from './TextBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('TextBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.TextBlock = {
      id: '123',
      type: BlockTypes.BlockType.Text,
      payload: {
        body: 'foo'
      }
    }
    const wrapper = mount(TextBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders correctly (preview mode)', () => {
    const block: BlockTypes.TextBlock = {
      id: '123',
      type: BlockTypes.BlockType.Text,
      payload: {
        body: 'foo'
      }
    }
    const wrapper = mount(TextBlock, {
      propsData: {
        block,
        preview: true
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
