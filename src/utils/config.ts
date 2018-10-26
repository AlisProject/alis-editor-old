import { AlisEditorConfig } from '../types/config'

export const configProps = {
  type: Object as () => AlisEditorConfig,
  default: () => ({
    articleId: '',
    preview: false,
    iframelyApikey: '',
    uploadEndpoint: ''
  })
}
