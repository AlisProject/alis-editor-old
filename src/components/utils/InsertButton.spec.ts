import { mount } from '@vue/test-utils'
import InsertButton from './InsertButton.vue'

describe('InsertButton.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(InsertButton)
    expect(wrapper.element).toMatchSnapshot()
  })
})
