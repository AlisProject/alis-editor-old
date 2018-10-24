import { mount, config } from '@vue/test-utils'
import EmbedBlock from './EmbedBlock.vue'
import * as BlockTypes from '../../types/Blocks'
config.logModifiedComponents = false

describe('EmbedBlock.vue', () => {
  test('renders correctly', () => {
    const block: BlockTypes.EmbedBlock = {
      id: '123',
      type: BlockTypes.BlockType.Embed,
      payload: {
        src: 'https://twitter.com/_/status/1'
      },
      children: []
    }
    const wrapper = mount(EmbedBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders twitter profile content correctly', () => {
    const block: BlockTypes.EmbedBlock = {
      id: '123',
      type: BlockTypes.BlockType.Embed,
      payload: {
        src: 'https://twitter.com/ALIS_media'
      },
      children: []
    }
    const wrapper = mount(EmbedBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    wrapper.setData({
      html: `<div data-alis-iframely-url="https://twitter.com/alis_media" contenteditable="false">
        <a href="https://twitter.com/alis_media" target="_blank" class="twitter-profile-card">
          <div class="title">ALIS (@ALIS_media) | Twitter</div><div class="description">
            The latest Tweets from ALIS (@ALIS_media). ALIS is social media platform using blockchain. We help people to find trustworthy articles and people quickly.
            ALIS公式アカウントです。日々の活動状況やニュースを発信します。#ALIS $ALIS. Japan
          </div>
          <div class="site">twitter.com</div>
        </a>
      </div>`
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders OGP content correctly', () => {
    const block: BlockTypes.EmbedBlock = {
      id: '123',
      type: BlockTypes.BlockType.Embed,
      payload: {
        src: 'https://alis.to'
      },
      children: []
    }
    const wrapper = mount(EmbedBlock, {
      propsData: {
        block
      },
      stubs: ['ShadowInput']
    })
    wrapper.setData({
      html: `<div data-alis-iframely-url="https://alis.to" contenteditable="false">
        <a href="https://alis.to" target="_blank" class="iframely-embed-card">
          <div class="title">ALIS | 信頼できる記事と人々を明らかにする全く新しいソーシャルメディア</div>
          <div class="description">クリプトの人気記事一覧</div>
          <img src="https://alis.to/d/nuxt/dist/touch-icon.png" class="thumbnail">
          <div class="site">alis.to</div>
        </a>
      </div>`
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
