/**
 * Only for DEV
 */
export async function initDevtools() {
  if (import.meta.env.DEV) {
    const { connect } = await import('@vue/devtools')
    connect('http://localhost', 8098)
  }
}
