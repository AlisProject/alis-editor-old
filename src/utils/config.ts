import { AlisEditorConfig } from '../types/Config'

export const configProps = {
  type: Object as () => AlisEditorConfig,
  default: () => ({
    articleId: '',
    preview: false,
    iframelyApikey: '',
    uploadEndpoint: '',
    axiosConfig: {}
  })
}
