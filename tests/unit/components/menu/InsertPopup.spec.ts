import { mount } from '@vue/test-utils'
import InsertPopup from '@/components/menu/InsertPopup.vue'

describe('InsertPopup.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(InsertPopup)
    expect(wrapper.element).toMatchSnapshot()
  })
})
