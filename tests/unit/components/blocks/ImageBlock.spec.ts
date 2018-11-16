import { mount, config } from '@vue/test-utils'
import ImageBlock from '@/components/blocks/ImageBlock.vue'
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
        },
        axiosConfig: {}
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders correctly (preview mode)', () => {
    const wrapper = mount(ImageBlock, {
      propsData: {
        block: {
          id: '123',
          type: 'Image',
          payload: {
            src: 'https://github.com/potato4d.png'
          }
        },
        axiosConfig: {},
        preview: true
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
