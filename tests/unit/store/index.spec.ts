import { EditorStore } from '../../../src/store/'

describe('store/index.ts', () => {
  describe('the state when the instance was created', () => {
    it('should be mounted based on initialState', () => {
      const initialState = { isSaving: false, blocks: [] }
      const store = new EditorStore(initialState)
      expect(store.state).toMatchObject(initialState)
    })
  })
  describe('.blocks', () => {
    it('should be consistent with state.blocks', () => {
      const initialState = { isSaving: false, blocks: [] }
      const store = new EditorStore(initialState)
      expect(store.blocks).toBe(store.state.blocks)
    })
  })
  describe('.isSaving', () => {
    it('should be consistent with state.isSaving', () => {
      const initialState = { isSaving: false, blocks: [] }
      const store = new EditorStore(initialState)
      expect(store.isSaving).toBe(store.state.isSaving)
    })
  })
  describe('.setIsSaving', () => {
    describe('call with true', () => {
      describe('.isSaving', () => {
        it('should be true', () => {
          const initialState = { isSaving: false, blocks: [] }
          const store = new EditorStore(initialState)
          store.setIsSaving(true)
          expect(store.state.isSaving).toBe(true)
        })
      })
    })
    describe('call with false', () => {
      describe('.isSaving', () => {
        it('should be false', () => {
          const initialState = { isSaving: false, blocks: [] }
          const store = new EditorStore(initialState)
          store.setIsSaving(false)
          expect(store.state.isSaving).toBe(false)
        })
      })
    })
  })
})
