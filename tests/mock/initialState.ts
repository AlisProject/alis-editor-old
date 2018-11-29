import uuid from 'uuid/v4'
import { BlockType } from '@/types/Blocks'

export default [
  {
    id: uuid(),
    type: BlockType.Paragraph,
    payload: {
      body: `
          <h2>第一章 うさぎの穴をまっさかさま</h2>
          <script>alert(1)</script>
          <h3>第一節 白うさぎ</h3>
          <blockquote>でもそのうさぎがほんとうに、チョッキのポケットから懐中時計かいちゅうどけいをとりだしてそれをながめ、そしてまたあわててかけだしたとき、アリスもとびあがりました。というのも、チョッキのポケットなんかがあるうさぎはこれまで見たことがないし、そこからとりだす時計をもっているうさぎなんかも見たことないぞ、というのに急に気がついたからです。</blockquote>
          <p>でもそのうさぎがほんとうに、チョッキのポケットから懐中時計かいちゅうどけいをとりだしてそれをながめ、</p>
          <p><br></p>
          <p>そしてまたあわててかけだしたとき、アリスもとびあがりました。というのも、チョッキのポケットなんかがあるうさぎはこれまで見たことがないし、</p>
          <p><br></p>
          <p>そこからとりだす時計をもっているうさぎなんかも見たことないぞ、というのに急に気がついたからです。</p>
        `
    }
  },
  {
    id: uuid(),
    type: BlockType.Embed,
    payload: {
      src: 'https://twitter.com/okunokentaro/status/1060774738904014848'
    }
  },
  {
    id: uuid(),
    type: BlockType.Embed,
    payload: {
      src: 'https://gadget-shot.com/review/43122'
    }
  },
  {
    id: uuid(),
    type: BlockType.Paragraph,
    payload: {
      body: '<p>Hello</p>'
    }
  },
  {
    id: '9cf0f329-e53b-4340-a96b-e58a9ef8b61d',
    type: BlockType.Image,
    payload: {
      src: 'https://i.imgur.com/c4zRkB7.png'
    },
    children: []
  },
  {
    id: 'fewaarfa-123rewgrszb-t42qgvzaeg-awetw',
    type: BlockType.Paragraph,
    payload: {
      body: `
          <p>そこで、きょうみしんしんになったアリスは、うさぎのあとを追っかけて野原をよこぎって、それがしげみの下の、おっきなうさぎの穴にとびこむのを、ぎりぎりのところで見つけました。</>'
          <p>http://www.gutenberg.org/ebooks/11</p>
        `
    }
  }
]
