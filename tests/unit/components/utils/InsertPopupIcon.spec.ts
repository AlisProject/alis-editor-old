import { mount } from '@vue/test-utils'
import InsertPopupIcon from '@/components/utils/InsertPopupIcon.vue'

describe('InsertPopupIcon.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(InsertPopupIcon)
    expect(wrapper.element).toMatchSnapshot()
  })
})
