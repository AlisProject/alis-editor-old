import * as SvgIcon from '~/components/vector/SvgIcon'

describe('components/vector/SvgIcon', () => {
  Object.entries(SvgIcon).forEach(([K, V]) => {
    test(K, () => {
      expect(V).toMatchSnapshot()
    })
  })
})
