import { mount, config } from '@vue/test-utils'
import EmbedBlock from './EmbedBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('EmbedBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.EmbedBlock = {
      id: '123',
      type: BlockTypes.BlockType.Embed,
      payload: {
        src: 'https://twitter.com/_/status/1'
      },
      children: []
    }
    const wrapper = mount(EmbedBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
