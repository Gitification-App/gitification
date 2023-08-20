import { type AlignedPlacement, type Side, type WowerlayTransitionFn } from 'wowerlay'

export const transformOriginMap: Record<AlignedPlacement | Side, string> = {
  'bottom-end': 'right top',
  'bottom-start': 'left top',
  'bottom': 'center top',
  'left-end': 'right bottom',
  'left-start': 'right top',
  'left': 'right center',
  'right-end': 'left bottom',
  'right-start': 'left top',
  'right': 'left center',
  'top-end': 'right bottom',
  'top-start': 'left bottom',
  'top': 'center bottom',
}

export const handleTransition: WowerlayTransitionFn = (type, element, done) => {
  const placement = element.getAttribute('data-popover-placement') as AlignedPlacement | Side
  const side = placement.split('-')[0] as Side

  const vertical = side === 'top' || side === 'bottom'
  const transformFunction = vertical ? 'translateY' : 'translateX'

  const from = {
    transform: `scale(0.97) ${transformFunction}(${side === 'bottom' || side === 'right' ? '-3px' : '3px'})`,
    opacity: 0,
  }

  const to = {
    transform: `scale(1) ${transformFunction}(0px)`,
    opacity: 1,
  }

  const oldTransformOrigin = element.style.transformOrigin
  element.style.transformOrigin = transformOriginMap[placement]

  if (type === 'leave') {
    const background = element.parentElement
    if (background) {
      background.style.setProperty('pointer-events', 'none')
      element.style.setProperty('pointer-events', 'auto')
    }
  }

  const animation = element.animate(type === 'enter' ? [from, to] : [to, from], {
    duration: 200,
    easing: 'ease',
  })

  animation.onfinish = () => {
    if (type === 'enter')
      element.style.transformOrigin = oldTransformOrigin

    done()
  }
}
