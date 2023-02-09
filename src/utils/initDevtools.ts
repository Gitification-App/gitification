/**
 * Only for DEV
 */
export async function initDevtools() {
  const { connect } = await import('@vue/devtools')
  connect('http://localhost', 8098)
}
