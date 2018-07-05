import { mount } from 'vue-test-utils'
import AlisEditor from './'

test('it works', () => {
  const wrapper = mount(AlisEditor)
  expect(wrapper.isVueInstance()).toBe(true)
})
