import { mount } from '@vue/test-utils'
import AlignLeft from '@/components/vector/AlignLeft.vue'

describe('AlignLeft.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(AlignLeft)
    expect(wrapper.element).toMatchSnapshot()
  })
})
