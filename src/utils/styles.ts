export const colorSchemes = {
  groove: {
    orange: 'rgba(245, 133, 73, 1)',
    magenta_haze: 'rgba(142, 85, 114, 1)',
    mint_cream: 'rgba(242, 247, 242, 1)',
    night: 'rgba(20, 20, 20, 1)',
    english_violet: 'rgba(68, 56, 80, 1)',
    light_english_violet: 'rgba(235, 231, 238, 1)',
  },
} as const;

export const shuffleColors = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const colors = {
  primary: colorSchemes.groove.night,
  textLight: colorSchemes.groove.mint_cream,
  textDark: colorSchemes.groove.english_violet,
  placeholder: colorSchemes.groove.light_english_violet,
  card: colorSchemes.groove.mint_cream,
  pill: colorSchemes.groove.english_violet,
} as const;

export const getTextColor = (theme: 'light' | 'dark') => {
  return theme === 'light' ? colors.textLight : colors.textDark;
};

export const headerHeight = 120;

const SHOW_DEBUG = false;

const randomColor = (alpha: number) =>
  `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256,
  )}, ${Math.floor(Math.random() * 256)}, ${alpha})`;
export const debugStyle = () =>
  __DEV__ && SHOW_DEBUG && `border: 1px solid ${randomColor(0.4)}`;
