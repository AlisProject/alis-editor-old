import { mount } from '@vue/test-utils'
import AlignRight from '@/components/vector/AlignRight.vue'

describe('AlignRight.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(AlignRight)
    expect(wrapper.element).toMatchSnapshot()
  })
})
