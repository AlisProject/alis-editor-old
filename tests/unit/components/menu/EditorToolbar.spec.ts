import { mount } from '@vue/test-utils'
import EditorToolbar from '@/components/menu/EditorToolbar.vue'

describe('EditorToolbar.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(EditorToolbar, {
      propsData: {
        isSaving: false,
        hasactive: true,
        activeRoot: {
          id: '123',
          type: 'Paragraph',
          payload: {
            body: ''
          }
        }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
