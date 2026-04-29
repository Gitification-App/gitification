const shadow = 'shadow-[0_12px_16px_0_rgba(255,_255,_255,_0.04)_inset,_0_16px_6px_0_rgba(27,_27,_111,_0.02),_0_8px_4px_0_rgba(27,_27,_111,_0.04),_0_4px_4px_0_rgba(27,_27,_111,_0.08),_0_1px_2px_0_rgba(27,_27,_111,_0.10)]'

export const ButtonVariantStyles = {
  primary: {
    bg: 'bg-primary  hover:bg-primary/80',
    fg: 'text-white',
    shadow,
  },
  secondary: {
    bg: 'light:bg-gray-900 light:hover:bg-gray-800 bg-white hover:bg-gray-100/50',
    fg: 'light:text-gray-50 text-gray-950',
    shadow,
  },
  ghost: {
    bg: 'hover:bg-surface-3 focus-visible:bg-surface-3',
    fg: 'text-txt-1 hover:text-txt-2',
    shadow: '',
  },
}

export const PaddingVariantStyles = {
  none: 'p-0',
  sm: 'py-[4px] px-[6px] text-xs',
  md: 'py-[6px] px-[8px] text-sm',
  icon: 'p-[8px] text-[16px] aspect-square',
}
