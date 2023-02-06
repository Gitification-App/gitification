/**
 * Only for DEV
 */
export async function initDevtools() {
  if (import.meta.env.DEV) {
    const { connect } = await import('@vue/devtools')
    connect('http://localhost', 8098)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://localhost:8098'
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}
