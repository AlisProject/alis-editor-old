import { mount } from '@vue/test-utils'
import InsertButtonIcon from '@/components/menu/InsertButtonIcon.vue'

describe('InsertButtonIcon.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(InsertButtonIcon)
    expect(wrapper.element).toMatchSnapshot()
  })
})
