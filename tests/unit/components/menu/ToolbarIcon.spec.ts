import { mount } from '@vue/test-utils'
import ToolbarIcon from '@/components/menu/ToolbarIcon.vue'

describe('ToolbarIcon.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(ToolbarIcon)
    expect(wrapper.element).toMatchSnapshot()
  })
})
