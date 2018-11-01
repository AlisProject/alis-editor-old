import { mount, config } from '@vue/test-utils'
import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import * as BlockTypes from '@/types/Blocks'
config.logModifiedComponents = false

describe('HeadingBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.HeadingBlock = {
      id: '123',
      type: BlockTypes.BlockType.Heading,
      payload: {
        size: 'h2',
        body: 'foo'
      },
      children: []
    }
    const wrapper = mount(HeadingBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders correctly (preview mode)', () => {
    const block: BlockTypes.HeadingBlock = {
      id: '123',
      type: BlockTypes.BlockType.Heading,
      payload: {
        size: 'h2',
        body: 'foo'
      },
      children: []
    }
    const wrapper = mount(HeadingBlock, {
      propsData: {
        block,
        preview: true
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
