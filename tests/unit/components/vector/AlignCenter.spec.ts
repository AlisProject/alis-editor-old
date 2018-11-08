import { mount } from '@vue/test-utils'
import AlignCenter from '@/components/vector/AlignCenter.vue'

describe('AlignCenter.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(AlignCenter)
    expect(wrapper.element).toMatchSnapshot()
  })
})
