export function isMobile() {
  return matchMedia('(max-width: 768px)').matches
}
export function isDesktop() {
  return matchMedia('(min-width: 768px)').matches
}
