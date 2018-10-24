import { mount, config } from '@vue/test-utils'
import ImageBlock from './ImageBlock.vue'
config.logModifiedComponents = false

describe('ImageBlock.vue', () => {
  test('renders correctly', () => {
    const wrapper = mount(ImageBlock, {
      propsData: {
        block: {
          id: '123',
          type: 'Image',
          payload: {
            src: 'https://github.com/potato4d.png'
          }
        }
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})