import { mount, config } from '@vue/test-utils'
import { BlockType } from '~/types/Blocks'
import { createBlock } from '~/utils/createBlock'
import AlisEditor from '../../src/AlisEditor.vue'
config.logModifiedComponents = false

describe('AlisEditor.vue', () => {
  test('can mount', () => {
    const initialState = [createBlock(BlockType.Paragraph, { id: '123Paragraph' })]
    const wrapper = mount(AlisEditor, {
      propsData: {
        initialState,
        config: {
          articleId: '12345',
          preview: '',
          iframelyApikey: '',
          axiosConfig: {
            headers: {
              authorization: ''
            }
          }
        }
      },
      stubs: [
        'EditorBlock',
        'ImageBlock',
        'ShadowInput',
        'AlignLeft',
        'AlignCenter',
        'AlignRight',
        'ParagraphBlock',
        'HeadingBlock',
        'TextBlock',
        'QuoteBlock',
        'TextBlock',
        'RuleBlock',
        'EmbedBlock',
        'InsertButton',
        'InsertButtonIcon',
        'EditorToolbar',
        'ToolbarIcon',
        'InsertPopup',
        'InsertPopupIcon'
      ]
    })
    expect(wrapper.props().initialState).toBe(initialState)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
