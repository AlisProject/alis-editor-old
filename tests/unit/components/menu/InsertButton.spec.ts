import { mount } from '@vue/test-utils'
import InsertButton from '@/components/menu/InsertButton.vue'

describe('InsertButton.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(InsertButton)
    expect(wrapper.element).toMatchSnapshot()
  })
})
