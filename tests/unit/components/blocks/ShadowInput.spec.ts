import { mount } from '@vue/test-utils'
import ShadowInput from '@/components/blocks/ShadowInput.vue'

describe('ShadowInput.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(ShadowInput)
    expect(wrapper.element).toMatchSnapshot()
  })
})
