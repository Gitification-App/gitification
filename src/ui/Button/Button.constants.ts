export const ButtonVariantStyles = {
  primary: {
    bg: 'bg-primary-500 hover:bg-primary-400',
    fg: 'text-primary-50',
    shadow: 'shadow-[0_12px_16px_0_rgba(255,_255,_255,_0.04)_inset,_0_16px_6px_0_rgba(27,_27,_111,_0.02),_0_8px_4px_0_rgba(27,_27,_111,_0.04),_0_4px_4px_0_rgba(27,_27,_111,_0.08),_0_1px_2px_0_rgba(27,_27,_111,_0.10)]',
  },
  dark: {
    bg: 'bg-gray-900 hover:bg-gray-800',
    fg: 'text-gray-50',
    shadow: 'shadow-[0_12px_16px_0_rgba(255,_255,_255,_0.04)_inset,_0_16px_6px_0_rgba(9,_10,_11,_0.02),_0_8px_4px_0_rgba(9,_10,_11,_0.04),_0_4px_4px_0_rgba(9,_10,_11,_0.08),_0_1px_2px_0_rgba(9,_10,_11,_0.10)]',
  },
  light: {
    bg: 'bg-white hover:bg-gray-100/50',
    fg: 'text-gray-950',
    shadow: 'shadow-sm',
  },
  lightPrimary: {
    bg: 'bg-white hover:bg-gray-100/80',
    fg: 'text-primary-500',
    shadow: 'shadow-sm',
  },
  gray: {
    bg: 'bg-gray-100 hover:bg-gray-200',
    fg: 'text-gray-950',
    shadow: 'shadow-sm',
  },
  ghostLight: {
    bg: 'bg-transparent',
    fg: 'text-gray-50 hover:text-gray-500',
    shadow: '',
  },
  ghostDark: {
    bg: '',
    fg: 'text-gray-950 hover:text-gray-500',
    shadow: '',
  },
  ghostPrimary: {
    bg: '',
    fg: 'text-primary-500 hover:text-primary-400',
    shadow: '',
  },

  ghost: {
    bg: 'hover:bg-surface-2',
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
