export function isYouTubeVideoURL(url: string) {
  // 参考：
  // https://github.com/itteco/iframely/blob/ef79303fdd8400ca958827a787a3f18bb9044073/plugins/domains/youtube.com/youtube.video.js
  const regexes = [
    /^https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\/?\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/youtu.be\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\/?\?v=([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube-nocookie\.com\/(?:v|embed)\/([a-zA-Z0-9_-]+)/i
  ]
  const isYouTubeVideoURL = regexes.some(regex => regex.test(url))

  return isYouTubeVideoURL
}

export function isFacebookPostURL(url: string) {
  // 参考：
  // https://github.com/itteco/iframely/blob/bba8b566dc7158e3ab8a59e4665a0b1d32805030/plugins/domains/facebook.com/facebook.post.js
  const regexes = [
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/(permalink|story)\.php\?[^/]+(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\.php\?fbid=(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9.-]+)\/(posts|activity)\/(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9.-]+)\/photos\/[^/]+\/(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/notes\/([a-zA-Z0-9.-]+)\/[^/]+\/(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/media\/set\/\?set=[^/]+(\d{10,})/i
  ]
  const isFacebookPostURL = regexes.some(regex => regex.test(url))

  return isFacebookPostURL
}

export function isInstagramURL(url: string) {
  // 参考：
  // https://github.com/itteco/iframely/blob/245043afd1698d88f1ed05c6b7b075148aca1841/plugins/domains/instagram.com.js
  const regexes = [
    /^https?:\/\/(?:www.)?instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)\/?/i,
    /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)$/i
  ]
  const isInstagramURL = regexes.some(regex => regex.test(url))

  return isInstagramURL
}

export function getIframelyHtml(url: string) {
  const isTwitterResource = url === 'https://twitter.com' || url.startsWith('https://twitter.com/')
  const isTweet = isTwitterResource && url.split('/')[4] === 'status'
  const isGistResource = url.startsWith('https://gist.github.com/')
  const isYouTubeResource = isYouTubeVideoURL(url)
  const isFacebookResource = isFacebookPostURL(url)
  const isInstagramResource = isInstagramURL(url)
}

export function getIframelyUrlTemplate(url: string) {
  // This method returns DOM string like this.
  //
  // `<br>
  // <div data-alis-iframely-url="${url}" contenteditable="false">
  //   <a href="${url}" data-iframely-url></a>
  // </div>
  // <br>`

  const wrapperElement = document.createElement('div')
  wrapperElement.setAttribute('data-alis-iframely-url', url)
  wrapperElement.setAttribute('contenteditable', 'false')

  const anchorElement = document.createElement('a')
  anchorElement.setAttribute('href', url)
  anchorElement.setAttribute('data-iframely-url', '')

  wrapperElement.appendChild(anchorElement)

  const div = document.createElement('div')

  div.appendChild(document.createElement('br'))
  div.appendChild(wrapperElement)
  div.appendChild(document.createElement('br'))

  return div.innerHTML
}
