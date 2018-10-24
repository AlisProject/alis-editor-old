import { mount,config } from '@vue/test-utils'
import RuleBlock from './RuleBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('RuleBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.RuleBlock = {
      id: '123',
      type: BlockTypes.BlockType.Rule
    }
    const wrapper = mount(RuleBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper).toMatchSnapshot()
  })

  test('renders correctly(preview mode)', () => {
    const block: BlockTypes.RuleBlock = {
      id: '123',
      type: BlockTypes.BlockType.Rule
    }
    const wrapper = mount(RuleBlock, {
      propsData: {
        block,
        preview: true
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper).toMatchSnapshot()
  })
})
